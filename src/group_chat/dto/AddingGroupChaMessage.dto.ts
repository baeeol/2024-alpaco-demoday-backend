class AddingGroupChatMessageDTO {
  message: string;
  groupChatId;

  constructor(message: string, groupChatId: number) {
    this.groupChatId = groupChatId;
    this.message = message;
  }
}

export default AddingGroupChatMessageDTO;
