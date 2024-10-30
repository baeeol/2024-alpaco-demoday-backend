import ServiceException from "@exception/Service.exception";
import UserRepository from "./User.repository";
import { LoginDTO, RegisterDTO } from "./dto";
import User from "./entity/User.entity";
import bcrypt from "bcrypt";
import UserFeature from "./entity/UserFeature.entity";

class UserService {
  private userRepository = new UserRepository();

  async login(loginDTO: LoginDTO) {
    try {
      const { nickname, password } = loginDTO;

      const sameNicknameUser = await this.userRepository.findByNickname(nickname);
      if (!sameNicknameUser || !bcrypt.compareSync(password, sameNicknameUser.password)) {
        throw new ServiceException("client", "nickname or password is wrong");
      }

      const { id, name } = sameNicknameUser;
      const feature = await this.userRepository.findFeatureById(id);
      if (!feature) {
        throw new ServiceException("server", "user feature does not exist");
      }
      const { interestPart } = feature;

      return { id: id, name: name, interestPart: interestPart };
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }

  async register(registerDTO: RegisterDTO) {
    try {
      const {
        nickname,
        name,
        belongTo,
        age,
        password,
        MBTI,
        interestPart,
        strength,
        favorite,
        sentenceOfoneself,
      } = registerDTO;

      const sameNicknameUser = await this.userRepository.findByNickname(nickname);
      if (sameNicknameUser) {
        throw new ServiceException("client", "nickname is exist");
      }

      const salt = bcrypt.genSaltSync();
      const digest = bcrypt.hashSync(password, salt);

      const newUser = new User(nickname, name, belongTo, age, digest, salt);
      const newUserFeature = new UserFeature(
        MBTI,
        interestPart,
        strength,
        favorite,
        sentenceOfoneself,
        newUser
      );

      const a = await this.userRepository.createUser(newUser, newUserFeature);
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }
}

export default UserService;
