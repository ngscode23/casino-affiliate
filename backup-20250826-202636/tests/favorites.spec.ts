// tests/favorites.spec.ts
import { test, expect } from "@playwright/test";
import fs from "fs";

test("favorites lifecycle", async ({ page, baseURL }) => {
  const BASE = typeof baseURL === "string" && baseURL.length ? baseURL : "http://localhost:5173";
  const compareUrl = new URL("/compare", BASE).toString();
  const favoritesUrl = new URL("/favorites", BASE).toString();

  // чтобы не попасть в мобильный breakpoint
  await page.setViewportSize({ width: 1280, height: 900 });

  console.log("Navigating to:", compareUrl);
  await page.goto(compareUrl, { waitUntil: "networkidle" });

  // очистка
  await page.evaluate(() => localStorage.setItem("fav:v1", JSON.stringify([])));

  // Ждём, пока список офферов отрендерится (подставь реальный селектор строки, если есть)
  // Если у вас есть data-offer-row — замените на него. Иначе .neon-card или аналог.
  const rowSelector = "[data-offer-row], .offer-row, .neon-card";
  await page.waitForSelector(rowSelector, { timeout: 15000 });

  // селектор кнопки избранного
  const favSelector = 'button[title="В избранное"], button[title="Add to favorites"], button:has-text("☆")';

  // лог: сколько найдено (все, даже скрытые)
  const total = await page.locator(favSelector).count();
  console.log("fav buttons found:", total);

  // Ищем видимую, стабильную кнопку — с таймаутом в 15s
  const start = Date.now();
  const TIMEOUT = 15000;
  let clicked = false;
  let lastError: any = null;

  for (let i = 0; i < total; i++) {
    if (Date.now() - start > TIMEOUT) break;

    const candidate = page.locator(favSelector).nth(i);

    // проверяем attachment & visibility быстро
    try {
      const attached = await candidate.evaluate((el) => !!el && document.contains(el));
      const visible = await candidate.isVisible();

      console.log(`candidate[${i}] attached=${attached} visible=${visible}`);
      if (!attached || !visible) continue;

      // попытаемся кликнуть напрямую — без scrollInto (click сам сделает scroll)
      try {
        await candidate.click({ timeout: 5000 });
        clicked = true;
        console.log("Clicked candidate index:", i);
        break;
      } catch (err) {
        lastError = err;
        console.warn("candidate.click failed, trying next candidate", i, err);
        continue;
      }
    } catch (err) {
      lastError = err;
      console.warn("Error inspecting candidate", i, err);
      continue;
    }
  }

  // если не получилось ни на одном — сделаем более агрессивный поиск (скролл по странице и попытка JS-click)
  if (!clicked) {
    console.warn("No visible stable candidate clicked within timeout; attempting fallback JS-click on first found visible element.");
    try {
      // найти первый видимый элемент через evaluate и вызвать native click()
      const ok = await page.evaluate((sel) => {
        const els = Array.from(document.querySelectorAll(sel)) as HTMLElement[];
        for (const e of els) {
          const cs = getComputedStyle(e);
          if (cs.display !== "none" && cs.visibility !== "hidden" && Number(cs.opacity) > 0 && e.offsetWidth > 0 && e.offsetHeight > 0) {
            e.scrollIntoView({ block: "center", inline: "center" });
            e.click();
            return true;
          }
        }
        return false;
      }, favSelector);

      if (!ok) throw new Error("JS fallback didn't find any visible element to click");
      clicked = true;
    } catch (err) {
      lastError = err;
    }
  }

  if (!clicked) {
    // сохранить артефакты, чтобы понять причину
    await page.screenshot({ path: "playwright-debug-click-fail.png", fullPage: true });
    fs.writeFileSync("playwright-debug-click-fail.html", await page.content(), "utf8");
    console.error("Failed to click any favorite button. Saved screenshot/html. Last error:", lastError);
    throw lastError || new Error("Failed to click favorite button (no candidate).");
  }

  // проверяем localStorage
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("fav:v1") || "[]"));
  console.log("saved favs after click:", saved);
  expect(saved.length).toBeGreaterThan(0);

  // проверяем страницу favorites
  await page.goto(favoritesUrl, { waitUntil: "networkidle" });
  await page.waitForSelector(".neon-card, [data-favorite-list]", { timeout: 10000 });
  await expect(page.locator(".neon-card")).toContainText(saved[0]);

  // снять избранное
  const removeSelector = 'button[title="Убрать из избранного"], button:has-text("★")';
  await page.waitForSelector(removeSelector, { timeout: 10000 });
  await page.locator(removeSelector).first().click();
  const savedAfter = await page.evaluate(() => JSON.parse(localStorage.getItem("fav:v1") || "[]"));
  expect(savedAfter).not.toContain(saved[0]);
});