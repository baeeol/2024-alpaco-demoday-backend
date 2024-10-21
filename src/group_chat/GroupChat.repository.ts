import Database from "@config/Database";
import GroupChat from "./entity/GroupChat.entity";
import GroupChatMessage from "./entity/GroupChatMessage.entity";

class GroupChatRepository {
  private groupChatRepository = Database.getRepository(GroupChat);
  private groupChatMessageRepository = Database.getRepository(GroupChatMessage);

  async createGroupChat(groupChat: GroupChat): Promise<GroupChat> {
    return await this.groupChatRepository.save(groupChat);
  }

  async findAllGroupChat(): Promise<GroupChat[]> {
    return await this.groupChatRepository.find();
  }

  async findGroupChatById(id: number): Promise<GroupChat | null> {
    return await this.groupChatRepository.findOne({ where: { id: id } });
  }

  async findGroupChatMessageByGroupChatId(
    groupChatId: number
  ): Promise<GroupChatMessage[]> {
    return await this.groupChatMessageRepository.find({
      relations: { groupChat: true },
      where: { groupChat: { id: groupChatId } },
    });
  }

  async createMessage(groupChatMessage: GroupChatMessage): Promise<GroupChatMessage> {
    return await this.groupChatMessageRepository.save(groupChatMessage);
  }
}

export default GroupChatRepository;
