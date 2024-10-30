import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User.entity";

export enum MBTI {
  ISTJ = "ISTJ",
  ISFJ = "ISFJ",
  INFJ = "INFJ",
  INTJ = "INTJ",
  ISTP = "ISTP",
  ISFP = "ISFP",
  INFP = "INFP",
  INTP = "INTP",
  ESTP = "ESTP",
  ESFP = "ESFP",
  ENFP = "ENFP",
  ENTP = "ENTP",
  ESTJ = "ESTJ",
  ESFJ = "ESFJ",
  ENFJ = "ENFJ",
  ENTJ = "ENTJ",
}

@Entity("user_feature")
export default class UserFeature {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 4, nullable: false })
  MBTI: MBTI;

  @Column("varchar", { length: 10, nullable: false })
  interestPart: string;

  @Column("varchar", { length: 20, nullable: false })
  strength: string;

  @Column("varchar", { nullable: false })
  favorite: string;

  @Column("varchar", { length: 128, nullable: false })
  sentenceOfoneself: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  constructor(
    MBTI: MBTI,
    interestPart: string,
    strength: string,
    favorite: string,
    sentenceOfoneself: string,
    user: User
  ) {
    this.MBTI = MBTI;
    this.interestPart = interestPart;
    this.strength = strength;
    this.favorite = favorite;
    this.sentenceOfoneself = sentenceOfoneself;
    this.user = user;
  }
}
