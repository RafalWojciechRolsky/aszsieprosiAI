import { webTools } from "./webTools.js";

export const extractWebContent = async (url: string, selector: string) => {
  try {
    await webTools.init();
    await webTools.navigateTo(url);
    const result = await webTools.extractText(selector);
    await webTools.close();
    return result || "No content found";
  } catch (error) {
    console.error("Error extracting web content:", error);
    return "Error extracting content";
  }
};
