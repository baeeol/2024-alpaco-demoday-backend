import ChatbotService from "./Chatbot.service";
import { Request, Response } from "express";
import ChatbotRequestDTO from "./dto/ChatbotRequest.dto";

class ChatbotController {
  private ChatbotService = new ChatbotService();

  async messageResponse(req: Request, res: Response, next: Function) {
    try {
      const { message, history, userId } = req.body;
      const chatbotRequestDTO: ChatbotRequestDTO = new ChatbotRequestDTO(
        message,
        history,
        parseInt(userId)
      );
      const response = await this.ChatbotService.respondMessage(chatbotRequestDTO);

      res.status(200).send({ message: response });
    } catch (e) {
      next(e);
    }
  }
}

export default ChatbotController;
