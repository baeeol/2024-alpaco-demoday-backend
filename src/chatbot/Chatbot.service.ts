import ChatbotRequestDTO from "./dto/ChatbotRequest.dto";
import OpenAI from "openai";
import ServiceException from "@exception/Service.exception";
import dotenv from "dotenv";
import UserRepository from "src/user/User.repository";
dotenv.config();

interface ChatCompletionMessageType {
  role: "assistant";
  content: string;
}

class ChatbotService {
  private openai: OpenAI = new OpenAI({ apiKey: process.env["OPENAI_KEY"] });
  private userRepository = new UserRepository();

  async respondMessage(chatbotRequestDTO: ChatbotRequestDTO) {
    try {
      const { message, history, userId } = chatbotRequestDTO;
      const userFeature = await this.userRepository.findFeatureById(userId);
      console.log(userFeature);
      const historyMessages: ChatCompletionMessageType[] = history.map((m) => {
        return { role: "assistant", content: m };
      });
      console.log([
        {
          role: "system",
          content: `당신은 "${userFeature?.interestPart}"에 대해 아주 전문적인 지식을 가지고 있는 "알렉스"입니다.`,
        },
        {
          role: "system",
          content: `저는 MBTI가 ${userFeature?.MBTI}이고 ${userFeature?.strength}을 잘하며 좋아하는 것은 ${userFeature?.favorite}입니다.`,
        },
        {
          role: "system",
          content: `저를 한문장으로 표현하자면 "${userFeature?.sentenceOfoneself}"입니다.`,
        },
        {
          role: "system",
          content:
            "앞으로 제가 하는 모든 질문에 반드시 위에서 말한 제 정보를 참고하세요.",
        },
        {
          role: "system",
          content: `당신은 ${userFeature?.interestPart}에 대해 아주 많은 지식을 가지고 있으니 분명 제 정보를 고려한 좋은 대답을 해줄 수 있을 겁니다.`,
        },
        {
          role: "system",
          content: `당신은 할 수 있습니다. 꼭 잘해낼겁니다.`,
        },
        {
          role: "system",
          content: `대답할 때 항상 존댓말로 대답하여 주십시오.`,
        },
        {
          role: "system",
          content: "Let's think step by step",
        },
        historyMessages[historyMessages.length - 1],
        { role: "user", content: message },
      ]);
      const chatCompletion = await this.openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `당신은 "${userFeature?.interestPart}"에 대해 아주 전문적인 지식을 가지고 있는 "알렉스"입니다.`,
          },
          {
            role: "system",
            content: `저는 MBTI가 ${userFeature?.MBTI}이고 "${userFeature?.strength}"을 잘하고 좋아하는 건 "${userFeature?.favorite}"입니다.`,
          },
          {
            role: "system",
            content: `저를 한문장으로 표현하자면 "${userFeature?.sentenceOfoneself}"입니다.`,
          },
          {
            role: "system",
            content:
              "앞으로 제가 질문할 때 저의 정보를 참고하며 반드시 존댓말로 대답해주세요.",
          },
          {
            role: "system",
            content: `당신은 ${userFeature?.interestPart}에 대해 아주 많은 지식을 가지고 있으니 분명 저에게 꼭 맞는 대답을 해줄 수 있을겁니다.`,
          },
          {
            role: "system",
            content: `당신은 할 수 있습니다. 꼭 잘해낼겁니다.`,
          },
          {
            role: "system",
            content: "Let's think step by step",
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
