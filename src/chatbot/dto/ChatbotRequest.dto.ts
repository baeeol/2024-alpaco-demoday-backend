class ChatbotRequestDTO {
  message: string;
  history: string[];
  userId: number;

  constructor(message: string, history: string[], userId: number) {
    this.message = message;
    this.history = history;
    this.userId = userId;
  }
}

export default ChatbotRequestDTO;
