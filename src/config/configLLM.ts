import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { tools } from "../tools/tools.js";

dotenv.config();

export const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4-0613",
  temperature: 0,
}).bind({
  functions: tools,
});
