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

    case "checkElementExists":
      if (!webTools.isBrowserInitialized()) {
        await webTools.init();
      }
      const exists = await webTools.checkElementExists(args.selector);
      return new AIMessage(
        `Element ${args.selector} ${
          exists ? "istnieje" : "nie istnieje"
        } na stronie.`
      );

    case "checkLoginElementExists":
      if (!webTools.isBrowserInitialized()) {
        await webTools.init();
      }
      const loginElement = await webTools.findLoginElement();
      return new AIMessage(
        loginElement
          ? `Znaleziono element logowania: ${loginElement}`
          : "Nie znaleziono elementu logowania na stronie."
      );

    case "getLoginElementSelector":
      if (!webTools.isBrowserInitialized()) {
        await webTools.init();
      }
      try {
        const selector = await webTools.getLoginElementSelector();
        return new AIMessage(`Selektor elementu logowania: ${selector}`);
      } catch (error) {
        return new AIMessage("Nie znaleziono elementu logowania na stronie.");
      }

    case "clickLoginElement":
      if (!webTools.isBrowserInitialized()) {
        await webTools.init();
      }
      try {
        const result = await webTools.clickLoginElement();
        return new AIMessage(result);
      } catch (error) {
        return new AIMessage(
          "Nie udało się kliknąć elementu logowania: " +
            (error as Error).message
        );
      }

    case "checkCompanyExistence":
      if (!webTools.isBrowserInitialized()) {
        await webTools.init();
      }
      const existenceResult = await webTools.checkCompanyExistence(args.nip);
      return new AIMessage(existenceResult);

    case "refreshPage":
      if (!webTools.isBrowserInitialized()) {
        await webTools.init();
      }
      const refreshResult = await webTools.refreshPage();
      return new AIMessage(refreshResult);

    // ... inne przypadki ...

    default:
      return new AIMessage(`Nieznana funkcja: ${name}`);
  }
}
