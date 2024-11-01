import UserService from "./User.service";
import { LoginDTO, RegisterDTO } from "./dto/";
import { Request, Response } from "express";

class UserController {
  private userService = new UserService();

  async login(req: Request, res: Response, next: Function) {
    try {
      const { nickname, password } = req.body.loginData;
      const loginDTO = new LoginDTO(nickname, password);

      const accessToken = await this.userService.login(loginDTO);

      res.status(200).send({ accessToken: accessToken });
    } catch (e) {
      next(e);
    }
  }

  async register(req: Request, res: Response, next: Function) {
    try {
      const { nickname, name, belongTo, age, password } =
        req.body.registerData.accountData;
      const { MBTI, interestPart, strength, favorite, sentenceOfoneself } =
        req.body.registerData.featureData;
      const registerDTO = new RegisterDTO(
        nickname,
        name,
        belongTo,
        parseInt(age),
        password,
        MBTI,
        interestPart,
        strength,
        favorite,
        sentenceOfoneself
      );

      await this.userService.register(registerDTO);

      res.status(200).send();
    } catch (e) {
      next(e);
    }
  }

  async hanyangMajorAptitudeResultFind(req: Request, res: Response, next: Function) {
    try {
      const { userId } = req.body;

      const result = await this.userService.findHanyangMajorAptitudeResult(userId);

      res.status(200).send({ result: result });
    } catch (e) {
      next(e);
    }
  }

  async hanyangMajorAptitudeResultUpdate(req: Request, res: Response, next: Function) {
    try {
      const { userId, result } = req.body;

      await this.userService.updateHanyangMajorAptitudeResult(userId, result);

      res.status(200).send();
    } catch (e) {
      next(e);
    }
  }
}

export default UserController;
