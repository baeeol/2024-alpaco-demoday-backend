import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("group_chat")
export default class GroupChat {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 60, nullable: false })
  name: string;

  @Column("varchar", { length: 60, nullable: false })
  tag: string;

  constructor(name: string, tag: string) {
    this.name = name;
    this.tag = tag;
  }
}
