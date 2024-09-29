import { chromium, Browser, Page } from "playwright";

let browser: Browser | null = null;
let page: Page | null = null;

export const webTools = {
  isBrowserInitialized: () => {
    return browser !== null && page !== null;
  },

  init: async () => {
    if (!browser) {
      browser = await chromium.launch({ headless: false });
    }
    if (!page) {
      page = await browser.newPage();
    }
  },

  navigateTo: async (url: string) => {
    if (!page) throw new Error("Browser not initialized");
    await page.goto(url, { timeout: 90000, waitUntil: "networkidle" });
  },

  extractText: async (selector: string) => {
    if (!page) throw new Error("Browser not initialized");
    const element = await page.$(selector);
    return element ? await element.textContent() : null;
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

  checkElementExists: async (selector: string): Promise<boolean> => {
    if (!page) throw new Error("Browser not initialized");
    return await page.isVisible(selector);
  },

  findLoginElement: async (): Promise<string | null> => {
    if (!page) throw new Error("Browser not initialized");
    const selectors = [
      'button:has-text("Zaloguj")',
      'button:has-text("Login")',
      'button:has-text("Sign in")',
      'a:has-text("Zaloguj")',
      'a:has-text("Login")',
      'a:has-text("Sign in")',
      'input[type="submit"][value="Zaloguj"]',
      'input[type="submit"][value="Login"]',
      'input[type="submit"][value="Sign in"]',
    ];

    for (const selector of selectors) {
      if (await page.isVisible(selector)) {
        return selector;
      }
    }
    return null;
  },

  getLoginElementSelector: async (): Promise<string> => {
    const loginElement = await webTools.findLoginElement();
    if (loginElement) {
      return loginElement;
    }
    throw new Error("Nie znaleziono elementu logowania");
  },

  clickLoginElement: async (): Promise<string> => {
    if (!page) throw new Error("Browser not initialized");
    const loginSelector = await webTools.findLoginElement();
    if (loginSelector) {
      await page.click(loginSelector);
      return `Kliknięto element logowania: ${loginSelector}`;
    }
    throw new Error("Nie znaleziono elementu logowania do kliknięcia");
  },
};

export const navigateToUrl = async (url: string): Promise<string> => {
  try {
    if (!browser) {
      browser = await chromium.launch({ headless: false });
    }
    if (!page) {
      page = await browser.newPage();
    }
    await page.goto(url, { waitUntil: "networkidle" });
    return `Successfully navigated to ${url}`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error navigating to URL:", error);
      return `Error navigating to ${url}: ${error.message}`;
    }
    return `Unknown error navigating to ${url}`;
  }
};

export const closeBrowser = async (): Promise<void> => {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
  }
};
