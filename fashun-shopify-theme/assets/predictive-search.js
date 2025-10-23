// ================================================
// Shopify Predictive Search Implementation
// Provides autocomplete and search suggestions
// ================================================

(function() {
  'use strict';

  const PredictiveSearch = {
    /**
     * Configuration
     */
    config: {
      apiUrl: '/search/suggest.json',
      minChars: 2,
      maxResults: 10,
      debounceDelay: 300,
      cache: {},
      debug: false
    },

    /**
     * Initialize predictive search
     */
    init: function() {
      this.setupSearchInput();
      this.setupSearchResults();
      if (this.config.debug) console.log('PredictiveSearch initialized');
    },

    /**
     * Setup search input listeners
     */
    setupSearchInput: function() {
      const searchInputs = document.querySelectorAll(
        'input[type="search"], input[name="q"], .search-input'
      );

      searchInputs.forEach(input => {
        let debounceTimer;

        input.addEventListener('input', (e) => {
          clearTimeout(debounceTimer);
          const query = e.target.value.trim();

          if (query.length < this.config.minChars) {
            this.hideResults();
            return;
          }

          debounceTimer = setTimeout(() => {
            this.fetchSuggestions(query, input);
          }, this.config.debounceDelay);
        });

        input.addEventListener('focus', (e) => {
          if (e.target.value.length >= this.config.minChars) {
            const query = e.target.value.trim();
            if (this.config.cache[query]) {
              this.displayResults(this.config.cache[query], input);
            }
          }
        });

        input.addEventListener('blur', () => {
          // Delay hiding to allow click on results
          setTimeout(() => this.hideResults(), 200);
        });
      });
    },

    /**
     * Setup search results container
     */
    setupSearchResults: function() {
      let resultsContainer = document.querySelector('.predictive-search-results');
      
      if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'predictive-search-results';
        resultsContainer.style.display = 'none';
        document.body.appendChild(resultsContainer);
      }

      return resultsContainer;
    },

    /**
     * Fetch suggestions from Shopify API
     */
    fetchSuggestions: function(query, inputElement) {
      if (this.config.cache[query]) {
        this.displayResults(this.config.cache[query], inputElement);
        return;
      }

      const searchParams = new URLSearchParams({
        q: query,
        limit: this.config.maxResults,
        type: 'product,article,page'
      });

      const url = `${this.config.apiUrl}?${searchParams}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.config.cache[query] = data;
          this.displayResults(data, inputElement);
          if (this.config.debug) console.log('Search results:', data);
        })
        .catch(error => {
          console.error('Predictive search error:', error);
          this.showLocalResults(query, inputElement);
        });
    },

    /**
     * Display search results
     */
    displayResults: function(data, inputElement) {
      const container = this.setupSearchResults();
      
      if (!data || (!data.products && !data.articles && !data.pages)) {
        container.style.display = 'none';
        return;
      }

      let html = '<div class="predictive-search-wrapper">';

      // Products
      if (data.products && data.products.length > 0) {
        html += '<div class="search-category">';
        html += '<h3 class="search-category-title">Products</h3>';
        data.products.forEach(product => {
          html += this.createProductResult(product);
        });
        html += '</div>';
      }

      // Articles
      if (data.articles && data.articles.length > 0) {
        html += '<div class="search-category">';
        html += '<h3 class="search-category-title">Articles</h3>';
        data.articles.forEach(article => {
          html += this.createArticleResult(article);
        });
        html += '</div>';
      }

      // Pages
      if (data.pages && data.pages.length > 0) {
        html += '<div class="search-category">';
        html += '<h3 class="search-category-title">Pages</h3>';
        data.pages.forEach(page => {
          html += this.createPageResult(page);
        });
        html += '</div>';
      }

      html += '</div>';

      container.innerHTML = html;
      this.positionResults(container, inputElement);
      container.style.display = 'block';
    },

    /**
     * Create product result HTML
     */
    createProductResult: function(product) {
      const url = `/products/${product.handle}`;
      const image = product.featured_image ? 
        `<img src="${product.featured_image}" alt="${this.escapeHtml(product.title)}" class="search-result-image">` : 
        '';
      
      return `
        <a href="${url}" class="search-result search-result-product">
          ${image}
          <div class="search-result-content">
            <h4>${this.escapeHtml(product.title)}</h4>
            <p class="search-result-price">${this.formatPrice(product.price)}</p>
          </div>
        </a>
      `;
    },

    /**
     * Create article result HTML
     */
    createArticleResult: function(article) {
      const url = `/blogs/${article.blog_handle}/${article.handle}`;
      
      return `
        <a href="${url}" class="search-result search-result-article">
          <div class="search-result-content">
            <h4>${this.escapeHtml(article.title)}</h4>
            <p class="search-result-excerpt">${this.escapeHtml(article.excerpt)}</p>
          </div>
        </a>
      `;
    },

    /**
     * Create page result HTML
     */
    createPageResult: function(page) {
      const url = `/pages/${page.handle}`;
      
      return `
        <a href="${url}" class="search-result search-result-page">
          <div class="search-result-content">
            <h4>${this.escapeHtml(page.title)}</h4>
          </div>
        </a>
      `;
    },

    /**
     * Show local results (fallback)
     */
    showLocalResults: function(query, inputElement) {
      // Simple local search fallback
      const results = this.searchLocal(query);
      if (results.length > 0) {
        this.displayResults(results, inputElement);
      }
    },

    /**
     * Local search implementation
     */
    searchLocal: function(query) {
      const lowerQuery = query.toLowerCase();
      const results = [];

      document.querySelectorAll('a[data-searchable], [data-searchable]').forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(lowerQuery)) {
          results.push({
            title: item.textContent,
            url: item.href
          });
        }
      });

      return results.slice(0, this.config.maxResults);
    },

    /**
     * Position results dropdown
     */
    positionResults: function(container, inputElement) {
      const rect = inputElement.getBoundingClientRect();
      
      container.style.position = 'fixed';
      container.style.top = (rect.bottom + 5) + 'px';
      container.style.left = rect.left + 'px';
      container.style.width = rect.width + 'px';
      container.style.zIndex = '9999';
    },

    /**
     * Hide results
     */
    hideResults: function() {
      const container = document.querySelector('.predictive-search-results');
      if (container) {
        container.style.display = 'none';
      }
    },

    /**
     * Format price
     */
    formatPrice: function(price) {
      if (typeof price === 'number') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(price / 100);
      }
      return price;
    },

    /**
     * Escape HTML
     */
    escapeHtml: function(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    /**
     * Clear cache
     */
    clearCache: function() {
      this.config.cache = {};
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      PredictiveSearch.init();
    });
  } else {
    PredictiveSearch.init();
  }

  // Export global API
  window.PredictiveSearch = PredictiveSearch;
})();

// Add default styles for results
(function() {
  if (document.querySelector('style[data-predictive-search]')) return;

  const styles = `
    .predictive-search-results {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      max-height: 400px;
      overflow-y: auto;
    }

    .predictive-search-wrapper {
      padding: 0;
    }

    .search-category {
      border-bottom: 1px solid #f0f0f0;
    }

    .search-category:last-child {
      border-bottom: none;
    }

    .search-category-title {
      margin: 10px 15px 5px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #999;
    }

    .search-result {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      text-decoration: none;
      color: inherit;
      transition: background-color 0.2s;
    }

    .search-result:hover {
      background-color: #f9f9f9;
    }

    .search-result-image {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 12px;
    }

    .search-result-content {
      flex: 1;
      min-width: 0;
    }

    .search-result-content h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .search-result-price {
      margin: 4px 0 0;
      font-size: 12px;
      color: #666;
    }

    .search-result-excerpt {
      margin: 4px 0 0;
      font-size: 12px;
      color: #999;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-predictive-search', 'true');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
})();
