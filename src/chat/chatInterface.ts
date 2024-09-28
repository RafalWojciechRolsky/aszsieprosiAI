import readline from "readline";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

const messageHistories: Record<string, InMemoryChatMessageHistory> = {};

export function startChat(chain: any) {
  const withMessageHistory = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: async (sessionId) => {
      if (!messageHistories[sessionId]) {
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

  console.log("Witaj! Rozpocznijmy rozmowę. Wpisz 'exit' aby zakończyć.");

  const askQuestion = () => {
    rl.question("Ty: ", async (input) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      const response = await withMessageHistory.invoke(
        { input, chat_history: [] },
        { configurable: { sessionId: "user1" } }
      );

      console.log("AI:", (response as { content: string }).content);
      askQuestion();
    });
  };

  askQuestion();
}
