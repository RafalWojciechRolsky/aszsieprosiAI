import { AIMessage } from "@langchain/core/messages";
import { extractWebContent } from "./extractWebContent.js";
import { downloadYouTubeAudio } from "../utils/youtube.js";
import { webTools, navigateToUrl, closeBrowser } from "./webTools.js";

export const handleFunctionCall = async (response: any) => {
  if (response.additional_kwargs.function_call) {
    const { name, arguments: args } = response.additional_kwargs.function_call;
    const parsedArgs = JSON.parse(args);

    const tasks =
      name === "executeTaskSequence"
        ? parsedArgs.tasks
        : [{ name, args: parsedArgs }];

    const results = [];
    for (const task of tasks) {
      const result = await executeSingleTask(task);
      results.push(`${task.name}: ${result.content}`);
    }

    return new AIMessage(`Executed tasks. Results:\n${results.join("\n")}`);
  }
  return response;
};

async function executeSingleTask(task: {
  name: string;
  args: any;
}): Promise<AIMessage> {
  const { name, args } = task;
  switch (name) {
    case "extractWebContent":
      const extractResult = await extractWebContent(args.url, args.selector);
      return new AIMessage(`Extracted content: ${extractResult}`);

    case "downloadYouTubeAudio":
      const downloadResult = await downloadYouTubeAudio(args.url, args.output);
      return new AIMessage(downloadResult);

    case "navigateToUrl":
      const navResult = await navigateToUrl(args.url);
      return new AIMessage(navResult);

    case "closeBrowser":
      await closeBrowser();
      return new AIMessage("Browser closed successfully");

    // ... inne przypadki ...

    default:
      return new AIMessage(`Unknown function: ${name}`);
  }
}
