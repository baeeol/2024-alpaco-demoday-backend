import ChatbotRequestDTO from "./dto/ChatbotRequest.dto";
import OpenAI from "openai";
import ServiceException from "@exception/Service.exception";
import dotenv from "dotenv";
dotenv.config();

interface ChatCompletionMessageType {
  role: "assistant";
  content: string;
}

class ChatbotService {
  private openai: OpenAI = new OpenAI({ apiKey: process.env["OPENAI_KEY"] });

  async respondMessage(chatbotRequestDTO: ChatbotRequestDTO) {
    try {
      const { message, history } = chatbotRequestDTO;
      const historyMessages: ChatCompletionMessageType[] = history.map((m) => {
        return { role: "assistant", content: m };
      });
      const chatCompletion = await this.openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "너는 다른 사람의 질문을 듣고 좋은 대답을 해주는 사람이야.",
          },
          {
            role: "system",
            content: "항상 존댓말을 사용하고 정확한 정보를 알려주기 위해 노력해줘.",
          },
          ...historyMessages,
          { role: "user", content: message },
        ],
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
