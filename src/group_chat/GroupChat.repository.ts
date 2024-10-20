import Database from "@config/Database";
import GroupChat from "./GroupChat.entity";

class GroupChatRepository {
  private groupChatRepository = Database.getRepository(GroupChat);

  async createGroupChat(groupChat: GroupChat): Promise<GroupChat> {
    return await this.groupChatRepository.save(groupChat);
  }

  async findAllGroupChat(): Promise<GroupChat[]> {
    return await this.groupChatRepository.find();
  }
}

export default GroupChatRepository;
