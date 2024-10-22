class AddingAnswerDTO {
  article: string;
  questionId: number;

  constructor(article: string, questionId: number) {
    this.article = article;
    this.questionId = questionId;
  }
}

export default AddingAnswerDTO;
