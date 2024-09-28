import { cleanHtml } from "../utils/cleantHTML.js";
import { webTools } from "./webTools.js";

export const extractWebContent = async (url: string, selector: string) => {
  try {
    await webTools.init();
    await webTools.navigateTo(url);
    const result = await webTools.extractMultipleElements(selector);
    await webTools.close();

    if (result.length > 0) {
      const markdown = cleanHtml(result.filter(Boolean).join("\n"));
      return markdown || "No content found after cleaning";
    }
    return "No content found";
  } catch (error) {
    console.error("Error extracting web content:", error);
    return `Error extracting content: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
};
