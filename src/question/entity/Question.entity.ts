import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Answer from "./Answer.entity";

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

  constructor(title: string, article: string) {
    this.title = title;
    this.article = article;
  }
}
