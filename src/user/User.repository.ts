import Database from "@config/Database";
import User from "./User.entity";

class UserRepository {
  private userRepository = Database.getRepository(User);

  async findByNickname(nickname: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { nickname: nickname } });
  }

  async createUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}

export default UserRepository;
