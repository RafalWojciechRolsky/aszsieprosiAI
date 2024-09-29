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

  checkCompanyExistence: async (nip: string): Promise<string> => {
    if (!/^\d{10}$/.test(nip)) {
      return "Niepoprawny NIP. Podaj 10 cyfr bez dodatkowych znaków.";
    }

    if (!page) throw new Error("Browser not initialized");

    try {
      // Najpierw nawigujemy do strony KRS
      await page.goto("https://wyszukiwarka-krs.ms.gov.pl/", {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Kliknij przycisk "Wyczyść" trzy razy
      for (let i = 0; i < 3; i++) {
        await page.click(
          "#p-panel-6-content > div > div > div > ds-button.p-mb-2 > p-button > button"
        );
        await page.waitForTimeout(500);
      }

      // Wypełnij pole NIP
      await page.fill(
        "#p-panel-2-content > div > div > div > div.p-col-12.p-lg-6.p-d-flex.p-flex-column > div:nth-child(2) > ds-input > div.ds-input-wrapper > input",
        nip
      );

      // Zaznacz checkbox
      await page.click(
        "#p-panel-1-content > div > div > div > ds-checkbox:nth-child(1) > p-checkbox > div > div.p-checkbox-box"
      );

      // Kliknij przycisk wyszukiwania
      await page.click(
        "#p-panel-6-content > div > div > div > ds-button:nth-child(2) > p-button > button"
      );

      // Czekamy na pojawienie się albo tabeli wyników, albo komunikatu o braku wyników
      const result = await Promise.race([
        page.waitForSelector(
          "#p-panel-5-content > div > div > ds-table > div > p-table > div > div > table > tbody > tr > td:nth-child(2) > div.ds-column-value",

          {
            timeout: 1000,
          }
        ),

        page.waitForSelector(
          "#p-panel-5-content > div > div > ds-table > div > p-table > div > div > table > tbody > tr > td",
          {
            timeout: 2000,
          }
        ),
        new Promise((resolve) => setTimeout(() => resolve("timeout"), 1000)),
      ]);

      if (result === "timeout") {
        return `Nie znaleziono wyników dla NIP ${nip} w określonym czasie. Spróbuj ponownie.`;
      }

      // Sprawdzamy, czy istnieje komunikat o braku wyników
      const noResultsAlert = await page.$(
        "#p-panel-5-content > div > div > ds-alert"
      );
      if (noResultsAlert) {
        const alertText = await noResultsAlert.textContent();
        return `Dla NIP ${nip}: ${
          alertText?.trim() || "Nie znaleziono wyników"
        }`;
      }

      // Sprawdzamy, czy w tabeli jest "Brak danych"
      const tableContent = await page.textContent(
        "#p-panel-5-content > div > div > ds-table > div > p-table > div > div > table > tbody > tr > td"
      );
      if (tableContent && tableContent.trim() === "Brak danych") {
        return `Dla NIP ${nip}: Nie znaleziono przedsiębiorcy w bazie KRS. Sprawdź w innych bazach danych, np. CEIDG.`;
      }

      // Jeśli nie ma komunikatu o braku wyników, próbujemy pobrać dane z tabeli
      const resultText = await page.textContent(
        "#p-panel-5-content > div > div > ds-table > div > p-table > div > div > table > tbody > tr > td:nth-child(2) > div.ds-column-value"
      );

      if (resultText) {
        return `Dla NIP ${nip} znaleziono: ${resultText.trim()}`;
      } else {
        return `Nie znaleziono wyników dla NIP ${nip}`;
      }
    } catch (error) {
      console.error("Error while checking company existence:", error);
      return `Wystąpił błąd podczas sprawdzania NIP ${nip}: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  },

  refreshPage: async (): Promise<string> => {
    if (!page) throw new Error("Browser not initialized");
    try {
      await page.reload({ waitUntil: "networkidle" });
      return "Strona została odświeżona pomyślnie.";
    } catch (error) {
      console.error("Error refreshing page:", error);
      return `Nie udało się odświeżyć strony: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
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
    await page.goto(url, { timeout: 10000, waitUntil: "domcontentloaded" });
    return `Pomyślnie przeszedłem na ${url}`;
  } catch (error) {
    return `Nie można otworzyć strony ${url}. Sprawdź, czy adres jest poprawny.`;
  }
};

export const closeBrowser = async (): Promise<void> => {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
  }
};
