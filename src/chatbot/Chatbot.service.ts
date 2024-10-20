import ChatbotRequestDTO from "./dto/ChatbotRequest.dto";
import OpenAI from "openai";
import ServiceException from "@exception/Service.exception";
import dotenv from "dotenv";
dotenv.config();

class ChatbotService {
  private openai: OpenAI = new OpenAI({ apiKey: process.env["OPENAI_KEY"] });

  async respondMessage(chatbotRequestDTO: ChatbotRequestDTO) {
    try {
      const { message } = chatbotRequestDTO;
      const chatCompletion = await this.openai.chat.completions.create({
        messages: [{ role: "user", content: message }],
        model: "gpt-3.5-turbo",
      });

      const response = chatCompletion.choices[0].message.content;
      return response;
    } catch (e) {
      if (e instanceof ServiceException) {
        throw e;
      }

      throw new ServiceException("server", `${e}`);
    }
  }
}

export default ChatbotService;
