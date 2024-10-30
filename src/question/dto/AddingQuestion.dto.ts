class AddingQuestionDTO {
  title: string;
  article: string;
  userId: number;

  constructor(title: string, article: string, userId: number) {
    this.title = title;
    this.article = article;
    this.userId = userId;
  }
}

export default AddingQuestionDTO;
