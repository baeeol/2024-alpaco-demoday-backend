import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Question from "./Question.entity";

@Entity("answer")
export default class Answer {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 60, nullable: false })
  article: string;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  constructor(article: string, question: Question) {
    this.article = article;
    this.question = question;
  }
}
