import { AIMessage } from "@langchain/core/messages";
import { extractWebContent } from "./extractWebContent.js";

export const handleFunctionCall = async (response: any) => {
  if (response.additional_kwargs.function_call) {
    const functionCall = response.additional_kwargs.function_call;
    if (functionCall.name === "extractWebContent") {
      const { url, selector } = JSON.parse(functionCall.arguments);
      const result = await extractWebContent(url, selector);
      return new AIMessage(`Extracted content: ${result}`);
    }
  }
  return response;
};
