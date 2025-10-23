/* FASHUN.CO Theme JavaScript */
/* Premium Streetwear E-commerce Platform */

class FashunTheme {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
    this.setupAnimations();
    this.initSocialProof();
    this.initAIFeatures();
  }

  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupQuickView();
      this.setupWishlist();
      this.setupCartDrawer();
      this.setupProductVariants();
      this.setupCountdownTimers();
    });

    window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
    window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
  }

  initializeComponents() {
    this.initProductCards();
    this.initImageLazyLoading();
    this.initSearchFunctionality();
    this.initNewsletterSignup();
  }

  setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  initSocialProof() {
    const notifications = [
      { name: 'Arjun from Mumbai', product: 'Oversized Hoodie', time: '2 minutes ago' },
      { name: 'Priya from Delhi', product: 'Graphic Tee', time: '5 minutes ago' },
      { name: 'Rahul from Bangalore', product: 'Cargo Pants', time: '8 minutes ago' },
      { name: 'Sneha from Pune', product: 'Bomber Jacket', time: '12 minutes ago' }
    ];

    let currentIndex = 0;
    
    const showNotification = () => {
      const notification = notifications[currentIndex];
      const notificationEl = document.createElement('div');
      notificationEl.className = 'social-proof-notification';
      notificationEl.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon">🛍️</div>
          <div class="notification-text">
            <strong>${notification.name}</strong> just purchased<br>
            <span class="product-name">${notification.product}</span>
          </div>
          <div class="notification-time">${notification.time}</div>
        </div>
      `;

      document.body.appendChild(notificationEl);

      setTimeout(() => {
        notificationEl.classList.add('show');
      }, 100);

      setTimeout(() => {
        notificationEl.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notificationEl);
        }, 300);
      }, 4000);

      currentIndex = (currentIndex + 1) % notifications.length;
    };

    // Show first notification after 3 seconds, then every 15 seconds
    setTimeout(showNotification, 3000);
    setInterval(showNotification, 15000);
  }

  initAIFeatures() {
    this.setupPersonalizedRecommendations();
    this.setupTrendingProducts();
    this.setupSmartSearch();
  }

  setupPersonalizedRecommendations() {
    const viewedProducts = JSON.parse(localStorage.getItem('fashun_viewed_products') || '[]');
    
    // Track product views
    const productId = document.querySelector('[data-product-id]')?.dataset.productId;
    if (productId && !viewedProducts.includes(productId)) {
      viewedProducts.push(productId);
      if (viewedProducts.length > 10) viewedProducts.shift();
      localStorage.setItem('fashun_viewed_products', JSON.stringify(viewedProducts));
    }

    // Show recommendations based on viewed products
    this.displayRecommendations(viewedProducts);
  }

  setupTrendingProducts() {
    // Simulate AI trend scoring
    document.querySelectorAll('.trending-product-card').forEach((card, index) => {
      const trendScore = 85 + Math.floor(Math.random() * 15);
      const scoreEl = card.querySelector('.trend-score');
      if (scoreEl) {
        scoreEl.textContent = `${trendScore}% trend`;
      }

      // Add trending animation
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  setupSmartSearch() {
    const searchInput = document.querySelector('#search-input');
    if (!searchInput) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSmartSearch(e.target.value);
      }, 300);
    });
  }

  performSmartSearch(query) {
    if (query.length < 2) return;

    // Simulate AI-powered search with suggestions
    const suggestions = this.generateSearchSuggestions(query);
    this.displaySearchSuggestions(suggestions);
  }

  generateSearchSuggestions(query) {
    const products = [
      'Oversized Hoodie', 'Graphic T-Shirt', 'Cargo Pants', 'Bomber Jacket',
      'Streetwear Set', 'Urban Sneakers', 'Baseball Cap', 'Crossbody Bag'
    ];

    return products.filter(product => 
      product.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }

  displaySearchSuggestions(suggestions) {
    let suggestionsEl = document.querySelector('.search-suggestions');
    
    if (!suggestionsEl) {
      suggestionsEl = document.createElement('div');
      suggestionsEl.className = 'search-suggestions';
      document.querySelector('#search-input').parentNode.appendChild(suggestionsEl);
    }

    suggestionsEl.innerHTML = suggestions.map(suggestion => 
      `<div class="suggestion-item" onclick="this.performSearch('${suggestion}')">${suggestion}</div>`
    ).join('');

    suggestionsEl.style.display = suggestions.length > 0 ? 'block' : 'none';
  }

  setupQuickView() {
    document.querySelectorAll('.btn-quick-view').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = btn.dataset.productId;
        this.openQuickView(productId);
      });
    });
  }

  openQuickView(productId) {
    // Create quick view modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="this.closeQuickView()"></div>
      <div class="modal-content">
        <button class="modal-close" onclick="this.closeQuickView()">×</button>
        <div class="quick-view-content">
          <div class="loading">Loading product details...</div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.classList.add('modal-open');

    // Fetch product data (simulate API call)
    setTimeout(() => {
      this.loadQuickViewContent(modal, productId);
    }, 500);
  }

  closeQuickView() {
    const modal = document.querySelector('.quick-view-modal');
    if (modal) {
      document.body.removeChild(modal);
      document.body.classList.remove('modal-open');
    }
  }

  setupWishlist() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const productId = btn.dataset.productId;
        const isWishlisted = btn.classList.contains('wishlisted');
        
        if (isWishlisted) {
          this.removeFromWishlist(productId);
          btn.classList.remove('wishlisted');
        } else {
          this.addToWishlist(productId);
          btn.classList.add('wishlisted');
        }
      });
    });
  }

  addToWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('fashun_wishlist') || '[]');
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      localStorage.setItem('fashun_wishlist', JSON.stringify(wishlist));
      this.showNotification('Added to wishlist! ❤️');
    }
  }

  removeFromWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('fashun_wishlist') || '[]');
    const index = wishlist.indexOf(productId);
    if (index > -1) {
      wishlist.splice(index, 1);
      localStorage.setItem('fashun_wishlist', JSON.stringify(wishlist));
      this.showNotification('Removed from wishlist');
    }
  }

  setupCartDrawer() {
    // Cart drawer functionality
    const cartTriggers = document.querySelectorAll('[data-cart-trigger]');
    const cartDrawer = document.querySelector('#cart-drawer');
    
    cartTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        this.openCartDrawer();
      });
    });
  }

  openCartDrawer() {
    const cartDrawer = document.querySelector('#cart-drawer');
    if (cartDrawer) {
      cartDrawer.classList.add('open');
      document.body.classList.add('cart-open');
    }
  }

  closeCartDrawer() {
    const cartDrawer = document.querySelector('#cart-drawer');
    if (cartDrawer) {
      cartDrawer.classList.remove('open');
      document.body.classList.remove('cart-open');
    }
  }

  setupProductVariants() {
    document.querySelectorAll('.variant-selector').forEach(selector => {
      selector.addEventListener('change', (e) => {
        this.updateProductVariant(e.target);
      });
    });
  }

  updateProductVariant(selector) {
    const form = selector.closest('form');
    const variantId = selector.value;
    
    // Update price and availability
    this.updateProductPrice(variantId);
    this.updateProductAvailability(variantId);
  }

  setupCountdownTimers() {
    document.querySelectorAll('.countdown-timer').forEach(timer => {
      const endTime = timer.dataset.endTime || Date.now() + (24 * 60 * 60 * 1000);
      this.startCountdown(timer, new Date(endTime));
    });
  }

  startCountdown(element, endTime) {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;

      if (distance < 0) {
        element.innerHTML = '<div class="expired">Deal Expired!</div>';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const daysEl = element.querySelector('[data-days]');
      const hoursEl = element.querySelector('[data-hours]');
      const minutesEl = element.querySelector('[data-minutes]');
      const secondsEl = element.querySelector('[data-seconds]');

      if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
      if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
      if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  initProductCards() {
    document.querySelectorAll('.product-card').forEach(card => {
      // Add hover effects
      card.addEventListener('mouseenter', () => {
        card.classList.add('hovered');
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('hovered');
      });
    });
  }

  initImageLazyLoading() {
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

  initNewsletterSignup() {
    const form = document.querySelector('#newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      this.subscribeToNewsletter(email);
    });
  }

  subscribeToNewsletter(email) {
    // Simulate newsletter signup
    this.showNotification('Thanks for subscribing! 🎉');
    
    // Here you would integrate with your email service
    fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'contact[email]': email,
        'contact[tags]': 'newsletter'
      })
    });
  }

  handleScroll() {
    const scrollY = window.scrollY;
    
    // Parallax effects
    document.querySelectorAll('.parallax').forEach(el => {
      const speed = el.dataset.speed || 0.5;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });

    // Header scroll effects
    const header = document.querySelector('.site-header');
    if (header) {
      if (scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  handleResize() {
    // Handle responsive adjustments
    this.adjustLayoutForViewport();
  }

  adjustLayoutForViewport() {
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('mobile-view', isMobile);
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Utility functions
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize theme
const fashunTheme = new FashunTheme();

// Global functions for Shopify integration
window.fashunTheme = fashunTheme;
window.openQuickView = (productId) => fashunTheme.openQuickView(productId);
window.closeQuickView = () => fashunTheme.closeQuickView();
window.openCartDrawer = () => fashunTheme.openCartDrawer();
window.closeCartDrawer = () => fashunTheme.closeCartDrawer();

// Shopify Cart API integration
class ShopifyCart {
  static async addItem(variantId, quantity = 1, properties = {}) {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity,
        properties: properties
      })
    });

    if (response.ok) {
      const item = await response.json();
      fashunTheme.showNotification('Added to cart! 🛍️');
      fashunTheme.openCartDrawer();
      return item;
    } else {
      fashunTheme.showNotification('Error adding to cart', 'error');
      throw new Error('Failed to add item to cart');
    }
  }

  static async updateItem(variantId, quantity) {
    const response = await fetch('/cart/change.js', {
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
      const cart = await response.json();
      return cart;
    } else {
      throw new Error('Failed to update cart');
    }
  }

  static async getCart() {
    const response = await fetch('/cart.js');
    return await response.json();
  }
}

window.ShopifyCart = ShopifyCart;