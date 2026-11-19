import { expect, test, type Page } from "@playwright/test";

const field = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true });

async function type(page: Page, digits: string) {
  for (const digit of digits) {
    await page.getByRole("button", { name: digit, exact: true }).click();
  }
}

test.use({ serviceWorkers: "block" });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(field(page, "Bill 0.00")).toBeVisible();
});

test("typing a bill shows the tip and total", async ({ page }) => {
  await type(page, "4763");
  await expect(field(page, "Bill 47.63")).toBeVisible();
  await expect(field(page, "Tip 9.53")).toBeVisible();
  await expect(field(page, "Total 57.16")).toBeVisible();
});

test("the physical keyboard types into the selected field", async ({
  page,
}) => {
  await page.keyboard.type("1234");
  await expect(field(page, "Bill 12.34")).toBeVisible();
  await page.keyboard.press("Backspace");
  await expect(field(page, "Bill 1.23")).toBeVisible();
});

test("the physical keyboard takes digits typed with Shift", async ({
  page,
}) => {
  await page.evaluate(() =>
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "5", shiftKey: true }),
    ),
  );
  await expect(field(page, "Bill 0.05")).toBeVisible();
});

test("a field selects at once from the keyboard", async ({ page }) => {
  await field(page, "Total 0.00").focus();
  await page.keyboard.press("Enter");
  await expect(field(page, "Total 0.00")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("the physical keyboard is ignored with a modifier or in settings", async ({
  page,
}) => {
  await page.keyboard.press("Control+5");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.keyboard.type("7");
  await page.getByRole("button", { name: "Done" }).click();
  await expect(field(page, "Bill 0.00")).toBeVisible();
});

test("a total typed below the bill leaves the tip at zero", async ({
  page,
}) => {
  await type(page, "5000");
  await field(page, "Total 60.00").dblclick();
  await type(page, "6");
  await expect(field(page, "Total 0.06")).toBeVisible();
  await expect(field(page, "Tip 0.00")).toBeVisible();
  await type(page, "000");
  await expect(field(page, "Total 60.00")).toBeVisible();
  await expect(field(page, "Tip 10.00")).toBeVisible();
});

test("rounds the total up", async ({ page }) => {
  await type(page, "4763");
  await page.getByRole("button", { name: "Round total up to 58.00" }).click();
  await expect(field(page, "Total 58.00")).toBeVisible();
  await expect(field(page, "Tip % 21.8%")).toBeVisible();
});

test("splitting shows what each person pays", async ({ page }) => {
  await type(page, "4763");
  await page.getByRole("button", { name: "Increase Split" }).click();
  await expect(field(page, "Split 2")).toBeVisible();
  await expect(field(page, "Each 28.58")).toBeVisible();
});

test("a changed default applies on Clear", async ({ page }) => {
  await type(page, "1000");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("button", { name: "Increase default tip" }).click();
  await expect(page.getByRole("dialog")).toContainText("21%");
  await page.getByRole("button", { name: "Done" }).click();
  await expect(field(page, "Tip % 20%")).toBeVisible();

  await page.getByRole("button", { name: "Clear" }).click();
  await expect(field(page, "Bill 0.00")).toBeVisible();
  await expect(field(page, "Tip % 21%")).toBeVisible();
  await type(page, "1000");
  await expect(field(page, "Total 12.10")).toBeVisible();
});

test("a default changed before a bill applies at once and at launch", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("button", { name: "Decrease default tip" }).click();
  await page.getByRole("button", { name: "Increase default split" }).click();
  await page.getByRole("button", { name: "Done" }).click();
  await expect(field(page, "Tip % 19%")).toBeVisible();
  await expect(field(page, "Split 2")).toBeVisible();

  await page.reload();
  await expect(field(page, "Tip % 19%")).toBeVisible();
  await expect(field(page, "Split 2")).toBeVisible();
});

test("follows the system theme until one is chosen", async ({ page }) => {
  const background = () =>
    page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await page.emulateMedia({ colorScheme: "light" });

  const light = await background();

  await page.emulateMedia({ colorScheme: "dark" });

  const dark = await background();

  expect(dark).not.toBe(light);

  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByRole("radio", { name: "Auto" })).toBeChecked();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");

  await page.getByRole("radio", { name: "Light" }).check();
  expect(await background()).toBe(light);

  await page.getByRole("radio", { name: "Auto" }).check();
  expect(await background()).toBe(dark);
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
});

test("a chosen theme applies before any script file loads", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("radio", { name: "Dark" }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.route("**/*", (route) =>
    route.request().resourceType() === "script"
      ? route.abort()
      : route.continue(),
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.locator('meta[name="theme-color"][data-theme="dark"]'),
  ).toHaveAttribute("media", "all");
  await expect(
    page.locator('meta[name="theme-color"][data-theme="light"]'),
  ).toHaveAttribute("media", "not all");
  await expect(page.getByRole("button", { name: "Settings" })).toHaveCount(0);

  await page.unroute("**/*");
  await page.reload();
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();
});

test("a tap on the backdrop closes settings, a tap on the sheet's edge does not", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Settings" }).click();

  const sheet = page.getByRole("dialog");

  const box = await sheet.boundingBox();

  await sheet.click({ position: { x: 2, y: (box?.height ?? 0) / 2 } });
  await expect(sheet).not.toHaveAttribute("data-closing");
  await page.mouse.click(5, 5);
  await expect(sheet).toBeHidden();
});

