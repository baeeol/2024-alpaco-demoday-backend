import ServiceException from "@exception/Service.exception";
import { AddingGroupChatDTO, AddingGroupChatMessageDTO } from "./dto";
import GroupChat from "./entity/GroupChat.entity";
import GroupChatRepository from "./GroupChat.repository";
import GroupChatMessage from "./entity/GroupChatMessage.entity";
import UserRepository from "src/user/User.repository";

class GroupChatService {
  private groupChatRepository = new GroupChatRepository();
  private userRepository = new UserRepository();

  async addGroupChat(addingGroupChatDTO: AddingGroupChatDTO) {
    try {
      const { name, tag } = addingGroupChatDTO;

      // tag filtering sperate = ','
      const filterdTag = tag
        .split(" ")
        .filter((s) => {
          return s.includes("#");
        })
        .map((s) => {
          return s.substring(s.indexOf("#"), s.length);
        })
        .filter((s) => {
          return s.length > 1;
        })
        .toString();

      const groupChat = new GroupChat(name, filterdTag);
      await this.groupChatRepository.createGroupChat(groupChat);
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }

  async findGroupChatList(searchKeyword: string) {
    try {
      const allGroupChatEntityList = await this.groupChatRepository.findAllGroupChat();

      // filtering group chat with search keyword
      const filterdGroupChatEntityList = allGroupChatEntityList.filter((groupChat) => {
        const { name, tag } = groupChat;
        return (
          name.includes(searchKeyword) || tag.split(",").includes(`#${searchKeyword}`)
        );
      });

      const allGroupChatList = filterdGroupChatEntityList.map((groupChatEntity) => {
        const { id, name, tag } = groupChatEntity;
        return { id: id, name: name, tag: tag };
      });

      return allGroupChatList;
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }

  async findMessage(groupChatId: number) {
    try {
      const groupChatMessageEntityList =
        await this.groupChatRepository.findMessageByChatIdJoinCommenter(groupChatId);

      const groupChatMessageList = await Promise.all(
        groupChatMessageEntityList.map(async (groupChatMessageEntity) => {
          const { message, commenter } = groupChatMessageEntity;
          const commenterFeature = await this.userRepository.findFeatureById(
            commenter.id
          );
          if (!commenterFeature) {
            throw new ServiceException("server", "user feature deos not exist");
          }

          return {
            commenter: {
              id: commenter.id,
              name: commenter.name,
              interestPart: commenterFeature.interestPart,
              belongTo: commenter.belongTo,
            },
            message: message,
          };
        })
      );

      return groupChatMessageList;
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }

  async addMessage(addingGroupChatMessageDTO: AddingGroupChatMessageDTO) {
    try {
      const { message, groupChatId, userId } = addingGroupChatMessageDTO;

      const groupChat = await this.groupChatRepository.findGroupChatById(groupChatId);
      if (!groupChat) {
        throw new ServiceException("client", "group chat does not exist.");
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new ServiceException("client", "user does not exist.");
      }

      const groupChatMessage = new GroupChatMessage(message, groupChat, user);
      await this.groupChatRepository.createMessage(groupChatMessage);
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }
}

export default GroupChatService;
