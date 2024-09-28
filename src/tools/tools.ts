import { downloadYouTubeAudio } from "../utils/youtube.js";

export const tools = [
  {
    name: "extractWebContent",
    description: "Extract content from multiple elements on a webpage",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL of the webpage",
        },
        selector: {
          type: "string",
          description:
            "CSS selector to extract content (can match multiple elements)",
        },
      },
      required: ["url", "selector"],
    },
  },
  {
    name: "downloadYouTubeAudio",
    description: "Download audio from a YouTube video as MP3",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL of the YouTube video",
        },
        output: {
          type: "string",
          description: "The output file name (without extension)",
        },
      },
      required: ["url", "output"],
    },
  },
];
