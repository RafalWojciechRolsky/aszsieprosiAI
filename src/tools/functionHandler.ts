import { AIMessage } from "@langchain/core/messages";
import { extractWebContent } from "./extractWebContent.js";
import { downloadYouTubeAudio } from "../utils/youtube.js";

export const handleFunctionCall = async (response: any) => {
  if (response.additional_kwargs.function_call) {
    const functionCall = response.additional_kwargs.function_call;
    if (functionCall.name === "extractWebContent") {
      const { url, selector } = JSON.parse(functionCall.arguments);
      const result = await extractWebContent(url, selector);
      return new AIMessage(`Extracted content: ${result}`);
    } else if (functionCall.name === "downloadYouTubeAudio") {
      const { url, output } = JSON.parse(functionCall.arguments);
      const result = await downloadYouTubeAudio(url, output);
      return new AIMessage(result);
    }
  }
  return response;
};
