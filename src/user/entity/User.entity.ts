import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
