import { expect, test } from "@playwright/test";

const baseUrl = process.env.E2E_BASE_URL || "http://127.0.0.1:8008";
const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;
const hasUsableCredentials =
  email &&
  password &&
  email !== "your-email" &&
  password !== "your-password";

test.describe("Personal Notes application", () => {
  test("serves the app, logs in, opens a note, and previews an image", async ({
    page,
    request,
  }) => {
    test.setTimeout(30000);
    test.skip(
      !hasUsableCredentials,
      "Set E2E_EMAIL and E2E_PASSWORD to real test account credentials",
    );

    const healthResponse = await request.get(`${baseUrl}/api/health`);
    expect(healthResponse.ok()).toBeTruthy();
    await expect(healthResponse.json()).resolves.toMatchObject({ success: true });

    await page.goto(`${baseUrl}/login`);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    const loginResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/auth/login") &&
        response.request().method() === "POST",
    );
    await page.locator('button[type="submit"]').click();
    const loginResponse = await loginResponsePromise;
    expect(
      loginResponse.ok(),
      `Login failed with ${loginResponse.status()}: ${await loginResponse.text()}`,
    ).toBeTruthy();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator(".navbar")).toBeVisible();
    await expect(page.locator(".brand-title")).toHaveText("Knowledge Base");

    const firstNote = page.locator(".clickable-note-card").first();
    await expect(firstNote).toBeVisible();
    await firstNote.click();
    await expect(page).toHaveURL(/\/notes\/[^/]+$/);

    const imageAttachment = page
      .locator(".attachment-card")
      .filter({ hasText: /\.(png|jpe?g|webp)/i })
      .first();
    await expect(imageAttachment).toBeVisible({ timeout: 15000 });
    await imageAttachment
      .locator('.attachment-actions button[aria-label="Preview"]')
      .click();
    const previewImage = page.locator(".preview-image");
    await expect(previewImage).toBeVisible();
    await expect(previewImage).toHaveCSS("object-fit", "contain");
  });
});
