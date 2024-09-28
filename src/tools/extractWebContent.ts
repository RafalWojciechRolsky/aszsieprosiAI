import { webTools } from "./webTools.js";

export const extractWebContent = async (url: string, selector: string) => {
  try {
    await webTools.init();
    await webTools.navigateTo(url);
    const result = await webTools.extractMultipleElements(selector);
    await webTools.close();
    return result.length > 0
      ? result.filter(Boolean).join("\n")
      : "No content found";
  } catch (error) {
    console.error("Error extracting web content:", error);
    return `Error extracting content: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
};
