import ServiceException from "@exception/Service.exception";
import UserRepository from "./User.repository";
import { LoginDTO, RegisterDTO } from "./dto";
import User from "./User.entity";
import bcrypt from "bcrypt";

class UserService {
  private userRepository = new UserRepository();

  async login(loginDTO: LoginDTO) {
    try {
      const { nickname, password } = loginDTO;

      const sameNicknameUser = await this.userRepository.findByNickname(nickname);
      if (!sameNicknameUser || !bcrypt.compareSync(password, sameNicknameUser.password)) {
        throw new ServiceException("client", "nickname or password is wrong");
      }

      return { id: sameNicknameUser.id, name: sameNicknameUser.name };
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }

  async register(registerDTO: RegisterDTO) {
    try {
      const { nickname, name, password } = registerDTO;

      const sameNicknameUser = await this.userRepository.findByNickname(nickname);
      if (sameNicknameUser) {
        throw new ServiceException("client", "nickname is exist");
      }

      const salt = bcrypt.genSaltSync();
      const digest = bcrypt.hashSync(password, salt);
      const newUser = new User(nickname, name, digest, salt);
      console.log(newUser);

      await this.userRepository.createUser(newUser);
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }
}

export default UserService;
