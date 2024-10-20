import { Router } from "express";
import ChatbotController from "./Chatbot.controller";

const chatbotRouter = Router();
const chatbotController = new ChatbotController();

chatbotRouter.post(
  "/",
  chatbotController.messageResponse.bind(chatbotController)
);

export default chatbotRouter;
