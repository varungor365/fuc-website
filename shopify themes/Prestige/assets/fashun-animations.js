// ================================================
// FASHUN.CO Animation Controls & Effects
// Handles DOM animations, interactions, and effects
// ================================================

(function() {
  'use strict';

  // Animation Configuration
  const AnimationConfig = {
    enabled: true,
    duration: 300,
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    debug: false
  };

  // Animation Manager
  const AnimationManager = {
    /**
     * Initialize animations on page load
     */
    init: function() {
      if (AnimationConfig.reduceMotion) {
        if (AnimationConfig.debug) console.log('Reduced motion preference detected');
        return;
      }

      this.observeElements();
      this.setupEventListeners();
      this.attachScrollAnimations();
      if (AnimationConfig.debug) console.log('AnimationManager initialized');
    },

    /**
     * Use Intersection Observer to animate elements on scroll
     */
    observeElements: function() {
      if (!window.IntersectionObserver) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.triggerAnimation(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      // Observe all elements with animation classes
      const animatableElements = document.querySelectorAll(
        '[class*="animate-"], [data-animate]'
      );
      animatableElements.forEach(el => observer.observe(el));
    },

    /**
     * Trigger animation on element
     */
    triggerAnimation: function(element) {
      if (!element) return;

      element.classList.add('animate-fade-in');
      if (AnimationConfig.debug) console.log('Animation triggered:', element);
    },

    /**
     * Setup event listeners for interactive animations
     */
    setupEventListeners: function() {
      // Smooth click animations
      document.addEventListener('click', (e) => {
        const target = e.target.closest('button, a, [role="button"]');
        if (target && !target.classList.contains('no-animation')) {
          this.createRippleEffect(e, target);
        }
      });

      // Hover animations
      this.setupHoverAnimations();
    },

    /**
     * Create ripple effect on click
     */
    createRippleEffect: function(event, target) {
      if (AnimationConfig.reduceMotion) return;

      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');

      target.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    },

    /**
     * Setup hover animations
     */
    setupHoverAnimations: function() {
      const hoverElements = document.querySelectorAll('[class*="hover-"]');
      
      hoverElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
          if (AnimationConfig.debug) console.log('Hover enter:', this);
        });

        el.addEventListener('mouseleave', function() {
          if (AnimationConfig.debug) console.log('Hover leave:', this);
        });
      });
    },

    /**
     * Attach scroll-based animations
     */
    attachScrollAnimations: function() {
      let ticking = false;

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            this.updateScrollAnimations();
            ticking = false;
          });
          ticking = true;
        }
      });
    },

    /**
     * Update animations based on scroll position
     */
    updateScrollAnimations: function() {
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      
      parallaxElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
        
        if (scrollPercent > 0 && scrollPercent < 1) {
          const translateY = (1 - scrollPercent) * 30;
          el.style.transform = `translateY(${translateY}px)`;
        }
      });
    }
  };

  // Stagger Animation Helper
  const StaggerHelper = {
    /**
     * Apply staggered animation to multiple elements
     */
    applyStagger: function(selector, animationClass, baseDelay = 0.1) {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        const delay = baseDelay * index;
        el.style.animationDelay = delay + 's';
        el.classList.add(animationClass);
      });
    },

    /**
     * Reset stagger animations
     */
    resetStagger: function(selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.animationDelay = '';
        el.classList.remove('animate-fade-in', 'animate-slide-up', 'animate-scale-up');
      });
    }
  };

  // Page Load Animation
  const PageLoadAnimation = {
    init: function() {
      document.addEventListener('DOMContentLoaded', () => {
        this.animatePageLoad();
      });
    },

    animatePageLoad: function() {
      if (AnimationConfig.reduceMotion) return;

      const header = document.querySelector('header');
      const mainContent = document.querySelector('main');

      if (header) {
        header.classList.add('animate-slide-down');
      }

      if (mainContent) {
        mainContent.classList.add('animate-fade-in');
        mainContent.style.animationDelay = '0.2s';
      }

      // Stagger section animations
      const sections = document.querySelectorAll('section');
      sections.forEach((section, index) => {
        section.classList.add('animate-slide-up');
        section.style.animationDelay = (0.1 * (index + 1)) + 's';
      });

      if (AnimationConfig.debug) console.log('Page load animation triggered');
    }
  };

  // Loading State Animation
  const LoadingAnimation = {
    /**
     * Show loading animation
     */
    show: function(selector = '.loading') {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.remove('hidden');
        element.classList.add('animate-fade-in');
      }
    },

    /**
     * Hide loading animation
     */
    hide: function(selector = '.loading') {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('animate-fade-out');
        setTimeout(() => {
          element.classList.add('hidden');
          element.classList.remove('animate-fade-out');
        }, 300);
      }
    }
  };

  // Export public API
  window.FashunAnimations = {
    manager: AnimationManager,
    stagger: StaggerHelper,
    loading: LoadingAnimation,
    config: AnimationConfig
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      AnimationManager.init();
      PageLoadAnimation.init();
    });
  } else {
    AnimationManager.init();
    PageLoadAnimation.init();
  }
})();
