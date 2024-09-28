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
  {
    name: "findCompanyPhoneNumber",
    description: "Find a phone number for a company",
    parameters: {
      type: "object",
      properties: {
        companyName: {
          type: "string",
          description: "The name of the company",
        },
      },
      required: ["companyName"],
    },
  },
  {
    name: "verifyCompanyExistence",
    description: "Check if a company exists and who the owner is",
    parameters: {
      type: "object",
      properties: {
        companyName: {
          type: "string",
          description: "The name of the company",
        },
      },
      required: ["companyName"],
    },
  },
  {
    name: "loginToWebsite",
    description: "Log in to a website",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL of the website",
        },
        username: {
          type: "string",
          description: "The username for login",
        },
        password: {
          type: "string",
          description: "The password for login",
        },
      },
      required: ["url", "username", "password"],
    },
  },
  {
    name: "fillWebForm",
    description: "Fill out a form or support request on a website",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL of the form",
        },
        formData: {
          type: "object",
          description: "Key-value pairs of form fields and their values",
        },
      },
      required: ["url", "formData"],
    },
  },
  {
    name: "changeWebsitePassword",
    description: "Change password on a website",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL of the website",
        },
        currentPassword: {
          type: "string",
          description: "The current password",
        },
        newPassword: {
          type: "string",
          description: "The new password",
        },
      },
      required: ["url", "currentPassword", "newPassword"],
    },
  },
  {
    name: "addRSSStream",
    description: "Add a new RSS stream to an RSS reader website",
    parameters: {
      type: "object",
      properties: {
        readerUrl: {
          type: "string",
          description: "The URL of the RSS reader website",
        },
        rssUrl: {
          type: "string",
          description: "The URL of the RSS feed to add",
        },
      },
      required: ["readerUrl", "rssUrl"],
    },
  },
  {
    name: "getUnreadRSSMessages",
    description: "Get unread messages from an RSS reader",
    parameters: {
      type: "object",
      properties: {
        readerUrl: {
          type: "string",
          description: "The URL of the RSS reader website",
        },
      },
      required: ["readerUrl"],
    },
  },
];
