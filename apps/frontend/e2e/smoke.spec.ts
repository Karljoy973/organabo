import { expect, test } from "@playwright/test";

test("page loads and mounts the app", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto("/");

  // The Vite entry mounts into #app.
  await expect(page.locator("#app")).toBeAttached();
  await expect(page).toHaveTitle(/frontend/i);

  // Console errors usually mean a broken bundle or a runtime crash.
  expect(errors, `Page threw: ${errors.join(", ")}`).toEqual([]);
});
