import { webTools } from "./webTools.js";

export const extractWebContent = async (url: string, selector: string) => {
  await webTools.init();
  await webTools.navigateTo(url);
  const result = await webTools.extractText(selector);
  await webTools.close();
  return result;
};
