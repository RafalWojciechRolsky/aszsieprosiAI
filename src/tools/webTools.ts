import { chromium, Browser, Page } from "playwright";

let browser: Browser | null = null;
let page: Page | null = null;

export const webTools = {
  init: async () => {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
  },

  navigateTo: async (url: string) => {
    if (!page) throw new Error("Browser not initialized");
    await page.goto(url, { timeout: 90000, waitUntil: "networkidle" });
  },

  extractText: async (selector: string) => {
    if (!page) throw new Error("Browser not initialized");
    const element = await page.$(selector);
    return element ? element.textContent() : null;
  },

  fillForm: async (selector: string, value: string) => {
    if (!page) throw new Error("Browser not initialized");
    await page.fill(selector, value);
  },

  clickButton: async (selector: string) => {
    if (!page) throw new Error("Browser not initialized");
    await page.click(selector);
  },

  close: async () => {
    if (browser) await browser.close();
  },

  extractMultipleElements: async (selector: string) => {
    if (!page) throw new Error("Browser not initialized");
    await page.waitForSelector(selector, { timeout: 15000 });
    const elements = await page.$$(selector);
    return Promise.all(elements.map((el) => el.textContent()));
  },

  extractAttributes: async (selector: string, attribute: string) => {
    if (!page) throw new Error("Browser not initialized");
    return page.$$eval(
      selector,
      (els, attr) => els.map((el) => el.getAttribute(attr)),
      attribute
    );
  },
};
