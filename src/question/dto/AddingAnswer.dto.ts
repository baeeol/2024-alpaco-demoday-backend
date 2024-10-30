class AddingAnswerDTO {
  article: string;
  questionId: number;
  userId: number;

  constructor(article: string, questionId: number, userId: number) {
    this.article = article;
    this.questionId = questionId;
    this.userId = userId;
  }
}

export default AddingAnswerDTO;
