import { expect, test as setup } from '@playwright/test';
import { SESSION_FILE } from './session';

setup('inicia sesión con el usuario de prueba', async ({ page }) => {
  const email = process.env.SMOKE_EMAIL;
  const password = process.env.SMOKE_PASSWORD;
  if (!email || !password) {
    throw new Error('Faltan SMOKE_EMAIL y SMOKE_PASSWORD.');
  }

  await page.goto('/auth/signin');
  await page.getByLabel('Correo').fill(email);
  await page.getByRole('textbox', { name: 'Contraseña' }).fill(password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page).not.toHaveURL(/\/auth\/signin/);

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/dashboard/);
  await page.context().storageState({ path: SESSION_FILE });
});
