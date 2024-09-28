import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { model } from "../config/configLLM.js";
import { ChainInput } from "../types/chainTypes.js";
import { handleFunctionCall } from "../tools/functionHandler.js";
import { systemPrompt } from "../config/systemPrompt.js";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
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
