import { Router } from "express";
import GroupChatController from "./GroupChat.controller";

const groupChatRouter = Router();
const groupChatController = new GroupChatController();

groupChatRouter.post("/", groupChatController.groupChatAdd.bind(groupChatController));
groupChatRouter.get("/", groupChatController.groupChatList.bind(groupChatController));

export default groupChatRouter;
