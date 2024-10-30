import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import GroupChat from "./GroupChat.entity";
import User from "src/user/entity/User.entity";

@Entity("group_chat_message")
export default class GroupChatMessage {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 2000, nullable: false })
  message: string;

  @ManyToOne(() => GroupChat, (groupChat) => groupChat.messages)
  groupChat: GroupChat;

  @ManyToOne(() => User, (user) => user.messages)
  commenter: User;

  constructor(message: string, groupChat: GroupChat, commenter: User) {
    this.message = message;
    this.groupChat = groupChat;
    this.commenter = commenter;
  }
}
