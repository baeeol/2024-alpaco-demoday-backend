import ChatbotRequestDTO from "./dto/ChatbotRequest.dto";
import OpenAI from "openai";
import ServiceException from "@exception/Service.exception";
import dotenv from "dotenv";
import UserRepository from "src/user/User.repository";
import UserFeature from "src/user/entity/UserFeature.entity";
dotenv.config();

interface ChatCompletionMessageType {
  role: "assistant" | "system" | "user";
  content: string;
}

class ChatbotService {
  private openai: OpenAI = new OpenAI({ apiKey: process.env["OPENAI_KEY"] });
  private userRepository = new UserRepository();

  async respondMessage(chatbotRequestDTO: ChatbotRequestDTO) {
    try {
      const { message, history, userId } = chatbotRequestDTO;
      const userFeature = await this.userRepository.findFeatureById(userId);
      if (!userFeature) {
        throw new ServiceException("server", "userFeature does not exist");
      }

      const chatCompletion = await this.openai.chat.completions.create({
        messages: this.createPrompt(message, userFeature, history),
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

  private createPrompt(
    message: string,
    userFeature: UserFeature,
    history: string[]
  ): ChatCompletionMessageType[] {
    const historyMessages: ChatCompletionMessageType[] = history.map((m) => {
      return { role: "assistant", content: m };
    });

    const prompt: ChatCompletionMessageType[] = [];

    const adjustmentPrompt: ChatCompletionMessageType[] = [
      {
        role: "system",
        content: `당신은 "${userFeature?.interestPart}"에 대해 아주 전문적인 지식을 가지고 있는 "알렉스"입니다.`,
      },
      {
        role: "system",
        content: `저는 MBTI가 ${userFeature?.MBTI}이고 ${userFeature?.strength}을 잘하며 좋아하는 건 ${userFeature?.favorite}입니다.`,
      },
      {
        role: "system",
        content: `저는 ${userFeature?.interestPart}에 대해 흥미가 있으며 관련 직종에 관심이 있습니다.`,
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
    ];
    prompt.push(...adjustmentPrompt);

    // if (historyMessages.length) {
    //   prompt.push(...[historyMessages[historyMessages.length - 1]]);
    // }

    prompt.push({
      role: "user",
      content: `추가적인 정보를 제공받기 보다는 앞서 말했던 제 정보를 참고하여 다음 질문에 대답하여 주십시오. ${message}`,
    });

    console.log(prompt);
    return prompt;
  }
}

export default ChatbotService;
