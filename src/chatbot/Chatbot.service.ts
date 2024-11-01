import ChatbotRequestDTO from "./dto/ChatbotRequest.dto";
import OpenAI from "openai";
import ServiceException from "@exception/Service.exception";
import dotenv from "dotenv";
import UserRepository from "src/user/User.repository";
import UserFeature from "src/user/entity/UserFeature.entity";
import HanyangMajorAptitudeResult, {
  HANYNAG_MAJOR_APTITUDE_AREA,
} from "src/user/entity/HanyangMajorAptitudeResult.entity";
dotenv.config();

interface ChatCompletionMessageType {
  role: "assistant" | "system" | "user";
  content: string;
}

interface tendencyByHanyangMajorAptitude {
  suitableAreas: HANYNAG_MAJOR_APTITUDE_AREA[] | null;
  unsuitableAreas: HANYNAG_MAJOR_APTITUDE_AREA[] | null;
  majorArea: HANYNAG_MAJOR_APTITUDE_AREA | null;
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
      const hanyangMajorAptitudeResult =
        await this.userRepository.findHanyangMajorAptitudeResultByUserId(userId);
      const { A, B, C, D, E, F } =
        hanyangMajorAptitudeResult as HanyangMajorAptitudeResult;
      const tendencyByHanyangMajorAptitude: tendencyByHanyangMajorAptitude = A
        ? this.getTendencyByHanyangMajorAptitude({
            A: A,
            B: B as number,
            C: C as number,
            D: D as number,
            E: E as number,
            F: F as number,
          })
        : { suitableAreas: null, unsuitableAreas: null, majorArea: null };

