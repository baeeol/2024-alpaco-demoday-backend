import Database from "@config/Database";
import User from "./entity/User.entity";
import UserFeature from "./entity/UserFeature.entity";
import HanyangMajorAptitudeResult, {
  HANYNAG_MAJOR_APTITUDE_RESULT_TYPE,
} from "./entity/HanyangMajorAptitudeResult.entity";
import { UpdateResult } from "typeorm";

class UserRepository {
  private userRepository = Database.getRepository(User);
  private userFeatureRepository = Database.getRepository(UserFeature);
  private hanyangMajorAptitudeResultRepository = Database.getRepository(
    HanyangMajorAptitudeResult
  );

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async findByNickname(nickname: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { nickname: nickname } });
  }

  async createUser(user: User, userFeature: UserFeature): Promise<[User, UserFeature]> {
    const newUser = await this.userRepository.save(user);
    const newUserFeatur = await this.userFeatureRepository.save(userFeature);
    await this.hanyangMajorAptitudeResultRepository.save(
      new HanyangMajorAptitudeResult(null, null, null, null, null, null, user)
    );

    return [newUser, newUserFeatur];
  }

  async findFeatureById(userId: number): Promise<UserFeature | null> {
    return await this.userFeatureRepository.findOne({ where: { user: { id: userId } } });
  }

  async findHanyangMajorAptitudeResultByUserId(
    userId: number
  ): Promise<HanyangMajorAptitudeResult | null> {
    return await this.hanyangMajorAptitudeResultRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  async updateHanyangMajorAptitudeResultByUserId(
    userId: number,
    result: HANYNAG_MAJOR_APTITUDE_RESULT_TYPE
  ): Promise<UpdateResult> {
    return await this.hanyangMajorAptitudeResultRepository.update(
      {
        user: { id: userId },
      },
      { A: result.A, B: result.B, C: result.C, D: result.D, E: result.E, F: result.F }
    );
  }
}

export default UserRepository;
