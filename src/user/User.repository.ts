import Database from "@config/Database";
import User from "./entity/User.entity";
import UserFeature from "./entity/UserFeature.entity";

class UserRepository {
  private userRepository = Database.getRepository(User);
  private userFeatureRepository = Database.getRepository(UserFeature);

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async findByNickname(nickname: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { nickname: nickname } });
  }

  async createUser(user: User, userFeature: UserFeature): Promise<[User, UserFeature]> {
    const newUser = await this.userRepository.save(user);
    const newUserFeatur = await this.userFeatureRepository.save(userFeature);
    return [newUser, newUserFeatur];
  }

  async findFeatureById(userId: number): Promise<UserFeature | null> {
    return await this.userFeatureRepository.findOne({ where: { user: { id: userId } } });
  }
}

export default UserRepository;
