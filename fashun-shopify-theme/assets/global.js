/* FASHUN.CO Global JavaScript */

class FashunGlobal {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
  }

  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupCart();
      this.setupSearch();
      this.setupWishlist();
    });
  }

  initializeComponents() {
    // Initialize all global components
    this.setupScrollEffects();
    this.setupLazyLoading();
  }

  setupCart() {
    // Cart functionality
    document.addEventListener('click', (e) => {
      if (e.target.matches('.quick-add-btn')) {
        e.preventDefault();
        const variantId = e.target.dataset.variantId;
        this.addToCart(variantId);
      }
    });
  }

  async addToCart(variantId, quantity = 1) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity
        })
      });

      if (response.ok) {
        this.updateCartCount();
        this.showNotification('Added to cart! 🛍️');
      }
    } catch (error) {
      this.showNotification('Error adding to cart', 'error');
    }
  }

  async updateCartCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      const countEl = document.getElementById('cart-count');
      if (countEl) {
        countEl.textContent = cart.item_count;
      }
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  }

  setupWishlist() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('.wishlist-btn')) {
        e.preventDefault();
        const productId = e.target.dataset.productId;
        this.toggleWishlist(productId, e.target);
      }
    });
  }

  toggleWishlist(productId, button) {
    const wishlist = JSON.parse(localStorage.getItem('fashun_wishlist') || '[]');
    const isWishlisted = wishlist.includes(productId);

    if (isWishlisted) {
      const index = wishlist.indexOf(productId);
      wishlist.splice(index, 1);
      button.classList.remove('active');
      this.showNotification('Removed from wishlist');
    } else {
      wishlist.push(productId);
      button.classList.add('active');
      this.showNotification('Added to wishlist! ❤️');
    }

    localStorage.setItem('fashun_wishlist', JSON.stringify(wishlist));
  }

  setupSearch() {
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.performSearch(e.target.value);
        }, 300);
      });
    }
  }

  performSearch(query) {
    if (query.length < 2) return;
    // Implement search functionality
    console.log('Searching for:', query);
  }

  setupScrollEffects() {
    let ticking = false;
    
    const updateScrollEffects = () => {
      const scrollY = window.scrollY;
      const header = document.querySelector('.site-header');
      
      if (header) {
        if (scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    });
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '600',
      zIndex: '9999',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      backgroundColor: type === 'error' ? '#ef4444' : '#10b981'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize
const fashunGlobal = new FashunGlobal();

// Shopify money format
window.Shopify = window.Shopify || {};
Shopify.formatMoney = function(cents, format) {
  if (typeof cents === 'string') cents = cents.replace('.', '');
  
  const value = '';
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = (format || this.money_format);

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = precision || 2;
    thousands = thousands || ',';
    decimal = decimal || '.';

    if (isNaN(number) || number == null) return 0;

    number = (number / 100.0).toFixed(precision);

    const parts = number.split('.');
    const dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
    const centsAmount = parts[1] ? (decimal + parts[1]) : '';

    return dollarsAmount + centsAmount;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

// Set default money format
Shopify.money_format = '₹{{amount}}';

// Global utility functions
window.openQuickView = function(productId) {
  console.log('Opening quick view for product:', productId);
  // Implement quick view modal
};

window.openCartDrawer = function() {
  window.location.href = '/cart';
};

window.closeCartDrawer = function() {
  // Close cart drawer
};

// Export for use in other scripts
window.FashunGlobal = FashunGlobal;