import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";
import { model } from "./config/configLLM.js";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import readline from "readline";

type ChainInput = {
  chat_history: BaseMessage[];
  input: string;
};

const messageHistories: Record<string, InMemoryChatMessageHistory> = {};

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful assistant who remembers all details the user shares with you.`,
  ],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
]);

const filterMessages = (input: ChainInput) => input.chat_history.slice(-50);

const chain = RunnableSequence.from<ChainInput>([
  RunnablePassthrough.assign({
    chat_history: filterMessages,
  }),
  prompt,
  model,
]);

const withMessageHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: async (sessionId) => {
    if (messageHistories[sessionId] === undefined) {
      messageHistories[sessionId] = new InMemoryChatMessageHistory();
    }
    return messageHistories[sessionId];
  },
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function chat() {
  const sessionId = "user1";

  console.log("Witaj! Rozpocznijmy rozmowę. Wpisz 'exit' aby zakończyć.");

  const askQuestion = () => {
    rl.question("Ty: ", async (input) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      const response = await withMessageHistory.invoke(
        { input, chat_history: [] },
        { configurable: { sessionId } }
      );

      console.log("AI:", response.content);
      askQuestion();
    });
  };

  askQuestion();
}

chat();
