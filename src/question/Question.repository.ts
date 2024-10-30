import Database from "@config/Database";
import Question from "./entity/Question.entity";
import Answer from "./entity/Answer.entity";

class QuestionRepository {
  private questionRepository = Database.getRepository(Question);
  private answerRepository = Database.getRepository(Answer);

  async findAllQuestionJoinQuestionerAndAnswer(): Promise<Question[]> {
    return this.questionRepository.find({ relations: ["questioner", "answers"] });
  }

  async findQuestionById(questionId: number): Promise<Question | null> {
    return this.questionRepository.findOne({ where: { id: questionId } });
  }

  async findQuestionByIdJoinQuestinerAndAnswer(
    questionId: number
  ): Promise<Question | null> {
    return this.questionRepository.findOne({
      where: { id: questionId },
      relations: ["answers", "questioner"],
    });
  }

  async createQuestion(question: Question): Promise<Question> {
    return this.questionRepository.save(question);
  }

  async findAnswerByIdJoinAnswerer(answerId: number): Promise<Answer | null> {
    return this.answerRepository.findOne({
      relations: ["answerer"],
      where: { id: answerId },
    });
  }

  async createAnswer(answer: Answer): Promise<Answer> {
    return this.answerRepository.save(answer);
  }
}

export default QuestionRepository;
