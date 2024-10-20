import ControllerException from "@exception/Controller.exception";
import { AddingGroupChatDTO } from "./dto";
import GroupChatService from "./GroupChat.service";
import { Request, Response } from "express";

class GroupChatController {
  private groupChatService = new GroupChatService();

  async groupChatAdd(req: Request, res: Response, next: Function) {
    try {
      const groupChatData = req.body.groupChatData;
      if (!groupChatData) {
        throw new ControllerException(400, "wrong params");
      }
      const addingGroupChatDTO: AddingGroupChatDTO = new AddingGroupChatDTO(
        groupChatData.name,
        groupChatData.tag
      );

      await this.groupChatService.addGroupChat(addingGroupChatDTO);

      res.status(200).send();
    } catch (e) {
      next(e);
    }
  }

  async groupChatList(req: Request, res: Response, next: Function) {
    try {
      const searchKeyword = req.query.search || "";
      const groupChatList = await this.groupChatService.findGroupChatList(
        searchKeyword as string
      );

      res.status(200).send({ groupChatList: groupChatList });
    } catch (e) {
      next(e);
    }
  }
}

export default GroupChatController;
