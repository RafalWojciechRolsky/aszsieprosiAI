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
];
