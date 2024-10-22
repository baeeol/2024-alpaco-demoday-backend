import { AddingAnswerDTO, AddingQuestionDTO } from "./dto";
import Answer from "./entity/Answer.entity";
import Question from "./entity/Question.entity";
import QuestionRepository from "./Question.repository";
import ServiceException from "@exception/Service.exception";

class QuestionService {
  private questionRepository = new QuestionRepository();

  async findAllQuestionSummary(searchKeyword: string) {
    try {
      const questionEntityList =
        await this.questionRepository.findAllQuestionJoinAnswer();

      // 검색 키워드에 따른 필터링 진행
      const questionList = questionEntityList
        .filter((questionEntity) => {
          return (
            questionEntity.title.includes(searchKeyword) ||
            questionEntity.article.includes(searchKeyword)
          );
        })
        .map((questionEntity) => {
          const { id, title, article, answers } = questionEntity;
          return {
            id: id,
            title: title,
            article: article,
            amountOfAnswers: answers.length,
          };
        });

      return questionList;
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }

  async findQuestionDetail(questionId: number) {
    try {
      const questionEntity = await this.questionRepository.findQuestionByIdJoinAnswer(
        questionId
      );
      if (!questionEntity) {
        throw new ServiceException("client", "question is not exist");
      }
      const { title, article } = questionEntity as Question;
      const answerList = questionEntity.answers.map((answerEntity) => {
        return answerEntity.article;
      });

      return { title: title, article: article, answerList: answerList };
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }

  async addQuestion(addingQuestionDTO: AddingQuestionDTO) {
    try {
      const { title, article } = addingQuestionDTO;
      const question = new Question(title, article);

      const newQuestion = await this.questionRepository.createQuestion(question);

      return newQuestion.id;
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }

  async addAnswer(addingAnswerDTO: AddingAnswerDTO) {
    try {
      const { article, questionId } = addingAnswerDTO;
      const question = await this.questionRepository.findQuestionById(questionId);
      if (!question) {
        throw new ServiceException("client", "question is not exist");
      }

      const answer = new Answer(article, question as Question);
      await this.questionRepository.createAnswer(answer);
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }
}

export default QuestionService;
