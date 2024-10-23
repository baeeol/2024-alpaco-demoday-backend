class RegisterDTO {
  nickname: string;
  name: string;
  belongTo: string;
  age: number;
  password: string;

  constructor(
    nickname: string,
    name: string,
    belongTo: string,
    age: number,
    password: string
  ) {
    this.nickname = nickname;
    this.name = name;
    this.belongTo = belongTo;
    this.age = age;
    this.password = password;
  }
}

export default RegisterDTO;
