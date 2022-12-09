import { test, expect } from '@playwright/test';

test('all-features', async ({ page }) => {
  //login
  await page.goto('http://localhost:3000/');

  const usernameLocator = page.getByPlaceholder("Username")
  const passwordLocator = page.getByPlaceholder("Password")
  const loginButtonLocator = page.getByRole("button", {name: "LOGIN"})
  const errorMSGLocator = page.getByTestId("login-error-message")

  await usernameLocator.fill("e2etestuser")
  await passwordLocator.fill("e2etestpassword")
  await loginButtonLocator.click()
  await expect(errorMSGLocator).not.toBeVisible()

  //post
  const noPostMSGLocator = page.getByRole("heading", {name: "You currently have no posts!"})
  await expect(noPostMSGLocator).toHaveText("You currently have no posts!")
});
