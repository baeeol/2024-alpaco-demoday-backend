class LoginDTO {
  nickname: string;
  password: string;

  constructor(nickname: string, password: string) {
    this.nickname = nickname;
    this.password = password;
  }
}

export default LoginDTO;
