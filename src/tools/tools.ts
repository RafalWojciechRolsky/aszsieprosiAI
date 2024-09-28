export const tools = [
  {
    name: "extractWebContent",
    description: "Extract content from a webpage",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL of the webpage",
        },
        selector: {
          type: "string",
          description: "CSS selector to extract content",
        },
      },
      required: ["url", "selector"],
    },
  },
];
