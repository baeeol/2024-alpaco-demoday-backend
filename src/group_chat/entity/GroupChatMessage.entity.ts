import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import GroupChat from "./GroupChat.entity";

@Entity("group_chat_message")
export default class GroupChatMessage {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 2000, nullable: false })
  message: string;

  @ManyToOne(() => GroupChat, (groupChat) => groupChat.messages)
  groupChat: GroupChat;

  constructor(message: string, groupChat: GroupChat) {
    this.message = message;
    this.groupChat = groupChat;
  }
}