test("a theme chosen in another tab applies here", async ({
  page,
  context,
}) => {
  const other = await context.newPage();

  await other.goto("/");
  await other.getByRole("button", { name: "Settings" }).click();
  await other.getByRole("radio", { name: "Dark" }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

const upright = [
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
];

const sidewaysWithBrowserToolbars = [
  { width: 667, height: 260 },
  { width: 844, height: 300 },
  { width: 932, height: 340 },
];

const sizes = [...upright, ...sidewaysWithBrowserToolbars];

for (const size of sizes) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`fits ${size.width}x${size.height} in ${colorScheme} without scrolling`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize(size);
      await type(page, "102880");
      await expect(field(page, "Total 1,234.56")).toBeVisible();
      await expect(field(page, "Each 1,234.56")).toBeVisible();

      const overflow = await page.evaluate(() => {
        const root = document.documentElement;

        const crowded = [...document.querySelectorAll("[aria-pressed]")].filter(
          (value) => {
            const box = value.getBoundingClientRect();

            return [
              value.previousElementSibling,
              value.nextElementSibling,
            ].some((coin) => {
              if (!(coin instanceof HTMLButtonElement)) return false;

              const edge = coin.getBoundingClientRect();

              return edge.left < box.right && box.left < edge.right;
            });
          },
        );

        const coinStealsValueTap = [
          ...document.querySelectorAll("[aria-pressed]"),
        ].filter((value) => {
          const box = value.getBoundingClientRect();
          const y = box.top + box.height / 2;

          return [box.left + 1, box.right - 1].some(
            (x) => !value.contains(document.elementFromPoint(x, y)),
          );
        });

        const boxes = [...document.querySelectorAll("main button")].flatMap(
          (button) => {
            const box = button.getBoundingClientRect();

            const name =
              button.getAttribute("aria-label") ?? button.textContent;

            return box.width > 0 ? [{ name, box }] : [];
          },
        );

        const overlapping = boxes.flatMap((a, index) =>
          boxes
            .slice(index + 1)
            .flatMap((b) =>
              a.box.left < b.box.right &&
              b.box.left < a.box.right &&
              a.box.top < b.box.bottom &&
              b.box.top < a.box.bottom
                ? [`${a.name} / ${b.name}`]
                : [],
            ),
        );

        return {
          overlapping,
          vertical: root.scrollHeight - window.innerHeight,
          horizontal: root.scrollWidth - window.innerWidth,
          crowded: crowded.map((value) => value.getAttribute("aria-label")),
          coinStealsValueTap: coinStealsValueTap.map((value) =>
            value.getAttribute("aria-label"),
          ),
        };
      });

      expect(overflow).toEqual({
        overlapping: [],
        vertical: 0,
        horizontal: 0,
        crowded: [],
        coinStealsValueTap: [],
      });
      await expect(
        page.getByRole("button", { name: "Delete digit" }),
      ).toBeInViewport({ ratio: 1 });
    });
  }
}
