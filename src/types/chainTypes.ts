import { BaseMessage } from "@langchain/core/messages";

export type ChainInput = {
  chat_history: BaseMessage[];
  input: string;
};
