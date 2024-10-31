import UserRepository from "src/user/User.repository";
import { AddingAnswerDTO, AddingQuestionDTO } from "./dto";
import Answer from "./entity/Answer.entity";
import Question from "./entity/Question.entity";
import QuestionRepository from "./Question.repository";
import ServiceException from "@exception/Service.exception";

class QuestionService {
  private questionRepository = new QuestionRepository();
  private userRepository = new UserRepository();

  async findAllQuestionSummary(searchKeyword: string) {
    try {
      const questionEntityList =
        await this.questionRepository.findAllQuestionJoinQuestionerAndAnswer();

      // 검색 키워드에 따른 필터링 진행
      const questionList = await Promise.all(
        questionEntityList
          .filter((questionEntity) => {
            return (
              questionEntity.title.includes(searchKeyword) ||
              questionEntity.article.includes(searchKeyword)
            );
          })
          .map(async (questionEntity) => {
            const { id, title, article, answers, questioner } = questionEntity;
            const questionerFeature = await this.userRepository.findFeatureById(
              questioner.id
            );
            if (!questionerFeature) {
              throw new ServiceException("server", "questioner feature does not exist");
            }

            return {
              id: id,
              title: title,
              article: article,
              amountOfAnswers: answers.length,
              questioner: {
                name: questioner.name,
                interestPart: questionerFeature.interestPart,
                belongTo: questioner.belongTo,
              },
            };
          })
      );

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
      const questionEntity =
        await this.questionRepository.findQuestionByIdJoinQuestinerAndAnswer(questionId);
      if (!questionEntity) {
        throw new ServiceException("client", "question does not exist");
      }

      const { title, article } = questionEntity as Question;
      const answerList = await Promise.all(
        questionEntity.answers.map(async (answerEntity) => {
          const { id, article } = answerEntity;
          const answer = await this.questionRepository.findAnswerByIdJoinAnswerer(id);
          if (!answer) {
            throw new ServiceException("server", "answer does not exist");
          }
          const answerFeature = await this.userRepository.findFeatureById(
            answer.answerer.id
          );
          if (!answerFeature) {
            throw new ServiceException("server", "answerer feature does not exist");
          }

          return {
            answerer: {
              id: answer.answerer.id,
              name: answer.answerer.name,
              interestPart: answerFeature.interestPart,
              belongTo: answer.answerer.belongTo,
            },
            article: article,
          };
        })
      );

      return {
        title: title,
        article: article,
        questioner: { id: questionEntity.questioner.id },
        answerList: answerList,
      };
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }

  async addQuestion(addingQuestionDTO: AddingQuestionDTO) {
    try {
      const { title, article, userId } = addingQuestionDTO;

      const questioner = await this.userRepository.findById(userId);
      if (!questioner) {
        throw new ServiceException("client", "questioner does not exist");
      }

      const question = new Question(title, article, questioner);
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
      const { article, questionId, userId } = addingAnswerDTO;

      const question = await this.questionRepository.findQuestionById(questionId);
      if (!question) {
        throw new ServiceException("client", "question does not exist");
      }

      const answerer = await this.userRepository.findById(userId);
      if (!answerer) {
        throw new ServiceException("client", "answerer does not exist");
      }

      const answer = new Answer(article, question, answerer);
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
