class AddingGroupChatMessageDTO {
  message: string;
  groupChatId: number;
  userId: number;

  constructor(message: string, groupChatId: number, userId: number) {
    this.groupChatId = groupChatId;
    this.message = message;
    this.userId = userId;
  }
}

export default AddingGroupChatMessageDTO;
