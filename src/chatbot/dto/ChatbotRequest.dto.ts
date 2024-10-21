class ChatbotRequestDTO {
  message: string;
  history: string[];

  constructor(message: string, history: string[]) {
    this.message = message;
    this.history = history;
  }
}

export default ChatbotRequestDTO;
