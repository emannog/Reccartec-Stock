import { test, expect } from '@playwright/test';

test.describe('Página Inicial', () => {
  test('deve carregar a página inicial', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toContainText('Reccartec Stock');
    await expect(page.locator('p')).toContainText('Sistema de Gestão de Estoque');
  });

  test('deve exibir cards de navegação', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=Produtos')).toBeVisible();
    await expect(page.locator('text=Categorias')).toBeVisible();
    await expect(page.locator('text=Movimentações')).toBeVisible();
  });

  test('deve navegar para página de produtos', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Produtos');
    await expect(page).toHaveURL('/produtos');
  });

  test('deve navegar para página de categorias', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Categorias');
    await expect(page).toHaveURL('/categorias');
  });

  test('deve navegar para página de movimentações', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Movimentações');
    await expect(page).toHaveURL('/movimentacoes');
  });
});
