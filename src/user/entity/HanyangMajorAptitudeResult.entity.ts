import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User.entity";

export type HANYNAG_MAJOR_APTITUDE_RESULT_TYPE = {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
};

export type HANYNAG_MAJOR_APTITUDE_AREA = "A" | "B" | "C" | "D" | "E" | "F";

@Entity("hanyang_major_aptitude_result")
export default class HanyangMajorAptitudeResult {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("int", { nullable: true })
  A: number | null;

  @Column("int", { nullable: true })
  B: number | null;

  @Column("int", { nullable: true })
  C: number | null;

  @Column("int", { nullable: true })
  D: number | null;

  @Column("int", { nullable: true })
  E: number | null;

  @Column("int", { nullable: true })
  F: number | null;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  constructor(
    A: number | null,
    B: number | null,
    C: number | null,
    D: number | null,
    E: number | null,
    F: number | null,
    user: User
  ) {
    this.A = A;
    this.B = B;
    this.C = C;
    this.D = D;
    this.E = E;
    this.F = F;
    this.user = user;
  }
}
