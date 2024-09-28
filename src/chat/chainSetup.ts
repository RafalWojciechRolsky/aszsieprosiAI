import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { model } from "../config/configLLM.js";
import { ChainInput } from "../types/chainTypes.js";
import { handleFunctionCall } from "../tools/functionHandler.js";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful assistant who remembers all details the user shares with you.`,
  ],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
]);

const filterMessages = (input: ChainInput) => input.chat_history.slice(-50);

export const setupChain = () =>
  RunnableSequence.from<ChainInput>([
    RunnablePassthrough.assign({ chat_history: filterMessages }),
    prompt,
    model,
    handleFunctionCall,
  ]);
