import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Answer from "./Answer.entity";
import User from "src/user/entity/User.entity";

@Entity("question")
export default class Question {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 60, nullable: false })
  title: string;

  @Column("varchar", { length: 200, nullable: false })
  article: string;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers!: Answer[];

  @ManyToOne(() => User, (user) => user.messages)
  questioner: User;

  constructor(title: string, article: string, questioner: User) {
    this.title = title;
    this.article = article;
    this.questioner = questioner;
  }
}
