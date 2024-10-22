import { ControllerException, ServiceException } from "@exception";
import { Router, Request, Response } from "express";
import chatbotRouter from "src/chatbot/Chatbot.router";
import groupChatRouter from "src/group_chat/GroupChat.router";
import questionRouter from "src/question/Question.router";

const appRouter = Router();

// routing
appRouter.use("/chatbot", chatbotRouter);
appRouter.use("/group-chat", groupChatRouter);
appRouter.use("/question", questionRouter);

// error handling
appRouter.use((err: object, req: Request, res: Response, next: Function) => {
  if (err instanceof ControllerException) {
    res.status(400).send(err.message);
  } else if (err instanceof ServiceException) {
    switch (err.reason) {
      case "client":
        res.status(400).send(err.message);
        break;

      default:
        console.log(err);
        res.status(500).send("internal server error");
    }
    return;
  }
});

export default appRouter;
