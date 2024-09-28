import { chromium, Browser, Page } from "playwright";

class WebTools {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async init() {
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
  }

  async navigateTo(url: string) {
    if (!this.page) throw new Error("Browser not initialized");
    await this.page.goto(url, {
      timeout: 90000,
      waitUntil: "networkidle",
    });
  }

  async extractText(selector: string) {
    if (!this.page) throw new Error("Browser not initialized");
    const element = await this.page.$(selector);
    return element ? element.textContent() : null;
  }

  async fillForm(selector: string, value: string) {
    if (!this.page) throw new Error("Browser not initialized");
    await this.page.fill(selector, value);
  }

  async clickButton(selector: string) {
    if (!this.page) throw new Error("Browser not initialized");
    await this.page.click(selector);
  }

  async close() {
    if (this.browser) await this.browser.close();
  }

  async extractMultipleElements(selector: string) {
    if (!this.page) throw new Error("Browser not initialized");
    await this.page.waitForSelector(selector, { timeout: 15000 });
    const elements = await this.page.$$(selector);
    return Promise.all(elements.map((el) => el.textContent()));
  }

  async extractAttributes(selector: string, attribute: string) {
    if (!this.page) throw new Error("Browser not initialized");
    return this.page.$$eval(
      selector,
      (els, attr) => els.map((el) => el.getAttribute(attr)),
      attribute
    );
  }
}

export const webTools = new WebTools();
