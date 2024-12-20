import { Router } from "express";
import UserController from "./User.controller";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/login", userController.login.bind(userController));
userRouter.post("/register", userController.register.bind(userController));
userRouter.get(
  "/examination/hanyang-major-aptitude",
  userController.hanyangMajorAptitudeResultFind.bind(userController)
);
userRouter.post(
  "/examination/hanyang-major-aptitude",
  userController.hanyangMajorAptitudeResultUpdate.bind(userController)
);

export default userRouter;
