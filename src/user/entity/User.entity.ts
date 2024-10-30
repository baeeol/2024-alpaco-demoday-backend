import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import GroupChatMessage from "src/group_chat/entity/GroupChatMessage.entity";
import Question from "src/question/entity/Question.entity";
import Answer from "src/question/entity/Answer.entity";

@Entity("user")
export default class User {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  nickname: string;

  @Column("varchar", { length: 10, nullable: false })
  name: string;

  @Column("varchar", { length: 20, nullable: false })
  belongTo: string;

  @Column("varchar", { nullable: false })
  age: number;

  @Column("varchar", { length: 128, nullable: false })
  password: string;

  @Column("varchar", { length: 128, nullable: false })
  salt: string;

  @OneToMany(() => GroupChatMessage, (groupChatMessage) => groupChatMessage.commenter)
  messages!: GroupChatMessage[];

  @OneToMany(() => Question, (question) => question.questioner)
  questions!: Question[];

  @OneToMany(() => Answer, (answer) => answer.answerer)
  answers!: Answer[];

  constructor(
    nickname: string,
    name: string,
    belongTo: string,
    age: number,
    password: string,
    salt: string
  ) {
    this.nickname = nickname;
    this.name = name;
    this.belongTo = belongTo;
    this.age = age;
    this.password = password;
    this.salt = salt;
  }
}
