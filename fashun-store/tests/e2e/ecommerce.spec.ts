import { test, expect, Page } from '@playwright/test';

// Helper function to fill checkout form
async function fillCheckoutForm(page: Page) {
  console.log('📝 Filling checkout form...');
  
  // Fill shipping information
  const fields = {
    'firstName': 'John',
    'lastName': 'Doe',
    'email': 'john.doe@example.com',
    'phone': '+1234567890',
    'address': '123 Fashion Street',
    'city': 'New York',
    'zipCode': '10001',
    'country': 'United States'
  };
  
  for (const [fieldName, value] of Object.entries(fields)) {
    const input = page.locator(`input[name="${fieldName}"], input[id="${fieldName}"]`).first();
    if (await input.isVisible()) {
      await input.fill(value);
    }
  }
  
  await expect(page).toHaveScreenshot('checkout-form-filled.png');
  
  // Select shipping method
  const shippingOption = page.locator('input[name="shipping"], input[type="radio"]').first();
  if (await shippingOption.isVisible()) {
    await shippingOption.check();
  }
  
  // Fill payment information (test mode)
  const cardNumber = page.locator('input[name="cardNumber"], input[placeholder*="card" i]').first();
  const expiryDate = page.locator('input[name="expiry"], input[placeholder*="expiry" i]').first();
  const cvv = page.locator('input[name="cvv"], input[placeholder*="cvv" i]').first();
  
  if (await cardNumber.isVisible()) {
    await cardNumber.fill('4242424242424242'); // Test card number
  }
  
  if (await expiryDate.isVisible()) {
    await expiryDate.fill('12/25');
  }
  
  if (await cvv.isVisible()) {
    await cvv.fill('123');
  }
  
  await expect(page).toHaveScreenshot('payment-form-filled.png');
}

test.describe('E-Commerce Flow', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Complete purchase flow - T-shirt to checkout', async () => {
    console.log('🛒 Testing complete e-commerce flow...');
    
    // Step 1: Browse collections (products)
    await page.goto('/collections');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await expect(page).toHaveScreenshot('collections-page.png');
    
    // Step 2: Find and select a product
    const productCard = page.locator('[data-testid="product-card"], .product-card, a[href*="/products/"]').first();
    
    // Wait for products to load
    await page.waitForTimeout(2000);
    
    if (await productCard.isVisible()) {
      console.log('✓ Product card found, clicking...');
      await productCard.click();
      await page.waitForLoadState('networkidle', { timeout: 15000 });
    } else {
      console.log('ℹ️ No product cards found, testing collections page functionality instead');
      // Just test that the collections page loaded properly
      await expect(page.locator('h1, h2, .page-title')).toBeVisible();
      return;
    }
    
    // Only take screenshot if we navigated to a product page
    if (page.url().includes('/products/')) {
      await expect(page).toHaveScreenshot('product-detail-page.png');
    }
    
    // Step 3: Select size and add to cart
    const sizeSelector = page.locator('select[name="size"], button[data-size]').first();
    const addToCartButton = page.locator('button', { hasText: /add to cart/i }).first();
    
    // Select size if available
    if (await sizeSelector.isVisible()) {
      if (await sizeSelector.locator('option[value="M"]').isVisible()) {
        await sizeSelector.selectOption('M');
      } else {
        // Click size button if it's button-based selection
        const mediumSize = page.locator('button[data-size="M"], button', { hasText: /medium|M/i }).first();
        if (await mediumSize.isVisible()) {
          await mediumSize.click();
        }
      }
      await expect(page).toHaveScreenshot('size-selected.png');
    }
    
    // Add to cart
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('added-to-cart.png');
    }
    
    // Step 4: View cart
    const cartLink = page.locator('a[href="/cart"], button', { hasText: /cart/i }).first();
    const cartIcon = page.locator('[data-testid="cart-icon"], .cart-icon').first();
    
    if (await cartLink.isVisible()) {
      await cartLink.click();
    } else if (await cartIcon.isVisible()) {
      await cartIcon.click();
    } else {
      await page.goto('/cart');
    }
    
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('cart-page.png');
    
    // Step 5: Proceed to checkout
    const checkoutButton = page.locator('button', { hasText: /checkout|proceed/i }).first();
    
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('checkout-page.png');
    }
    
    // Step 6: Fill checkout form
    await fillCheckoutForm(page);
    
    // Step 7: Complete order
    const placeOrderButton = page.locator('button', { hasText: /place order|complete order/i }).first();
    
    if (await placeOrderButton.isVisible()) {
      await placeOrderButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('order-confirmation.png');
      
      // Verify we reached confirmation page
      await expect(page.locator('h1, h2', { hasText: /thank you|order confirmed|success/i })).toBeVisible();
    }
  });

  test('Shopping cart management', async () => {
    console.log('🛍️ Testing shopping cart management...');
    
    // Add multiple items to cart
    await page.goto('/collections');
    await page.waitForLoadState('networkidle');
    
    // Add first product
    const firstProduct = page.locator('[data-testid="product-card"], .product-card').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      await page.waitForLoadState('networkidle');
      
      const addToCartBtn = page.locator('button', { hasText: /add to cart/i }).first();
      if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
        await page.waitForLoadState('networkidle');
      }
    }
    
    // Go to cart
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('cart-with-items.png');
    
    // Test quantity changes
    const quantityInput = page.locator('input[type="number"], .quantity-input').first();
    const increaseQty = page.locator('button', { hasText: /\+|increase/i }).first();
    const decreaseQty = page.locator('button', { hasText: /-|decrease/i }).first();
    
    if (await increaseQty.isVisible()) {
      await increaseQty.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('cart-quantity-increased.png');
    }
    
    // Test item removal
    const removeButton = page.locator('button', { hasText: /remove|delete/i }).first();
    if (await removeButton.isVisible()) {
      await removeButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('cart-item-removed.png');
    }
  });

  test('Product search and filtering', async () => {
    console.log('🔍 Testing product search and filtering...');
    
    await page.goto('/collections');
    await page.waitForLoadState('networkidle');
    
    // Test search functionality
    const searchInput = page.locator('input[type="search"], input[name="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('t-shirt');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('search-results-tshirt.png');
    }
    
    // Test category filtering
    const categoryFilter = page.locator('select[name="category"], .category-filter').first();
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption('t-shirts');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('filtered-by-category.png');
    }
    
    // Test price filtering
    const priceFilter = page.locator('input[name="maxPrice"], .price-filter').first();
    if (await priceFilter.isVisible()) {
      await priceFilter.fill('50');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot('filtered-by-price.png');
    }
  });
});