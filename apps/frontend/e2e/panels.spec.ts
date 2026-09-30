import { expect, test } from "@playwright/test";

test("panel toggles collapse and restore the left panel", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto("/");

  // All four panels start visible.
  await expect(page.locator(".panel[data-side='left']")).toBeVisible();
  await expect(page.getByText("Panneaux actifs : 4/4")).toBeVisible();

  // Collapse the left panel from the top bar toggle.
  await page.getByRole("button", { name: "left", exact: true }).click();

  // The panel is replaced by a slim edge tab, and the count drops.
  await expect(page.locator(".panel[data-side='left']")).toHaveCount(0);
  await expect(page.locator(".panel-tab-left")).toBeVisible();
  await expect(page.getByText("Panneaux actifs : 3/4")).toBeVisible();

  // The edge tab restores the panel.
  await page.locator(".panel-tab-left").click();
  await expect(page.locator(".panel[data-side='left']")).toBeVisible();
  await expect(page.getByText("Panneaux actifs : 4/4")).toBeVisible();

  // The same event flows for the right panel via its own close button.
  await page.getByRole("button", { name: "Masquer le panneau Propriétés" }).click();
  await expect(page.locator(".panel[data-side='right']")).toHaveCount(0);
  await expect(page.getByText("Panneaux actifs : 3/4")).toBeVisible();

  expect(errors, `Page threw: ${errors.join(", ")}`).toEqual([]);
});
