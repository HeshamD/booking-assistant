import { chromium } from "playwright";
import retry from "async-retry";
import { tree } from "next/dist/build/templates/app-page";

export async function runBookingBot(): Promise<void> {
  await retry(
    async () => {
      console.log("🚀 Launching browser...");
      const browser = await chromium.launch({
        headless: true,
      });

      const context = await browser.newContext();
      const page = await context.newPage();

      console.log("🌐 Navigating to Calendly page...");
      await page.goto("https://calendly.com/aadhrik-myaifrontdesk/30min", {
        timeout: 2 * 60 * 1000,
        waitUntil: "networkidle", 
      });


      console.log("✅ Page loaded successfully.");
      await page.screenshot({ path: "book.png", fullPage: true });
      await browser.close();
      console.log("🛑 Browser closed.");
    },
    {
      retries: 3,
      onRetry: (err, attempt) => {
        console.error(`Attempt ${attempt} failed. Retrying...`, err);
      },
    }
  );

  console.log("✅ Bot run completed.");
}
