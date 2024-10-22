import { Router } from "express";
import QuestionController from "./Question.controller";

const questionRouter = Router();
const questionController = new QuestionController();

questionRouter.get("/", questionController.questionSummaryList.bind(questionController));
questionRouter.get(
  "/:questionId",
  questionController.questionDetail.bind(questionController)
);
questionRouter.post("/", questionController.questionAdd.bind(questionController));
questionRouter.post(
  "/:questionId",
  questionController.answerAdd.bind(questionController)
);

export default questionRouter;
