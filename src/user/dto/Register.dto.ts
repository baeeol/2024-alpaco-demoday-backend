class RegisterDTO {
  nickname: string;
  name: string;
  password: string;

  constructor(nickname: string, name: string, password: string) {
    this.nickname = nickname;
    this.name = name;
    this.password = password;
  }
}

export default RegisterDTO;