      const chatCompletion = await this.openai.chat.completions.create({
        messages: this.createPrompt(
          message,
          userFeature,
          tendencyByHanyangMajorAptitude,
          history
        ),
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
    tendencyByHanyangMajorAptitude: tendencyByHanyangMajorAptitude,
    history: string[]
  ): ChatCompletionMessageType[] {
    const historyMessages: ChatCompletionMessageType[] = history.map((m) => {
      return { role: "assistant", content: m };
    });

    const prompt: ChatCompletionMessageType[] = [];

    const adjustmentPrompt: ChatCompletionMessageType[] = [
      {
        role: "system",
        content: `You are the world's best professional in "${userFeature?.interestPart}`,
      },
      {
        role: "system",
        content: `and are also very skilled at explaining difficult concepts in simple terms.`,
      },
      {
        role: "system",
        content: `You will be my career coach and need to answer realistically and strictly.`,
      },
      {
        role: "system",
        content: `To give you some information about me, my MBTI is ${userFeature?.MBTI}, my strength is ${userFeature?.strength}, and my favorite thing to do is ${userFeature?.favorite}, and my favorite thing to do is ${userFeature?.favorite}.`,
      },
      {
        role: "system",
        content: `I am interested in ${userFeature?.interestPart} and related occupations.`,
      },
      {
        role: "system",
        content: `If I were to describe myself in one sentence, it would be "${userFeature?.sentenceOfoneself}".`,
      },
      {
        role: "system",
        content: `Please respond in Korean and use """honorific expressions""" in """Korean""".`,
      },
      {
        role: "system",
        content:
          "You are the best in this field and have the best explanation tactics for each MBTI",
      },
      {
        role: "system",
        content:
          "Let's proceed step by step to ensure you can provide me with the best answers.",
      },
      {
        role: "system",
        content: "I emphasize once more that your answer should be written in Korean.",
      },
    ];
    prompt.push(...adjustmentPrompt);

    const EXAMINATION_RESULTS = {
      A: {
        title: "Engineering, technical inclinations",
        description: [
          "The attitude of honing your expertise, including mastering skills",
          "Adapting attitudes toward new materials and technologies",
          "An attitude of being efficient with machines (tools) and resources",
        ],
      },
      B: {
        title: "Nature, scientific inclinations",
        description: [
          "The scientific attitude to analyze and experiment",
          "The attitude of curiosity and willingness to ask questions",
          "Problem-solving, exploratory attitude",
        ],
      },
      C: {
        title: "Engineering, technical inclinations",
        description: [
          "Favorable attitudes toward humans, including history and culture",
          "The attitude of organizing your thoughts and expressing them in writing",
          "The attitude that resonates with people",
        ],
      },
      D: {
        title: "Arts, creative tendencies",
        description: [
          "The attitude that expresses your thoughts to others in a unique way",
          "The attitude to spot trends and reinvent them",
          "The attitude of empathy and sympathy",
        ],
      },
      E: {
        title: "Social sciences, global orientation",
        description: [
          "The attitude of taking leadership and getting along with others",
          "The attitude of empathizing with and solving the problems of society and others",
          "The attitude of being interested in and engaged with the structures and issues of society",
        ],
      },
      F: {
        title: "Economic, efficiency-oriented",
        description: [
          "A streamlined, results-oriented attitude toward work",
          "The Attitude to anticipate and respond to the future",
          "The attitude of meticulously planning and calculating for profit",
        ],
      },
    };
    let hanyangMajorAptitudePrompt: ChatCompletionMessageType[] = [];
    const { suitableAreas, unsuitableAreas, majorArea } = tendencyByHanyangMajorAptitude;
    if (suitableAreas) {
      suitableAreas.map((area) => {
        const attitude = EXAMINATION_RESULTS[area].description;
        hanyangMajorAptitudePrompt.push({
          role: "system",
          content: `I have the right disposition for ${attitude[0]}, ${attitude[1]}, and ${attitude[2]}.`,
        });
      });
    }
    if (unsuitableAreas) {
      unsuitableAreas.map((area) => {
        const attitude = EXAMINATION_RESULTS[area].description;
        hanyangMajorAptitudePrompt.push({
          role: "system",
          content: `I have ${attitude[0]}, ${attitude[1]}, and ${attitude[2]} that doesn't work for me.`,
        });
      });
    }
    if (majorArea) {
      const attitude = EXAMINATION_RESULTS[majorArea].description;
      hanyangMajorAptitudePrompt.push({
        role: "system",
        content: `For me, having an ${attitude[0]}, a ${attitude[1]}, and ${attitude[2]} works best.`,
      });
    }
    prompt.push(...hanyangMajorAptitudePrompt);

    prompt.push({
      role: "user",
      content: `${message}`,
    });

    console.log(prompt);
    return prompt;
  }

  private getTendencyByHanyangMajorAptitude(result: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
  }): tendencyByHanyangMajorAptitude {
    let tendency: tendencyByHanyangMajorAptitude = {
      suitableAreas: [],
      unsuitableAreas: [],
      majorArea: null,
    };

    const areaCountList = [
      { type: "A", count: result.A },
      { type: "B", count: result.B },
      { type: "C", count: result.C },
      { type: "D", count: result.D },
      { type: "E", count: result.E },
      { type: "F", count: result.F },
    ];

    areaCountList.forEach((areaCount) => {
      if (areaCount.count >= 7) {
        tendency.suitableAreas?.push(areaCount.type as HANYNAG_MAJOR_APTITUDE_AREA);
      } else if (areaCount.count <= 3) {
        tendency.unsuitableAreas?.push(areaCount.type as HANYNAG_MAJOR_APTITUDE_AREA);
      }
    });

    const sortedAreaCountList = areaCountList.sort((a, b) => {
      return a.count - b.count;
    });
    tendency.majorArea = sortedAreaCountList[0].type as HANYNAG_MAJOR_APTITUDE_AREA;

    if (!tendency.suitableAreas?.length) {
      tendency.suitableAreas = null;
    }
    if (!tendency.unsuitableAreas?.length) {
      tendency.unsuitableAreas = null;
    }
    return tendency;
  }
}

export default ChatbotService;
