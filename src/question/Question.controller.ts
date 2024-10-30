import { AddingAnswerDTO, AddingQuestionDTO } from "./dto";
import QuestionService from "./Question.service";
import { Request, Response } from "express";

class QuestionController {
  private questionService = new QuestionService();

  async questionSummaryList(req: Request, res: Response, next: Function) {
    try {
      const searchKeyword = req.query.search || "";
      console.log(req.query);
      const questionList = await this.questionService.findAllQuestionSummary(
        searchKeyword as string
      );

      res.status(200).send({ questionList: questionList });
    } catch (e) {
      next(e);
    }
  }

  async questionDetail(req: Request, res: Response, next: Function) {
    try {
      const questionId = parseInt(req.params.questionId);
      const questionDetail = await this.questionService.findQuestionDetail(questionId);

      res.status(200).send({ question: questionDetail });
    } catch (e) {
      next(e);
    }
  }

  async questionAdd(req: Request, res: Response, next: Function) {
    try {
      const { title, article } = req.body.questionData;
      const { userId } = req.body;
      const addingQuestionDTO = new AddingQuestionDTO(title, article, userId);
      const newQuestionId = await this.questionService.addQuestion(addingQuestionDTO);

      res.status(200).send({ questionId: newQuestionId });
    } catch (e) {
      next(e);
    }
  }

  async answerAdd(req: Request, res: Response, next: Function) {
    try {
      const { article } = req.body.answerData;
      const { userId } = req.body;
      const questionId = parseInt(req.params.questionId);
      const addingAnswerDTO = new AddingAnswerDTO(article, questionId, userId);
      await this.questionService.addAnswer(addingAnswerDTO);

      res.status(200).send();
    } catch (e) {
      next(e);
    }
  }
}

export default QuestionController;
