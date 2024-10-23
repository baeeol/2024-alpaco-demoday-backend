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
      const { nickname, name, password } = req.body.registerData;
      const registerDTO = new RegisterDTO(nickname, name, password);

      await this.userService.register(registerDTO);

      res.status(200).send();
    } catch (e) {
      next(e);
    }
  }
}

export default UserController;
