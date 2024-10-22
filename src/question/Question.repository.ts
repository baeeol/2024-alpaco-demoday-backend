import Database from "@config/Database";
import Question from "./entity/Question.entity";
import Answer from "./entity/Answer.entity";

class QuestionRepository {
  private questionRepository = Database.getRepository(Question);
  private answerRepository = Database.getRepository(Answer);

  async findAllQuestionJoinAnswer(): Promise<Question[]> {
    return this.questionRepository.find({ relations: ["answers"] });
  }

  async findQuestionById(questionId: number): Promise<Question | null> {
    return this.questionRepository.findOne({ where: { id: questionId } });
  }

  async findQuestionByIdJoinAnswer(questionId: number): Promise<Question | null> {
    return this.questionRepository.findOne({
      where: { id: questionId },
      relations: ["answers"],
    });
  }

  async createQuestion(question: Question): Promise<Question> {
    return this.questionRepository.save(question);
  }

  async createAnswer(answer: Answer): Promise<Answer> {
    return this.answerRepository.save(answer);
  }
}

export default QuestionRepository;
