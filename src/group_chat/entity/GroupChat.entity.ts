import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import GroupChatMessage from "./GroupChatMessage.entity";

@Entity("group_chat")
export default class GroupChat {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 60, nullable: false })
  name: string;

  @Column("varchar", { length: 60, nullable: false })
  tag: string;

  @OneToMany(() => GroupChatMessage, (groupChatMessage) => groupChatMessage.groupChat)
  messages!: GroupChatMessage;

  constructor(name: string, tag: string) {
    this.name = name;
    this.tag = tag;
  }
}
