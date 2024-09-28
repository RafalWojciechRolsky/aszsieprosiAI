import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { tools } from "../tools/tools.js";

dotenv.config();

export const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0,
}).bind({
  functions: tools,
});
