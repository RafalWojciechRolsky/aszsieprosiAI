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
    await this.page.goto(url, { waitUntil: "networkidle" });
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
}

export const webTools = new WebTools();
