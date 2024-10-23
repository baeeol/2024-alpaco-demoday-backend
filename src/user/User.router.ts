import { Router } from "express";
import UserController from "./User.controller";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/login", userController.login.bind(userController));
userRouter.post("/register", userController.register.bind(userController));

export default userRouter;
