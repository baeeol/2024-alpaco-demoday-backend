import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Question from "./Question.entity";
import User from "src/user/entity/User.entity";

@Entity("answer")
export default class Answer {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 60, nullable: false })
  article: string;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  @ManyToOne(() => User, (user) => user.answers)
  answerer: User;

  constructor(article: string, question: Question, answerer: User) {
    this.article = article;
    this.question = question;
    this.answerer = answerer;
  }
}
