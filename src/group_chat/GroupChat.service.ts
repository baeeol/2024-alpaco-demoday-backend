import ServiceException from "@exception/Service.exception";
import { AddingGroupChatDTO } from "./dto";
import GroupChat from "./GroupChat.entity";
import GroupChatRepository from "./GroupChat.repository";

class GroupChatService {
  private groupChatRepository = new GroupChatRepository();

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
}

export default GroupChatService;
