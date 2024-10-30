import { MBTI } from "../entity/UserFeature.entity";

class RegisterDTO {
  nickname: string;
  name: string;
  belongTo: string;
  age: number;
  password: string;
  MBTI: MBTI;
  interestPart: string;
  strength: string;
  favorite: string;
  sentenceOfoneself: string;

  constructor(
    nickname: string,
    name: string,
    belongTo: string,
    age: number,
    password: string,
    MBTI: MBTI,
    interestPart: string,
    strength: string,
    favorite: string,
    sentenceOfoneself: string
  ) {
    this.nickname = nickname;
    this.name = name;
    this.belongTo = belongTo;
    this.age = age;
    this.password = password;
    this.MBTI = MBTI;
    this.interestPart = interestPart;
    this.strength = strength;
    this.favorite = favorite;
    this.sentenceOfoneself = sentenceOfoneself;
  }
}

export default RegisterDTO;
