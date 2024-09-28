import TurndownService from "turndown";

export const cleanHtml = (html: string): string => {
  const bodyContent = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || html;

  const cleanedHtml = bodyContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\{[^}]*\}/g, "");

  const turndownService = new TurndownService();
  return turndownService.turndown(cleanedHtml).trim();
};
