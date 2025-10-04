window.slate = window.slate || {};
window.theme = window.theme || {};
window.gemini = window.gemini || {};

/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.eventNamespace
      ? 'focusin.' + options.eventNamespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  shopifyAjaxAddURL:             '/cart/add.js',
  shopifyAjaxChangeURL:          '/cart/change.js',
  shopifyAjaxCartURL:            '/cart.js',
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  },

  init: function() {
    var _self = this;
    $(document).on('click', '.js-add-to-cart', function() {
      var $this = $(this);

      if ($this.hasClass('interactive-item--added')) {
        return true;
      }

      $this.addClass('interactive-item--adding');
      _self
        .addItem($this.data('variant-id'), 1)
        .done(function() {
          $this.addClass('interactive-item--added');
        })
        .always(function() {
          $this.removeClass('interactive-item--adding');
        });
      return false;
    });

    $('.js-cart-widget').on('click', '.js-remove-item-cart', function() {
      var $this = $(this);
      var pr = $this.closest('.shopping-cart');

      pr.addClass('shopping-cart--modifying');
      _self
        .removeItem($this.data('variant-id'), 0)
        .always(function() {
          pr.removeClass('shopify-cart--modifying');
        });

      return false;
    });
  },

  addItem: function(variant_id, quantity, properties) {
    var _self = this;

    return $.post(this.shopifyAjaxAddURL, {
      id: variant_id,
      quantity: quantity,
      properties: properties
    }, null, 'json')
    .done(function(res) {
      slate.alert.success(theme.strings.addedToCart);
      _self.updateCart();
    })
    .fail(function(err) {
      var responseJSON = JSON.parse(err.responseText);
      slate.alert.error('<b>' + responseJSON.message + ':</b> ' + responseJSON.description);
    })
    .always(function() {
    });
  },

  removeItem: function(variant_id, quantity) {
    var _self = this;

    return $.post(this.shopifyAjaxChangeURL, {
      id: variant_id,
      quantity: quantity
    }, null, 'json')
    .done(function(res) {
      _self.updateCart();
    });
  },

  updateCart: function() {
    $.get('/cart?view=json', function(data) {
      $('.js-cart-widget').html(data);
      $('.currency .active').trigger('click');
      $(document).trigger('gemini:cartUpdated');
    });

    $.getJSON(this.shopifyAjaxCartURL)
      .done(function(cart) {
        var el = $('.js-cart-count');
        el.html(cart.item_count).addClass('updated');

        setTimeout(function() {
          el.removeClass('updated');
        }, 1000);
      })
      .fail(function(e) { });
  },

  registerEvent: function() {
    $('.input-quantity').each(function() {
      var $this = $(this)
        , $el = $this.find('.input-quantity__value')
        , $minus = $this.find('.minus')
        , $plus = $this.find('.plus')
        ;

      $minus.on('click', function() {
        var val = parseInt($el.val())
          , minVal = $el.attr('min') || 1
          ;

        if (parseInt(minVal) < val && val > 1) {
          $el.val(val - 1);
        }
      });

      $plus.on('click', function() {
        var val = parseInt($el.val())
          , maxVal = $el.attr('max')
          ;

        if (
          maxVal === undefined
          || (maxVal && parseInt(maxVal) > val)
        ) {
          $el.val(val + 1);
        }
      });
    });
  }
};

slate.filter = {
  // state holder - remember base collection before use types/vendors filter.
  stateBeforeClickSpecialFilter: '',

  init: function() {
    this.defaultClickPrevent();
    this.filterControlHandle();
    this.filterTagHandle();
    this.filterSpecialHandle();
    this.clearFilterTagHandle();
    this.clearFilterSpecialHandle();
    this.clearAllHandle();
    this.mapActiveFilters();
    this.mapClearButton();
    this.setFilterPosition();
  },

  /**
   * Prevent default behavior on filter links, clear link of groups
   */
  defaultClickPrevent: function() {
    var $document = $(document);

    $document.on('click', '.filter__item > a, .filter__clear', function(evt) {
      evt.preventDefault();
    });
  },

  /**
   * Handle event click on the filter-control icon on collection toolbar
   */
  filterControlHandle: function() {
    $(document).on('click', '.filter-control', function(evt) {
      if ($('#filter-drawer').length) {
        $.sidr('open', 'filter-drawer');
      }
    });
  },

  /**
   * Handle event click on a filter by tag item
   */
  filterTagHandle: function() {
    var _self = this;

    $(document).on(
      'click',
      '.filter__item:not([data-group="types"], [data-group="vendors"]) > a',
      function(evt) {
        var $this = $(this)
          , pr = $this.parent()
          , tagHandle = pr.data('filter')
          , currentTags = _self.getCurrentTags() // list of constraint.
          , currentQuery = _self.getCurrentQuery()
          ;

        if (!pr.hasClass('filter__item--active')) {
          var activeTags = $this.parents('.filter__list').find('li.filter__item--active');

          _self.removeActiveTagsInGroup(currentTags, activeTags);
        }

        if (tagHandle) {
          var tagPos = currentTags.indexOf(tagHandle);

          if (tagPos >= 0) {
            // tag already existed, remove tag.
            currentTags.splice(tagPos, 1);
          } else {
            // tag not existed.
            currentTags.push(tagHandle);
          }
        }

        _self.updateConstraints(currentTags, currentQuery);

        _self.getFilterData();
      });
  },

  /**
   * Handle click event when click on filter by product type item
   */
  filterSpecialHandle: function() {
    var _self = this;

    $(document).on(
      'click',
      '.filter__item[data-group="types"] > a, .filter__item[data-group="vendors"] > a',
      function(evt) {
        var $this = $(this)
          , pr = $this.parent()
          , typeUrl = pr.data('link')
          , questionMarkPos = typeUrl.indexOf('?q=')
          , currentTags = _self.getCurrentTags() // list of constraint.
          , filterUrl = '' // pathname of ajax URL.
          , currentQuery = '' // query string of ajax URL.
          ;

        if (!pr.hasClass('filter__item--active')) {
          var currentPathname = location.pathname;

          // only update state holder when location.pathname isn't type/vendor.
          if (
            currentPathname !== '/collections/types'
            && currentPathname !== '/collections/vendors'
          ) {
            _self.stateBeforeClickSpecialFilter = currentPathname;
          }

          filterUrl = (questionMarkPos >= 0)
                    ? typeUrl.slice(0, questionMarkPos)
                    : typeUrl;

          if (questionMarkPos >= 0) {
            currentQuery = typeUrl.slice(questionMarkPos + 3);
          }
        } else {
          filterUrl = _self.getOldStatePathname();

          currentQuery = '';
        }

        _self.updateConstraints(currentTags, currentQuery);

        _self.getFilterData(filterUrl);
      });
  },

  /**
   * Handle event click on a clear button
   */
  clearFilterTagHandle: function() {
    var _self = this;

    $(document).on(
      'click',
      '.filter__clear',
      function(e) {
        var pr = $(this).closest('.filter');

        // Ignore filter--category and filter--vendor | special filter
        if (pr.hasClass('filter--category') || pr.hasClass('filter--vendor')) {
          return;
        }

        var activeTags = pr.find('.filter__item--active')
          , currentTags = _self.getCurrentTags()
          , currentQuery = _self.getCurrentQuery()
          ;

        _self.removeActiveTagsInGroup(currentTags, activeTags);

        _self.updateConstraints(currentTags, currentQuery);

        _self.getFilterData();
      });
  },

  /**
   * Handle event click on the clear button of
   * types/vendors filter
   */
  clearFilterSpecialHandle: function() {
    var _self = this;

    $(document).on(
      'click',
      '.filter--category .filter__clear, .filter--vendor .filter__clear',
      function(evt) {
        var filterUrl = _self.getOldStatePathname()
          , currentTags = _self.getCurrentTags()
          , currentQuery = ''
          ;

        _self.updateConstraints(currentTags, currentQuery);

        _self.getFilterData(filterUrl);
      });
  },

  /**
   * Handle event click on the clear-all button
   */
  clearAllHandle: function() {
    var _self = this;

    $(document).on('click', '.filter__clear-all', function(e) {
      var filterUrl = _self.getOldStatePathname();

      _self.updateConstraints([], '');

      _self.getFilterData(filterUrl);

      if ($('#filter-drawer').length) {
        $.sidr('close', 'filter-drawer');
      }
    });
  },

  /**
   * Add class active for filters appear on url
   */
  mapActiveFilters: function() {
    var _self = this
      , currentTags = _self.getCurrentTags()
      , currentQuery = decodeURIComponent(_self.getCurrentQuery()).replace(/\+/g, ' ')
      ;

    $('[data-title="' + currentQuery + '"]').addClass('filter__item--active');

    for (var ind = 0, _length = currentTags.length; ind < _length; ind++) {
      var activeFiltersSelector = '[data-filter="' + currentTags[ind] + '"]';

      $(activeFiltersSelector).addClass('filter__item--active');
    }
  },

  /**
   * Add class to show clear button when filter is active
   */
  mapClearButton: function() {
    $('.filter').each(function() {
      var $this = $(this);

      if ($this.find('.filter__item--active').length > 0) {
        $this
          .find('.filter__clear')
          .addClass('filter__clear--active');
      }
    });

    // clear all button.
    if ($('.filter').find('.filter__item--active').length > 0) {
      $('.filter__clear-all').addClass('filter__clear-all--active');
    }
  },

  /**
   * With the fullwidth layout, just run sidr function to make sidebar
   * responsive.
   *
   * ------
   *
   * With the layouts which contain sidebar, move the sidebar into filter
   * drawer if needed then run sidr function to make it responsive.
   *
   * If user switch back and forth between large and small screens, move the
   * sidebar accordingly.
   */
  setFilterPosition: function() {
    var _self = this
      , $window = $(window)
      , screenWidth = $window.width()
      , isFullLayout = $('.page-content').hasClass('page-content--fullwidth')
      ;

    if (isFullLayout) {
      _self.makeSidebarFilterResponsive();
    } else {
      _self.moveFilterToDrawer(screenWidth);

      $window.on('resize', function() {
        var _screenW = $window.width();

        _self.moveFilterToDrawer(_screenW);
      });
    }
  },



  // =============================================
  // HELPER FUNCTIONS FOR slate.filter
  // =============================================

  /**
   * Get current tags from url using object Shopify.queryParams
   *
   * @return {arr} currentTags
   */
  getCurrentTags: function() {
    var currentTags = [];

    if (Shopify.queryParams && Shopify.queryParams.constraint) {
      currentTags = Shopify.queryParams.constraint.split('+');
    }

    return currentTags;
  },

  /**
   * Get current query from url using object Shopify.queryParams
   *
   * @return {string} current query string
   */
  getCurrentQuery: function() {
    return Shopify.queryParams && Shopify.queryParams.q
      ? Shopify.queryParams.q
      : '';
  },

  /**
   * Get the old state pathname to go back when clear a types/vendors filters.
   *
   * @return {string} filterUrl
   */
  getOldStatePathname: function() {
    var _self = this
      , filterUrl = ''
      ;

    if (_self.stateBeforeClickSpecialFilter.length) {
      filterUrl = _self.stateBeforeClickSpecialFilter;
      // reset old state holder.
      _self.stateBeforeClickSpecialFilter = '';
    } else {
      filterUrl = '/collections/all';
    }

    return filterUrl;
  },

  /**
   * Remove current active filters in same group
   *
   * @param {arr} currentTags
   * @param {arr} activeTags jquery array contains matched elements.
   *
   * @return {arr} currentTags
   */
  removeActiveTagsInGroup: function(currentTags, activeTags) {
    if (activeTags.length > 0) {
      activeTags.each(function() {
        var tagHandle = $(this).data('filter');

        if (tagHandle) {
          var tagPos = currentTags.indexOf(tagHandle);

          if (tagPos >= 0) {
            //remove tag
            currentTags.splice(tagPos, 1);
          }
        }
      });
    }

    return currentTags;
  },

  /**
   * Update constraint property of the object Shopify.queryParams
   *
   * @param {arr} currentTags
   * @param {arr} currentQuery URLified Types or Vendors name.
   */
  updateConstraints: function(currentTags, currentQuery) {
    var _self = this;

    _self.updateQueryParams('constraint', currentTags.join('+'));
    _self.updateQueryParams('q', decodeURIComponent(currentQuery).replace(/\+/g, ' '));
  },

  /**
   * Update Shopify.queryParams properties
   *
   * @param {string} property
   * @param {string} value
   */
  updateQueryParams: function(property, value) {
    if (value && value.length) {
      Shopify.queryParams = Shopify.queryParams || {};
      Shopify.queryParams[property] = value;
    } else {
      if (Shopify.queryParams) {
        delete Shopify.queryParams[property];
      }
    }
  },

  /**
   * Get data by calling ajax to the new url which is modified when click on
   * the filter items.
   *
   * @param {string} baseAjaxUrl
   */
  getFilterData: function(baseAjaxUrl) {
    var _self = this
      , queryParams = Shopify.queryParams
      , query = $.param(queryParams).replace(/%2B/g, '+')
      , url = baseAjaxUrl || location.pathname
      , offsetTop = $('.page-content').offset().top
      ;

    // '?' is not added when there's no constraint.
    if (query.length > 0) {
      url += '?' + query;
    }

    history.pushState({
      param: queryParams
    }, url, url);

    slate.helper.showLoading();

    $('body, html').animate({
      scrollTop: offsetTop
    }, 750);

    $.get(url)
      .done(function(data) {
        _self.mapFilterData(data);
        _self.mapClearButton();

        // re-init quick view function.
        gemini.magnificPopup.quickViewInit();
      })
      .fail(function(err) {
      })
      .always(function() {
        slate.helper.hideLoading();
      });
  },

  /**
   * Replace html content of grid items and the sidebar filter with new markup
   * returned by getFilterData()
   *
   * @param {html} data
   */
  mapFilterData: function(data) {
    var _self = this
      , $data = $(data)
      ;

    $('.collection-content').replaceWith($data.find('.collection-content'));
    $('.collection-filter').replaceWith($data.find('.collection-filter'));

    _self.mapActiveFilters();

    $(document).trigger('gemini:filterable');
  },

  /**
   * Helper function for setFilterPosition() to move real sidebar back and forth
   * between original wrapper and filter-drawer
   *
   * @param {int} screenWidth
   */
  moveFilterToDrawer: function(screenWidth) {
    var _self = this
      , $collectionFilter = $('.collection-filter')
      , $filterDrawer = $('#full-layout-filter-drawer')
      , $originFilterWrapper = $('.js-filter-wrapper')
      , filterIsNotMoved = $collectionFilter.parent()[0] === $originFilterWrapper[0]
      ;

    if (screenWidth <= 989) {
      if (filterIsNotMoved) {
        $collectionFilter
          .detach() // use detach() to keep bound events.
          .prependTo($filterDrawer);

        // re-run sidr to make sidebar responsive.
        _self.makeSidebarFilterResponsive();
      }
    } else {
      if (!filterIsNotMoved) {
        $collectionFilter
          .detach() // use detach() to keep bound events.
          .prependTo($originFilterWrapper);
      }
    }
  },

  /**
   * Helper function for setFilterPosition() which run sidr function to make
   * sidebar responsive
   */
  makeSidebarFilterResponsive: function() {
    if ($('.collection-sidebar--full-layout')) {
      var $filterBtn = $('.filter-control');
      $filterBtn.sidr({
        name: 'filter-drawer',
        source: '#full-layout-filter-drawer',
        side: 'left',
        renaming: false,
        displace: false,
        speed: 300,
        threshold: 45,
        onOpen: function() {
        },
        onClose: function() {
        }
      });

      // Remove .collection-filter to prevent
      // duplication content when replace data
      // @see mapFilterData()
      $('#full-layout-filter-drawer')
        .find('.collection-filter')
        .remove();

      $('.filter-drawer__close').on('click', function() {
        $.sidr('close', 'filter-drawer');
      });
    }
  }
}

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace rte
 */

slate.rte = {

  wrapTable: function() {
    $('.rte table').wrap('<div class="rte__table-wrapper"></div>');
  },

  iframeReset: function() {
    var $iframeVideo = $('.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"]');
    var $iframeReset = $iframeVideo.add('.rte iframe#admin_bar_iframe');

    $iframeVideo.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="rte__video-wrapper"></div>');
    });

    $iframeReset.each(function() {
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

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
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = $.extend({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;
        var options = variant.options;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this._updateAvailability(variant);
      this._updateSku(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      if (!variant.featured_image) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant availability changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantAvailabilityChange
     */
    _updateAvailability: function(variant) {
      this.$container.trigger({
        type: 'variantAvailabilityChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant sku changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantSkuChange
     */
    _updateSku: function(variant) {
      this.$container.trigger({
        type: 'variantSkuChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  });

  return Variants;
})();

slate.wishlist = {
  initRange: function() {
    this.cookieName = "wishlist";
  },

  registerEvent: function() {
    var _self = this;

    $(document).on('click', '.js-add-to-wishlist', function() {
      var $this = $(this);
      var id = $this.data('product-handle');

      // Already in wishlist
      if ($this.hasClass('interactive-item--added')) {
        return true;
      }

      $this.addClass('interactive-item--adding');
      try {
        var value = JSON.parse(Cookies.get(_self.cookieName) || null);
        if (value == null) {
          value = [id];
        } else {
          if (value.indexOf(id) == -1) {
            value.push(id);
          }
        }

        Cookies.set(_self.cookieName, JSON.stringify(value), {
          expires:14, path:'/'
        });

        setTimeout(function() {
          $this.removeClass('interactive-item--adding');
          $this.addClass('interactive-item--added');
        }, 500);
      } catch (err) {
        $this.removeClass('interactive-item--adding');
      }

      return false;
    });

    $(document).on('click', '.js-wishlist-remove', function() {
      var $this = $(this);
      var handle = $this.data('product-handle');
      try {
        var value = JSON.parse(Cookies.get(_self.cookieName) || null);
        var index = value.indexOf(handle);
        if (index != -1) {
          value.splice(index, 1);

          Cookies.set(_self.cookieName, JSON.stringify(value), {
            expires:14, path:'/'
          });

          setTimeout(function() {
            $this.parent().parent().remove();
          }, 500);

          return;
        }
      } catch (err) {
      }
    });
  },

  checkInWishlist: function() {
    var _self = this;
    try {
      var value = JSON.parse(Cookies.get(this.cookieName) || null);
      $('.js-add-to-wishlist').each(function() {
        var $this = $(this);
        var id = $this.data('product-handle');
        if (value.indexOf(id) != -1) {
          $this.addClass('interactive-item--added');
        }
      });

      $('.js-wishlist-total').html(value.length);
    } catch (err) {
    }
  },

  init: function() {
    this.initRange();
    this.registerEvent();
    this.checkInWishlist();
  }
}

slate.search = {
  init: function() {
    var selectors = {
      open: $('.js_header__search-btn'),
      close: $('.js_header__search .close'),
      search: $('.js_header__search'),
      bar: $('.js_header__search-bar'),
      input: $('.js_header__search-input'),
      body: $('body')
    };

    function openSearch() {
      selectors.body.addClass('search-opened');
      selectors.search.addClass('open');
      selectors.input.focus();
    }

    function closeSearch() {
      selectors.body.removeClass('search-opened');
      selectors.search.removeClass('open');
      selectors.input.blur();
      selectors.input.val('');
    }

    selectors.open.on('click', function() {
      openSearch();
    });
    selectors.close.on('click', function() {
      closeSearch();
    });
    selectors.search.on('click', function() {
      closeSearch();
    });
    selectors.bar.on('click', function(e) {
      e.stopPropagation();
    });

    document.addEventListener('keyup', function(ev) {
      // escape key.
      if( ev.keyCode == 27 ) {
        closeSearch();
      }
    });
  },
};

slate.header = {
  /**
   * Mobile navigation
   */
  init: function() {
    var _self = this;

    this.mobileNav();
    this.fixedHeader();
    this.menuArrange();
    this.headerFive();
    this.miniCart();
    this.makeSearchResultListScrollable();

    $(window).on('resize', function() {
      _self.fixedHeader();
      _self.makeSearchResultListScrollable();
    });
  },

  miniCart: function() {
    // Ingore mobile nav
    $cartBtn = $('.js-header-cart-btn');
    $cartType = $cartBtn.data('cart-type');

    if ('dropdown' == $cartType) {
      $cartBtn.on('click', function() {
        $dropdown = $(this).next('.js-cart-widget');

        if ($dropdown[0]) {
          $dropdown.toggleClass('open');
        }

        $('.js-cart-widget').on('click', function(e) {
          e.stopPropagation();
        });

        $(document).on('click', function() {
          $('.js-cart-widget').removeClass('open');
        });

        return false
      });
    } else if ('slide' == $cartType) {
      $cartBtn.sidr({
        name: 'cart-drawer',
        source: '#mini-cart-drawer',
        side: 'right',
        renaming: false,
        displace: false,
        speed: 300,
        threshold: 45,
        onOpen: function() {
          $('body').append('<div class="drawer-mask"></div>');
        },
        onClose: function() {
          $('.drawer-mask').remove();
        }
      });

      $('.mini-cart__close').on('click', function() {
        $.sidr('close', 'cart-drawer');
      });

      $('#cart-drawer').on('click', function(e) {
        e.stopPropagation();
      });

      $(document).on('click', function() {
        $.sidr('close', 'cart-drawer');
      });

      return false;
    }
  },

  mobileNav: function() {
    $('.js-mobile-nav-open').sidr({
      name: 'mobile-drawer',
      source: '#drawer',
      side: 'left',
      renaming: false,
      displace: false,
      speed: 300,
      threshold: 45,
      onOpen: function() {
        if (Currency.currentCurrency) {
          $('[name=currencies]').val(Currency.currentCurrency);
        }
        $('body').append('<div class="drawer-mask"></div>');
      },
      onClose: function() {
        if (Currency.currentCurrency) {
          $('[name=currencies]').val(Currency.currentCurrency);
        }
        $('.drawer-mask').remove();
      }
    });

    $('.js-mobile-nav-close').on('click', function() {
      $.sidr('close', 'mobile-drawer');
    });

    $('#mobile-drawer .mobile-nav--has-submenu > a').on('click', function(e) {
      var pr = $(this).parent();

      if (pr.hasClass('open')) {
        pr.removeClass('open');
      } else {
        pr.parent().find('.open').removeClass('open');
        pr.addClass('open');
      }

      e.preventDefault();
      e.stopPropagation();
    });
  },

  headerFive: function() {
    $('.header05 .sidebar__nav .site-nav .site-nav--has-submenu > a').on('click', function(e) {
      var pr = $(this).parent();

      if (pr.hasClass('open')) {
        pr.removeClass('open');
      } else {
        pr.parent().find('.open').removeClass('open');
        pr.addClass('open');
      }

      e.preventDefault();
      e.stopPropagation();
    });

    if( $('.header05')[0] ) {
      $('body').addClass('body--sidebar-left');
    }
  },

  fixedHeader: function() {
    var $window = $(window);

    if(
      $('.header--fixed:not(.header05)')[0]
      || ($('.header--fixed.header05')[0] && ($window.width() < 990))
    ) {
      var scrollAnchor = 0;
      var $header = $('.header');

      if (!window.headerPosition) {
        var headHeight = $header.outerHeight() + $header.offset().top;
        window.headerPosition = headHeight;
      }

      var pos = window.headerPosition;

      if($window.scrollTop() > pos) {
        $header.addClass('header--sticky');
      }

      $window.on('scroll DOMMouseScroll', function() {
        var scrollTop = $window.scrollTop();

        if(scrollTop - scrollAnchor >= 5 || scrollTop - scrollAnchor <= -5 ) {
          scrollAnchor = scrollTop;

          if(scrollTop > pos) {
            $header.addClass('header--sticky');
          } else {
            $header.removeClass('header--sticky');
          }
        }
      });
    } else {
      $window.off('scroll DOMMouseScroll');
    }
  },

  menuArrange: function() {
    var $extraMenu = $('.header__extra');
    var extraWide = 0;
    var $header = $('.header');

    // Search bar width
    var headerSearch = $('.js_header__search', $header);
    var headerSearchBtn = $('.js_header__search-btn', $header);
    if (headerSearch.length && headerSearchBtn.length) {
      var ww = $(window).width();
      var left = headerSearchBtn.offset().left + headerSearchBtn.outerWidth();
      if(ww > 749) {
        var w = left - (ww - left);
        $('.header__search-wrap', headerSearch).width(w);
      }
    }

    // Header 02
    if ($header.hasClass('header02')) {
      // Remove logo space before calculate
      $('.site-nav__logospace').remove();

      var $headerWidth = $('.header__main .page-width');
      var $nav = $header.find('.site-nav');
      var $children = $nav.children();
      var $childIndex = Math.ceil($children.length / 2) - 1;

      $space = 0;
      $i = 0;
      $children.each(function() {
        if ( $i <= $childIndex ) {
          $space += $(this).width();
        }
        $i++;
      });

      $space += 250/2; //250 is logo width
      var $left = $headerWidth.width()/2 - $space + 30; //30px for gutter grid
      $nav.css({'padding-left': $left});

      $children
        .eq($childIndex)
        .after('<li class="site-nav__logospace">&nbsp;</li>');

      return;
    }

    // Header 01
    $extraMenu.children().each(function(){
      extraWide += $(this).outerWidth(true);
    });
    extraWide += 20;
    $extraMenu.css({'width': extraWide});
    $('.header.header01').find('.site-nav').css({'margin-right': extraWide});
  },

  makeSearchResultListScrollable: function() {
    var jScreenHeight = $(window).height()
      , screenHeight = (typeof window.outerHeight != 'undefined')
                    ? Math.max(window.outerHeight, jScreenHeight)
                    : jScreenHeight
      , $resultList = $('#search-results')
      , innerHeight = window.innerHeight
                      ? window.innerHeight
                      : $(window).height()
      ;

    if (screenHeight <= 750) {
      $resultList.css({"maxHeight": (screenHeight - 120) + "px", "overflow": "auto"});
    } else {
      $resultList.css({"maxHeight": "none"});
    }
  }
};

slate.backToTop = {
  init: function() {
    if ($('#js-back-to-top').length) {
      var ele = $('#js-back-to-top'),
        scrollTrigger = 300, // px
        backToTop = function () {
          var scrollTop = $(window).scrollTop();
          if (scrollTop > scrollTrigger) {
            ele.addClass('show');
          } else {
            ele.removeClass('show');
          }
        };
      $(window).on('scroll', function () {
        backToTop();
      });
      ele.on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({
          scrollTop: 0
        }, 700);
      });

      backToTop();
    }
  }
};

slate.carousel = {
  init: function() {
    var _self = this;
    $('.js-slick-carousel').each(function() {
      var $this = $(this);
      var _options = {};
      var arrowType = $this.attr('data-arrow-type');

      _self.setArrow(arrowType, _options);

      if ('arrow' != arrowType) {
        $this.css('overflow', 'hidden');
      }

      if (!$this.hasClass('slick-initialized')) {
        $this.slick(_options);
      } else {
        $this.slick('unslick');
        $this.slick(_options);
      }
    });
  },

  initHero: function() {
    var $hero = $('.js-hero');
    var minHeight = $(window).height() - $('.announcement-bar').outerHeight() - $('.header').outerHeight();

    if ($hero.length) {
      $hero.css('minHeight', minHeight);

      $hero.imagesLoaded()
        .always(function() {
          $hero.css('minHeight', 0);
        });
    }
  },

  setArrow: function(arrowType, options, slideshow) {
    if ('' != arrowType) {
      options.prevArrow =
        '<button type="button" class="slick-arrow '
        + arrowType
        + '-prev"><i class="fa fa-angle-left" aria-hidden="true"></i></button>';
      options.nextArrow =
        '<button type="button" class="slick-arrow '
        + arrowType
        + '-next"><i class="fa fa-angle-right" aria-hidden="true"></i></button>';

      if (slideshow) {
        if ('arrow' != arrowType) {
          slideshow.addClass('slick--hack');
        } else {
          if (slideshow.hasClass('slick--hack')) {
            slideshow.removeClass('slick--hack');
          }
        }
      }
    }

    return options;
  },


  // -----------------------------------
  // Get basic options for slick slider
  //
  // @param jQuery object $slider
  // @return object _options
  // -----------------------------------
  getSlickOptions: function($slider) {
    var _options = {
      fade: ($slider.data("fade") == true),
      infinite: ($slider.data("infinite") == true),
      arrows: ($slider.data("arrows") == true),
      dots: ($slider.data("dots") == true),
      autoplay: ($slider.data("autoplay") == true)
    };


    if (_options.arrows) {
      var arrowType = $slider.data("arrowType");

      _options = this.setArrow(arrowType, _options, $slider);
    }

    if (_options.autoplay) {
      var autoplaySpeed = $slider.data('autoplaySpeed');
      var positiveIntRegex = /^[1-9]\d+$/;

      if (positiveIntRegex.test(autoplaySpeed)) {
        _options.autoplaySpeed = autoplaySpeed;
      }

      _options.pauseOnHover = true;
    }

    return _options;
  },


  // -----------------------------------
  // collection page - banner slider
  // -----------------------------------
  collectionSlideshow: function() {
    var $slideshow = $('.js-collection-slideshow');

    var slickOptions = this.getSlickOptions($slideshow);

    if (!$slideshow.hasClass('slick-initialized')) {
      $slideshow.slick(slickOptions);
    } else {
      $slideshow.slick('unslick');
      $slideshow.slick(slickOptions);
    }
  },


  // -----------------------------------
  // homepage hero
  // -----------------------------------
  homepageSlideshow: function() {
    var $slideshow = $('.js-hero');
    if ($slideshow[0]) {
      slate.homepageHero.makeHeroFullHeight($slideshow);

      var _options = {};
      var arrowType = $slideshow.attr('data-arrow-type');

      this.setArrow(arrowType, _options, $slideshow);

      if (!$slideshow.hasClass('slick-initialized')) {
        $slideshow.slick(_options);
      } else {
        $slideshow.slick('unslick');
        $slideshow.slick(_options);
      }
    }
  },


  // -----------------------------------
  // product details - gallery slideshow
  // -----------------------------------
  // TODO: refactor this function.
  productSlideshow: function() {
    var $gallerySlider = $('.gallery-slider');
    var isSyncingSlider = false;
    var isCenterSlider = false;
    var isBottomSyncSlider = false;

    if (
      $gallerySlider.hasClass('gallery-slider--single')
    || $gallerySlider.hasClass('gallery-slider--center')
    ) {
      var $slider = $('.js-product-slider');

      if ($gallerySlider.hasClass('gallery-slider--center')) {
        var centerPadding = $slider.data('centerPadding');

        isCenterSlider = true;
      }
    } else {
      var $sliderFor = $('.js-slider-for');
      var $sliderNav = $('.js-slider-nav');

      isSyncingSlider = true;

      if ($gallerySlider.hasClass('gallery-slider--sync-bottom')) {
        isBottomSyncSlider = true;
      }
    }

    if (!isSyncingSlider) {
      var slickOptions = this.getSlickOptions($slider);

      if (isCenterSlider) {
        slickOptions.centerMode = true;
        slickOptions.centerPadding = centerPadding || '0px';
        slickOptions.slidesToShow = 3;
        slickOptions.slidesToScroll = 1;
        slickOptions.infinite = true;
        // fade=true causes a bug when slidesToShow > 1.
        slickOptions.fade = false;
        slickOptions.responsive = [
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              infinite: false
            }
          }
        ];
      }

      if ($slider) {
        if (!$slider.hasClass('slick-initialized')) {
          $slider.slick(slickOptions);
        } else {
          $slider.slick('unslick');
          $slider.slick(slickOptions);
        }

        if (isCenterSlider) {
          $slider.on('afterChange', function(event, slick, currentSlide, nextSlide) {
            gemini.magnificPopup.productGalleryPopupInit();
          });
        }
      }
    } else {
      var $window = $(window);
      var slickOptions = this.getSlickOptions($sliderFor);
      var slickForOptions = $.extend(true, {}, slickOptions);
      var slickNavOptions = $.extend(true, {}, slickOptions);

      slickForOptions.arrows = false;
      slickForOptions.asNavFor = '.js-slider-nav';

      slickNavOptions.asNavFor = '.js-slider-for';
      slickNavOptions.focusOnSelect = true;
      slickNavOptions.slidesToShow = 3;
      slickNavOptions.slidesToScroll = 1;
      // always disable dots on sliderNav.
      slickNavOptions.dots = false;
      // fade=true cause bug when slidesToShow > 1.
      slickNavOptions.fade = false;
      slickNavOptions.responsive = [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2
          }
        }
      ];

      if (!isBottomSyncSlider) {
        slickNavOptions.vertical = true;
        slickNavOptions.verticalSwiping = true;

        if (
          slickNavOptions.arrows
          && '' != slickNavOptions.prevArrow
          && '' != slickNavOptions.nextArrow
        ) {
          if ($sliderNav) {
            if (!/arrow-prev/.test(slickNavOptions.prevArrow)) {
              $sliderNav.addClass('slick--hack');
            } else {
              if ($sliderNav.hasClass('slick--hack')) {
                $sliderNav.removeClass('slick--hack');
              }
            }
          }

          slickNavOptions.prevArrow = slickNavOptions.prevArrow.replace('fa-angle-left', 'fa-angle-up');
          slickNavOptions.nextArrow = slickNavOptions.nextArrow.replace('fa-angle-right', 'fa-angle-down');
        }
      }

      if ($sliderFor && $sliderNav) {
        if ($sliderFor.hasClass('slick-initialized')) {
          $sliderFor.slick('unslick');
          $sliderFor.slick(slickForOptions);
        } else {
          $sliderFor.slick(slickForOptions);
        }

        if ($sliderNav.hasClass('slick-initialized')) {
          $sliderNav.slick('unslick');
          $sliderNav.slick(slickNavOptions);
        } else {
          $sliderNav.slick(slickNavOptions);
        }
      }

      $window.on('resize', function() {
        // Hack, refresh slick by 'setPosition' after window resize
        setTimeout(function() {
          if ($sliderFor && $sliderNav) {
            if ($sliderNav.hasClass('slick-initialized')) {
              $sliderNav.slick('setPosition');
            }
          }
        }, 500);
      });
    }
  },

  // --------------------------------------------
  // when on small screens, change section to a
  // carousel slider
  // --------------------------------------------
  relatedProductSlideshow: function() {
    var self = this
      , $window = $(window)
      , screenWidth = $window.width()
      , $relatedProduct = $('.js-related-product')
      , mobileColNum = ($relatedProduct.length) ? $relatedProduct.data('col') : 1
      , options = {
        infinite: false,
        slidesToShow: 3,
        prevArrow: '<button type="button" class="slick-arrow arrow-prev"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button type="button" class="slick-arrow arrow-next"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        responsive: [
          {
            breakpoint: 750,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: mobileColNum
            }
          }
        ]
      }
      ;

    self.relatedProductSlideshowRun($relatedProduct, screenWidth, options);

    $window.on('resize', function() {
      var _screenW = $window.width();

      self.relatedProductSlideshowRun($relatedProduct, _screenW, options);
    });
  },

  relatedProductSlideshowRun: function($relatedProduct, screenWidth, options) {
    if (screenWidth > 1024) {
      // Hack, only unslick after slick resize
      setTimeout(function() {
        if ($relatedProduct.hasClass('slick-initialized')) {
          $relatedProduct.slick('unslick');
        }

        if ($relatedProduct.hasClass('grid--carousel')) {
          $relatedProduct.removeClass('grid--carousel');
        }
      }, 250);
    } else {
      if (!$relatedProduct.hasClass('slick-initialized')) {
        $relatedProduct.addClass('grid--carousel');

        $relatedProduct.slick(options);
      }
    }
  }
};

slate.alert = {
  init: function() {
    this.container = $('.js-alert-container')
  },
  addMessage: function(type, msg, timeout) {
    timeout = timeout || 3000;
    var html = 
      '<div class="alert alert-' + type + ' alert-dismissible" role="alert">'
      + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
      + msg
      + '</div>'
      ;

    var alert = $(html);

    setTimeout(function() {
      alert.remove();
    }, timeout);
    this.container.prepend(alert);
  },
  success: function(msg, timeout) {
    this.addMessage('success', msg, timeout);
  },
  error: function(msg, timeout) {
    this.addMessage('danger', msg, timeout);
  },
  info: function(msg, timeout) {
    this.addMessage('info', msg, timeout);
  },
  danger: function(msg, timeout) {
    this.addMessage('danger', msg, timeout);
  }
}

slate.helper = {
  showLoading: function() {
    $('.page-loading').show();
  },

  hideLoading: function() {
    $('.page-loading').hide();
  }
}


/*================ Sections ================*/
/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Product = (function() {

  var selectors = {
    priceWrapper: '.js-price-wrapper',
    currentPrice: '.js-current-price',
    comparePrice: '.js-compare-price',
    availabilityText: '.js-availability',
    skuText: '.js-sku',
    singleOptionSelector: 'input:radio:hidden',
    originalSeletor: '[data-product-select]',
    availableActionWrapper: '.js-available',
    unavailableActionWrapper: '.js-unavailable',
    outOfStockActionWrapper: '.js-out-of-stock',
    inputQuantity: '.js-input-quantity',
    addToCartBtn: '.js-add-to-cart', // not used yet
    productJson: '[data-product-json]',
    productGallery: '.gallery-slider'
  };

  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);

    this.settings = {};
    this.namespace = '.product';

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());

    /**
     * From 2017-12-05, inventory_policy and inventory_quantity are
     * deprecated and can't be retrieved by json filter above but still can
     * be accessed via liquid object (with stores created after 2017-12-05).
     *
     * To keep all functions which require those 2 properties work, those
     * values should be retrieved from liquid and pass to js.
     *
     * @see https://ecommerce.shopify.com/c/api-announcements/t/deprecated-notice-inventory_quantity-and-inventory_policy-fields-in-json-liquid-filter-483506
     */
    if (this.productSingleObject.variants.length) {
      this.productSingleObject.variants.forEach(function(variant, index) {
        variant.inventory_policy = (variant.hasOwnProperty('inventory_policy'))
                                  ? variant.inventory_policy
                                  : gemini.invInfo[index].policy;
        variant.inventory_quantity = (variant.hasOwnProperty('inventory_quantity'))
                                  ? variant.inventory_quantity
                                  : gemini.invInfo[index].quantity;
      });
    }

    // [dev] no need to preload images yet
    // this.settings.imageSize = slate.Image.imageSize($(selectors.productFeaturedImage, this.$container).attr('src'));

    // slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);

    this.initVariants();
  }

  Product.prototype = $.extend({}, Product.prototype, {

    /**
     * Handles change events from the variant inputs
     */
    initVariants: function() {
      var options = {
        $container: this.$container,
        enableHistoryState: this.$container.data('enable-history-state') || false,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSeletor,
        product: this.productSingleObject
      };

      this.variants = new slate.Variants(options);

      this.$container.on('variantChange' + this.namespace, this.updateInfoWrapper.bind(this));
      this.$container.on('variantImageChange' + this.namespace, this.updateVariantFeaturedImage.bind(this));
      // [dev] only act with variantChange event
      // [dev] other events is ignored at the time of commenting
      // this.$container.on('variantPriceChange' + this.namespace, this.updatePrices.bind(this));
      // this.$container.on('variantAvailabilityChange' + this.namespace, this.updateAvailability.bind(this));
      // this.$container.on('variantSkuChange' + this.namespace, this.updateSku.bind(this));

      // trigger first variant select
      this.$container.trigger({
        type: 'variantChange',
        variant: this.variants.currentVariant
      });
      setTimeout(function() {
        this.$container.trigger({
          type: 'variantImageChange',
          variant: this.variants.currentVariant
        });
      }.bind(this), 500);
    },

    updateInfoWrapper: function(evt) {
      var variant = evt.variant
        , availabilityText = ''
        , availabilityClass = ''
        , skuText = ''
        , maxQuantity = 9999
        ;

      this.updateActionWrapper(variant);
      this.updatePrices(variant);

      if (variant) {
        if (variant.available) {
          if (variant.inventory_management) {
            var qty = variant.inventory_quantity;

            if (qty > 0) {
              var $inputQuantity = $(selectors.inputQuantity, this.$container);

              $inputQuantity
                .val(1)
                .attr('max', qty);
            }

            if (qty >= 10) {
              availabilityText = theme.strings.instock;
              availabilityClass = 'success';
            } else if (qty < 10 && qty > 0) {
              availabilityText = theme.strings.onlyLeft.replace('[NUMBER]', qty);
              availabilityClass = 'warning';
            } else {
              // [dev] incoming, next_incoming_date is not exited in variant
              // at the time of commenting
              // if (variant.incoming) {
              if (variant.inventory_policy == 'continue') {
                availabilityText = theme.strings.willBeInstockSoon;
                availabilityClass = 'info';
              } else {
                availabilityText = theme.strings.outofstock;
                availabilityClass = 'error';
              }
            }
          } else {
            availabilityText = theme.strings.instock;
            availabilityClass = 'success';
          }
        } else {
          availabilityText = theme.strings.outofstock;
          availabilityClass = 'error';
        }

        skuText = variant.sku;
      } else {
        availabilityText = theme.strings.unavailable;
        availabilityClass = 'disable';
      }

      this.updateAvailability(availabilityText, availabilityClass);
      this.updateSku(skuText);
    },

    updateActionWrapper: function(variant) {
      var $available = $(selectors.availableActionWrapper, this.$container)
        , $unavailable = $(selectors.unavailableActionWrapper, this.$container)
        , $outOfStock = $(selectors.outOfStockActionWrapper, this.$container)
        ;

      if (variant) {
        if (variant.available) {
          $available.show();
          $unavailable.hide();
          $outOfStock.hide();
        } else {
          $available.hide();
          $unavailable.hide();
          $outOfStock.show();
        }
      } else {
        $available.hide();
        $unavailable.show();
        $outOfStock.hide();
      }
    },

    updatePrices: function(variant) {
      var $priceWrapper = $(selectors.priceWrapper, this.$container);

      if (variant) {
        $priceWrapper.show();

        var $currentPrice = $(selectors.currentPrice, this.$container)
          , $comparePrice = $(selectors.comparePrice, this.$container)
          ;

        $currentPrice.html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

        if (variant.compare_at_price > variant.price) {
          $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        } else {
          $comparePrice.html('');
        }
      } else {
        $priceWrapper.hide();
      }

      $(document).trigger('gemini:updatePriceAfterChangeVariant');
    },

    updateAvailability: function(text, availClass) {
      var stateClasses = ['success', 'warning', 'error', 'info', 'disable'];
      var $availabilityText = $(selectors.availabilityText, this.$container);

      if ($availabilityText.length) {
        var _classList = $availabilityText.attr('class').split(/\s+/);

        $availabilityText.html(text);

        $.each(_classList, function(ind, item) {
          if (-1 != $.inArray(item, stateClasses)) {
            $availabilityText.removeClass(item);
          }
        });

        if ('' != availClass) {
          $availabilityText.addClass(availClass);
        }
      }
    },

    updateSku: function(text) {
      var $skuText = $(selectors.skuText, this.$container);

      $skuText.html(text);
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateVariantFeaturedImage: function(evt) {
      var variant = evt.variant;
      var sliderSelectors = [];
      var $gallerySlider = $('.gallery-slider', this.$container);
      var $variantItem = $('.product-gallery__item[data-variant-id*="' + variant.id + '"]');

      if ($variantItem.length) {
        var itemInd = parseInt($variantItem.data('slickIndex'));
      } else {
        return false;
      }

      if (
        $gallerySlider.hasClass('gallery-slider--single')
      || $gallerySlider.hasClass('gallery-slider--center')
      ) {
        sliderSelectors.push('.js-product-slider');
      } else {
        sliderSelectors.push('.js-slider-for', '.js-slider-nav');
      }

      $.each(sliderSelectors, function(ind, val) {
        this.updateSlickImage(val, itemInd);
      }.bind(this));
    },

    updateSlickImage: function(selector, index) {
      var $selector = $(selector);

      if (
        $selector
        && $selector.length
        && $selector.hasClass('slick-initialized')
        && $.isNumeric(index)
      ) {
        $selector.slick('slickGoTo', index);
      }
    }

    // /**
    //  * Event callback for Theme Editor `section:unload` event
    //  */
    // onUnload: function() {
    //   this.$container.off(this.namespace);
    // }
  });

  return Product;
})();

/**
 * ShopifyInstafeed Template Script
 * ------------------------------------------------------------------------------
 *
   * @namespace instafeed
 */
// TODO Set instafeed client id
// TODO Public instafeed application
// TODO Create instafeed get token site
var INSTAGRAM_OPTIONS = {
  clientId: '36276cc44a6c48e58576df452171741d',
  get: 'user',
  userId: 'self',
  resolution: 'low_resolution'
};
var INSTAGRAM_TEMPLATE = '<div class="instafeed__item__wrapper"><div class="instafeed__item"><a href="\{\{link\}\}" target="_blank"><img width="320" height="320" src="\{\{image\}\}" alt="Instagram Feed"></a><div class="instafeed__item__info"><span class="instafeed__item__likes"><i class="icon-likes"></i>\{\{likes\}\}</span><span class="instafeed__item__comments"><i class="icon-comments"></i>\{\{comments\}\}</span></div></div></div>';

theme.Instafeed = (function() {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-instafeed-select]',
    priceWrapper: '[data-price-wrapper]',
    instafeedFeaturedImage: '[data-instafeed-featured-image]',
    instafeedJson: '[data-instafeed-json]',
    instafeedPrice: '[data-instafeed-price]',
    instafeedThumbs: '[data-instafeed-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]'
  };

  /**
   * ShopifyInstafeed section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function ShopifyInstafeed(container) {
    this.$container = $(container);
    var sectionId = this.$container.attr('data-section-id');

    // Read the Instagram token
    var token_input = this.$container.find('#token-' + sectionId);
    if (!token_input) {
        // We don't have a token, no data are available and placeholder is shown
        return;
    }
    var token = token_input.val();

    // Set up options for Instafeed
    var target = this.$container.find('#instafeed-' + sectionId).get(0);
    var rows = parseInt(target.dataset.rows),
      sortBy = target.dataset.sortBy;

    var _self = this;
    var options = $.extend({}, {
      limit: 20,
      target: target,
      accessToken: token,
      sortBy: sortBy,
      template: INSTAGRAM_TEMPLATE,
      after: function () {
        slate.carousel.init();
      },
      error: function (message) {
        console.error("Unable to download Instagram data: " + message);
      }
    }, INSTAGRAM_OPTIONS);

    // Remove all previous images
    while (target.firstChild) {
      target.removeChild(target.firstChild);
    }

    // Fetch and show Instagram pictures
    var feed = new Instafeed(options);
    feed.run();
  }

  ShopifyInstafeed.prototype = $.extend({}, ShopifyInstafeed.prototype, {

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      //this.$container.off(this.namespace);
    }
  });

  return ShopifyInstafeed;
})();

/**
 * CollectionList Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the CollectionList template.
 *
   * @namespace collectionList
 */

theme.CollectionList = (function() {

  var selectors = {
    element: '.js-collection-list'
  };

  function CollectionList() {
    this.initMasonry();
  }

  CollectionList.prototype = $.extend({}, CollectionList.prototype, {
    initMasonry: function() {
      var $element = $(selectors.element);
      var msnry = $element.masonry({
        itemSelector: '.grid__item',
        columnWidth: '.grid__sizer'
      });

      $element
        .imagesLoaded(function(instance) {
          $element.masonry('resize');
        })
        .always(function(instance) {
          $element.masonry('layout');
        });
    },
  });

  return CollectionList;
})();


/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // Toggle new/edit address forms
  $('.address-new-toggle').on('click', function() {
    $newAddressForm.toggleClass('hide');
  });

  $('.address-edit-toggle').on('click', function() {
    var formId = $(this).data('form-id');
    $('#EditAddress_' + formId).toggleClass('hide');
  });

  $('.address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  var config = {
    recoverPasswordForm: '#RecoverPassword',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }
})();


/*================ gemini ================*/
gemini.collectionGrid = {
  init: function() {
    var $container = $('.collection-content');
    var $grid = $('.js-grid-masonry');

    $grid.masonry({
      itemSelector: '.grid__item',
      percentPosition: true
    });

    $container
      .imagesLoaded(function(instance) {
        $grid.masonry('layout');
      })
      .always(function(instance) {
        $grid.masonry('layout');
      });

    // hack, to make masonry re-layout items after spr-badge is loaded via ajax
    var checkIfReviewLoaded = setInterval(function() {
      var $review = $('.spr-badge');

      if ($review.length) {
        $grid.masonry('layout');
        clearInterval(checkIfReviewLoaded);
      }
    }, 500);
  }
}

gemini.swatch = {
  removeBgColorWhenBgImgLoaded: function() {
    var $targets = $('.js-color-swatch-label');

    $targets.each(function() {
      var _target = $(this)
        , bgImgUrl = _target.css('background-image')
        ;

      if (bgImgUrl && bgImgUrl.length && bgImgUrl !== 'none') {
        _target.imagesLoaded( { background: true } ).done( function() {
          _target.css('backgroundColor', 'transparent');
        } );
      }
    });
  }
}

gemini.magnificPopup = {
  init: function() {
    this.sizeGuidePopupInit();
    this.productGalleryPopupInit();
    this.quickViewInit();
  },

  sizeGuidePopupInit: function() {
    var $sizeGuidePopup = $('.js-size-guide-popup');

    $sizeGuidePopup.magnificPopup({
      type: 'image',
      closeOnContentClick: true,
      closeBtnInside: false,
      mainClass: 'mfp-no-margins mfp-with-zoom',
      image: {
        verticalFit: true
      },
      zoom: {
        enabled: true,
        duration: 350 // remember to change transition duration in styles/vendor/magnific-custom/magnific-with-zoom.css
      }
    });
  },

  productGalleryPopupInit: function() {
    var $gallerySlider = $('.js-gallery-slider-popup')
      , $productGallery
      , _options = {
        closeBtnInside: false,
        items: [],
        gallery: {
          enabled: true
        }
      }
      ;

    if ($gallerySlider.length > 0) {
      if (
        $gallerySlider.hasClass('gallery-slider--single')
        || $gallerySlider.hasClass('gallery-slider--center')
      ) {
        $productGallery = $('.js-product-slider');
      } else {
        $productGallery = $('.js-slider-for');
      }
    }

    if ($productGallery) {
      $productGallery.find('img').each(function() {
        var _imgSrc = $(this).attr('src');

        _options.items.push(
          {
            type: 'image',
            src: _imgSrc
          }
        )
      });

      if ($gallerySlider.hasClass('gallery-slider--center')) {
        $productGallery.find('.slick-center').magnificPopup(_options);
      } else {
        $productGallery.find('.slick-slide').magnificPopup(_options);
      }
    }
  },

  quickViewInit: function() {
    var $quickViewBtn = $('.js-quick-view');

    $quickViewBtn.on('click', function() {
      var prodUrl = $(this).data('link');

      $.ajax({
        beforeSend: function() {
          slate.helper.showLoading();
        },
        url: prodUrl
      })
      .done(function(data) {
        $.magnificPopup.open({
          items: {
            type: 'inline',
            src: '<div class="mfp-quick-view">' + data + '</div>'
          },
          overflowY: 'auto',
          closeBtnInside: true,
          removalDelay: 300,
          mainClass: 'mfp-with-animation mfp-wrap--size'
        });

        // re-run needed scripts
        slate.cart.registerEvent();
        slate.carousel.productSlideshow();
        gemini.swatch.removeBgColorWhenBgImgLoaded();
        gemini.ajaxifyCart.init();
      })
      .fail(function(error) {
        var responseJSON = JSON.parse(error.responseText);

        slate.alert.error('<b>' + responseJSON.message + ':</b> ' + responseJSON.description);
      })
      .always(function() {
        slate.helper.hideLoading();
      });
    });
  }
}

gemini.zoom = {
  init: function() {
    this.productImageZoomInit();
  },

  productImageZoomInit: function() {
    var $gallerySlider = $('.js-gallery-slider-zoom')
      , $productGallery
      ;

    if ($gallerySlider.length > 0) {
      if (
        $gallerySlider.hasClass('gallery-slider--single')
        || $gallerySlider.hasClass('gallery-slider--center')
      ) {
        $productGallery = $('.js-product-slider');
      } else {
        $productGallery = $('.js-slider-for');
      }
    }

    if ($productGallery) {
      $productGallery.find('.product-gallery__item').each(function() {
        var _self = $(this)
          , _imgSrc = _self.find('img').attr('src')
          ;

        _self.zoom({url: _imgSrc});
      });
    }
  }
}

gemini.ajaxifyCart = {
  selectors: {
    originalSeletor: '[data-product-select]',
    actionWrapper: '.js-action-wrapper',
    addToCartBtn: '.js-gemini-add-to-cart',
    inputQuantity: '.js-input-quantity'
  },

  config: {
    shopifyAjaxCartUrl: '/cart.js',
    shopifyAjaxAddUrl: '/cart/add.js'
  },

  init: function() {
    this.$addToCartForm = $('form[action="/cart/add"]');

    this.addToCartHandle();
    this.registerEventRemoveFeedback();
  },

  addToCartHandle: function() {
    var self = this;

    var $addToCartBtn = $(self.selectors.addToCartBtn, self.$addToCartForm);

    $addToCartBtn.on('click', function(evt) {
      var $inputQuantity = $(self.selectors.inputQuantity, self.$addToCartForm)
        , $originalSelector = $(self.selectors.originalSeletor, self.$addToCartForm)
        , qty = $inputQuantity.val()
        , variantId = $originalSelector.val()
        ;

      evt.preventDefault();

      // add class to show loading btn
      $addToCartBtn.addClass('btn--adding');
      self
        .addItem(variantId, qty)
        .done(function() {
          self.showMessage(false);
          // Update cart
          slate.cart.updateCart();
        })
        .fail(function(error) {
          var responseJSON = JSON.parse(error.responseText);

          self
            .showMessage(true, responseJSON.message, responseJSON.description);
        })
        .always(function() {
          if ($addToCartBtn.hasClass('btn--adding')) {
            $addToCartBtn.removeClass('btn--adding');
          }
        });
    });
  },

  addItem: function(variantId, quantity, properties) {
    var self = this;

    return $.post(self.config.shopifyAjaxAddUrl, {
      id: variantId,
      quantity: quantity,
      properties: properties
    }, null, 'json');
  },

  showMessage: function(isFail, responseMsg, responseDesc) {
    var self = this
      , $actionWrapper = $(self.selectors.actionWrapper, self.$addToCartForm);

    $actionWrapper
      .append(self.getMessage(isFail, responseMsg, responseDesc));
  },

  getMessage: function(isFail, responseMsg, responseDesc) {
    var html = '';

    // If message about all item of a variant is added
    // modify message a bit for readable purpose.
    if (responseDesc && responseDesc.slice(0,4) === 'All ') {
      responseDesc = responseDesc.replace('All 1 ', 'All ');
    }

    if (isFail) {
      html += '<div class="add-to-cart-feedback add-to-cart-feedback--error">';
      html += '<strong>';
      html += (responseMsg || '');
      html += ':</strong> ';
      html += (responseDesc || '');
    } else {
      html += '<div class="add-to-cart-feedback add-to-cart-feedback--success">';
      html += theme.strings.addedToCart;
      html += '! <a href="/cart">';
      html += theme.strings.viewCart;
      html += '</a> or';
      html += ' <a href="/collections/all">';
      html += theme.strings.continueShopping;
      html += '</a>';
    }
    html += '</div>';

    return html;
  },

  registerEventRemoveFeedback: function() {
    $(document).on('click', function() {
      $(this)
        .find('.add-to-cart-feedback')
        .remove();
    });
  }
}

slate.homepageHero = {
  init: function() {
    this.makeHeroResponsive();
  },

  makeHeroResponsive: function() {
    var _self = this
      , $window = $(window)
      , screenWidth = $window.width()
      , $hero = $('.js-hero-responsive')
      , isFullHeightEnable = $hero.data('fullHeight')
      ;

    if (!isFullHeightEnable) {
      _self.toggleClassFullHeight($hero, screenWidth);

      $window.on('resize', function() {
        var _screenW = $window.width();

        _self.toggleClassFullHeight($hero, _screenW);
      });
    }
  },

  makeHeroFullHeight: function($slideshow) {
    if ($slideshow.hasClass('hero--full-height')) {
      var height = $(window).height();
      var offsetTop = $slideshow.offset().top;

      if ($slideshow.offset().top < height) {
        height = height - offsetTop;
      }
      $slideshow.css('height', height);
    }
  },

  toggleClassFullHeight: function($slider, screenWidth) {
    var _self = this;

    if ($slider.length) {
      if (screenWidth <= 749) {
        if (!$slider.hasClass('hero--full-height')) {
          $slider.addClass('hero--full-height');

          _self.makeHeroFullHeight($slider);
        }
      } else {
        var isFullHeightEnabled = $slider.data('fullHeight') == 'true';

        if (!isFullHeightEnabled && $slider.hasClass('hero--full-height')) {
          $slider.removeClass('hero--full-height');
          $slider.css('height', 'auto');
        }
      }
    }
  }
}

gemini.wishlist = {
  /**
   * Render html from object product which is retrieved via Shopify.getProduct()
   *
   * @param {obj} product
   */
  renderWishlistProduct: function(product) {
    var html = ''
      , helperList = [
        'getProdImgHtml',
        'getProdNameHtml',
        'getProdPriceHtml',
        'getProdStatusHtml',
        'getAddBtnHtml',
        'getRemoveBtnHtml',
      ]
      ;

    for (var ind = 0, length = helperList.length; ind < length; ind++) {
      html = this.htmlConcat(html, helperList[ind], product);
    }

    $('#wishlist-product').append('<li>' + html + '</li>');
  },

  /**
   * Call helper functions to get patial html
   *
   * @param {string} htmlStr
   * @param {function} helper
   * @param {obj} product
   *
   * @return {string} htmlStr
   */
  htmlConcat: function(htmlStr, helper, product) {
    helper = this[helper].bind(gemini.wishlist); //  to correct this in helper.

    return this.isFunction(helper)
      ? htmlStr += helper(product)
      : htmlStr;
  },

  /**
   * Check if an object is a function
   *
   * @param {obj} objToCheck
   *
   * @return {boolean}
   */
  isFunction: function(objToCheck) {
    return objToCheck && {}.toString.call(objToCheck) === '[object Function]';
  },

  /**
   * Get html for product-img column
   *
   * @param {obj} product
   *
   * @return {string} html string
   */
  getProdImgHtml: function(product) {
    return '<div class="product-img"><a href="' + product.url + '"><img src="' + product.featured_image + '" alt="' + product.title + '"></a></div>';
  },

  /**
   * Get html for product-name column
   *
   * @param {obj} product
   *
   * @return {string} html string
   */
  getProdNameHtml: function(product) {
    return '<div class="product-name"><a href="' + product.url + '">' + product.title + '</a></div>';
  },

  /**
   * Get html for product-price column
   *
   * @param {obj} product
   *
   * @return {string} html string
   */
  getProdPriceHtml: function(product) {
    var result = '';

    if (product.price_varies) {
      result += '<div class="product-price">' + theme.strings.from + '&nbsp;<span class="product-price--current">' + Shopify.convertWithCurrency(product.price_min) + '</span></div>';
    } else if (product.compare_at_price) {
      var firstAvailVariant = this.getFirstAvailableVariant(product);

      if (firstAvailVariant) {
        result += '<div class="product-price"><span class="product-price--current">' + Shopify.convertWithCurrency(firstAvailVariant.price) + '</span><s class="product-price--origin">' + Shopify.convertWithCurrency(firstAvailVariant.compare_at_price) + '</s></div>';
      }
    } else {
      result += '<div class="product-price"><span class="money">' + Shopify.convertWithCurrency(product.price) + '</span></div>';
    }

    return result;
  },

  /**
   * Get html for product-status column
   *
   * @param {obj} product
   *
   * @return {string} html string
   */
  getProdStatusHtml: function(product) {
    return product.available
      ? '<div class="product-status"><span class="instock">' + theme.strings.instock + '</span></div>'
      : '<div class="product-status"><span class="outofstock">' + theme.strings.outofstock + '</span></div>';
  },

  /**
   * Get html for action button column
   *
   * @param {obj} product
   *
   * @return {string} html string
   */
  getAddBtnHtml: function(product) {
    var result = '';

    if (!product.available) {
      result += '<div class="product-add"><button class="js-add-to-cart btn" disabled>' + theme.strings.outofstock + '</button></div>';
    } else {
      if (product.variants.length > 1) {
        result += '<div class="product-add"><a href="' + product.url + '" class="btn btn--outline">' + theme.strings.selectOption + '</a></div>';
      } else {
        result += '<div class="product-add"><button class="js-add-to-cart btn" data-variant-id="' + product.variants[0].id + '"><span class="add">' + theme.strings.addToCart + '</span><span class="adding"><i class="fa fa-spinner"></i></span><span class="added">' + theme.strings.addedToCartShort + '</span></button></div>';
      }
    }

    return result;
  },

  /**
   * Get html for remove button column
   *
   * @param {obj} product
   *
   * @return {string} html string
   */
  getRemoveBtnHtml: function(product) {
    return '<div class="product-remove"><a class="wishlist-remove js-wishlist-remove" data-product-handle="' + product.handle + '"><i class="fa fa-close"></i></button></div>';
  },

  /**
   * Get the first available variant of product
   *
   * @param {obj} product
   *
   * @return {obj} variant
   */
  getFirstAvailableVariant: function(product) {
    if (product.available) {
      var variants = product.variants;

      for (var i = 0, length = variants.length; i < length; i++) {
        if (variants[i].available) {
          return variants[i];
        }
      }
    }

    return false;
  }
};


gemini.interactiveGroup = {
  init: function() {
    this.responsiveInteractiveGroup();
  },

  responsiveInteractiveGroup: function() {
    $(window).on('resize', function() {
      var screenWidth = $(this).width();

      if (screenWidth <= 1024) {
        var $interactiveGroup = $('.interactive-group');

        if ($interactiveGroup.hasClass('interactive-group--vertical')) {
          $interactiveGroup
            .removeClass('interactive-group--vertical')
            .addClass('interactive-group--horizontal changed');
        }
      } else {
        var $interactiveGroup = $('.interactive-group');

        if (
          $interactiveGroup.hasClass('interactive-group--horizontal')
          && $interactiveGroup.hasClass('changed')
        ) {
          $interactiveGroup
            .removeClass('interactive-group--horizontal changed')
            .addClass('interactive-group--vertical');
        }
      }
    });
  }
}

gemini.scrollbar = {
  init: function() {
    this.headerSidebarScrollbarInit();
  },

  headerSidebarScrollbarInit: function() {
    var $headerSidebar = $('.js-sidebar-header');

    if ($headerSidebar.length > 0) {
      $headerSidebar.perfectScrollbar();
    }
  }
}

gemini.viewSwitcher = {
  init: function() {
    this.viewSwitcherInit();
  },

  viewSwitcherInit: function() {
    var $viewSwitcher = $('.js-view-switcher');

    if ($viewSwitcher.length) {
      $viewSwitcher.find('.view-switcher__item').on('click', function(evt) {
        evt.preventDefault();

        var viewType = $(this).data('type');
        var currentHref = location.href;

        if (currentHref.indexOf('?') !== -1) {
          if (currentHref.search('[?|&]view=') > -1) {
            location.href = currentHref.replace(/([?|&]view=)(grid|list)/, '$1' + viewType);
          } else {
            location.href = currentHref + '&view=' + viewType;
          }
        } else {
          location.href = currentHref + '?view=' + viewType;
        }
      });
    }
  }
}

gemini.googleMap = {
  config: {
    gmapSelectors: [
      '.js-gmap-contact',
      '.js-gmap-footer'
    ]
  },

  init: function() {
    this.mapInit();
  },

  mapInit: function() {
    $.each(this.config.gmapSelectors, function(key, gmapSelector) {
      var $gmapWrapper = $(gmapSelector);

      if ($gmapWrapper.length) {
        var _opts = this.getOptions($gmapWrapper) || {};
        var mapHeight = $gmapWrapper.data('height');
        var markerDisabled = $gmapWrapper.data('markerDisable');

        if (mapHeight > 0) {
          $gmapWrapper.css('height', mapHeight);
        }

        if (markerDisabled) {
          $gmapWrapper.gmap3(_opts);
        } else {
          $gmapWrapper
            .gmap3(_opts)
            .marker(function(map) {
              return {
                position: map.getCenter()
              }
            });
        }
      }
    }.bind(this));
  },

  getOptions: function($map) {
    var address = $map.data('address');
    var lat = $map.data('lat');
    var lng = $map.data('lng');
    var zoomLevel = $map.data('zoomLevel');
    var mapType = $map.data('mapType');
    var mapStyle = $map.data('mapStyle');
    var zoomControlDisabled = $map.data('zoomControlDisable');
    var streetViewControlDisabled = $map.data('streetViewControlDisable');
    var draggableControlDisabled = $map.data('draggableControlDisable');
    var doubleClickZoomControlDisabled = $map.data('doubleClickZoomControlDisable');
    var scrollwheelZoomControlDisabled = $map.data('scrollwheelZoomControlDisable');
    var mapTypeControlDisabled = $map.data('mapTypeControlDisable');

    var result = {};

    // Required options (address/center and zoom)
    if (address) {
      result.address = address;
    } else {
      result.center = {
        lat: lat ? parseFloat(lat) : 0,
        lng: lng ? parseFloat(lng) : 0
      }
    }

    result.zoom = zoomLevel ? parseInt(zoomLevel) : 14;

    // Optional options
    // map type
    result.mapTypeId = mapType || 'roadmap';

    // map custom style
    if (mapStyle) {
      result.styles = mapStyle;
    }

    // control settings
    if (zoomControlDisabled) {
      result.zoomControl = false;
    }

    if (streetViewControlDisabled) {
      result.streetViewControl = false;
    }

    if (draggableControlDisabled) {
      result.draggable = false;
    }

    if (doubleClickZoomControlDisabled) {
      result.disableDoubleClickZoom = true;
    }

    if (scrollwheelZoomControlDisabled) {
      result.scrollwheel = false;
    }

    if (mapTypeControlDisabled) {
      result.mapTypeControl = false;
    } else {
      result.mapTypeControl = true;
      result.mapTypeControlOptions = {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      }
    }

    return result;
  }
}

gemini.ajaxifyNewsletter = {
  init: function() {
    this.newsletterPopupAjaxInit();
  },

  newsletterPopupAjaxInit: function() {
    var _ajaxifyNewsletter = this;

    $(document).on('submit', '.js-newsletter-form', function(evt) {
      try {
        var $newsletterForm = $(this);

        evt.preventDefault();

        _ajaxifyNewsletter.ajaxSubmit($newsletterForm);
      }
      catch (error) {
        console.log(error);
      }
    });
  },

  ajaxSubmit: function($form) {
    var _url = $form.attr('action');
    var _formData = $form.serialize();

    if (_url && _url !== '') {
      // change from 'post' to 'post-json' to submit json data
      // add &c=? to prevent cross origin domain issues
      _url = _url.replace(/post\?/, 'post-json?').concat('&c=?');
    }

    $.ajax({
      type: 'POST',
      url: _url,
      data: _formData,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      cache: false
    })
    .done(function(response) {
      var respMsg = response.msg;
      var respStatus = response.result; // either 'success' or 'error'
      var $response = $form.find('.js-newsletter-response');
      var $input = $form.find('.js-newsletter-input');

      if (respMsg.indexOf('0 - ') === 0) {
        respMsg = respMsg.replace('0 - ', '');
      }

      if ($response.length) {
        $response
          .html(respMsg)
          .removeClass('error success')
          .addClass(respStatus);
      }

      if ($input.length) {
        if (respStatus === 'error') {
          $input
            .removeClass('error')
            .addClass('error');
        } else {
          $input.removeClass('error');
        }
      }
    })
    .fail(function(error) {
      var $response = $form.find('.js-newsletter-response');

      if ($response.length) {
        $response
          .html(theme.strings.newsletterProblem)
          .removeClass('error success')
          .addClass('error');
      }
    })
    .always(function() {});
  }
}


$(document)
  .on('shopify:section:load', function() {
    slate.homepageHero.init();
    slate.carousel.collectionSlideshow();
    slate.carousel.homepageSlideshow();
    slate.carousel.init();
    slate.carousel.productSlideshow();
    slate.carousel.relatedProductSlideshow();
    slate.header.menuArrange();

    gemini.collectionGrid.init();
    gemini.swatch.removeBgColorWhenBgImgLoaded();
    gemini.magnificPopup.init();
    gemini.zoom.init();
    gemini.interactiveGroup.init();
    gemini.scrollbar.init();
    gemini.viewSwitcher.init();
    gemini.googleMap.init();
  })
  .on('shopify:section:unload', function() {
    slate.homepageHero.init();
    slate.carousel.collectionSlideshow();
    slate.carousel.homepageSlideshow();
    slate.carousel.init();
    slate.carousel.productSlideshow();
    slate.carousel.relatedProductSlideshow();
    slate.header.menuArrange();

    gemini.collectionGrid.init();
    gemini.swatch.removeBgColorWhenBgImgLoaded();
    gemini.magnificPopup.init();
    gemini.zoom.init();
    gemini.interactiveGroup.init();
    gemini.scrollbar.init();
    gemini.viewSwitcher.init();
    gemini.googleMap.init();
  })
  .on('shopify:section:select', function() {
    slate.homepageHero.init();
    slate.carousel.collectionSlideshow();
    slate.carousel.homepageSlideshow();
    slate.carousel.init();
    slate.carousel.productSlideshow();
    slate.carousel.relatedProductSlideshow();
    slate.header.menuArrange();

    gemini.collectionGrid.init();
    gemini.swatch.removeBgColorWhenBgImgLoaded();
    gemini.magnificPopup.init();
    gemini.zoom.init();
    gemini.interactiveGroup.init();
    gemini.scrollbar.init();
    gemini.viewSwitcher.init();
    gemini.googleMap.init();
  })
  .on('shopify:section:deselect', function() {
    slate.homepageHero.init();
    slate.carousel.collectionSlideshow();
    slate.carousel.homepageSlideshow();
    slate.carousel.init();
    slate.carousel.productSlideshow();
    slate.carousel.relatedProductSlideshow();
    slate.header.menuArrange();

    gemini.collectionGrid.init();
    gemini.swatch.removeBgColorWhenBgImgLoaded();
    gemini.magnificPopup.init();
    gemini.zoom.init();
    gemini.interactiveGroup.init();
    gemini.scrollbar.init();
    gemini.viewSwitcher.init();
    gemini.googleMap.init();
  })
  .on('shopify:block:select', function() {
    slate.homepageHero.init();
    slate.carousel.collectionSlideshow();
    slate.carousel.homepageSlideshow();
    slate.carousel.init();
    slate.carousel.productSlideshow();
    slate.carousel.relatedProductSlideshow();
    slate.header.menuArrange();

    gemini.collectionGrid.init();
    gemini.swatch.removeBgColorWhenBgImgLoaded();
    gemini.magnificPopup.init();
    gemini.zoom.init();
    gemini.interactiveGroup.init();
    gemini.scrollbar.init();
    gemini.viewSwitcher.init();
    gemini.googleMap.init();
  })
  .on('shopify:block:deselect', function() {
    slate.homepageHero.init();
    slate.carousel.collectionSlideshow();
    slate.carousel.homepageSlideshow();
    slate.carousel.init();
    slate.carousel.productSlideshow();
    slate.carousel.relatedProductSlideshow();
    slate.header.menuArrange();

    gemini.collectionGrid.init();
    gemini.swatch.removeBgColorWhenBgImgLoaded();
    gemini.magnificPopup.init();
    gemini.zoom.init();
    gemini.interactiveGroup.init();
    gemini.scrollbar.init();
    gemini.viewSwitcher.init();
    gemini.googleMap.init();
  })
  .on('gemini:filterable', function() {
    // Re-check in wishlist
    slate.wishlist.checkInWishlist();

    gemini.collectionGrid.init();
    gemini.swatch.removeBgColorWhenBgImgLoaded();
    gemini.viewSwitcher.init();
  })
  .on('gemini:cartUpdated', function() {
    // re-bind handler after change HTML of
    // slide-right minicart when run function
    // slate.cart.updateCart()
    // @see scripts/slate/cart.js
    $('.mini-cart__close').on('click', function() {
      $.sidr('close', 'cart-drawer');
    });

    $('#cart-drawer').on('click', function(e) {
      e.stopPropagation();
    });

    $(document).on('click', function() {
      $.sidr('close', 'cart-drawer');
    });
  });

$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('product', theme.Product);
  sections.register('instafeed', theme.Instafeed);
  sections.register('collectionList', theme.CollectionList);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Wrap videos in div to force responsive layout.
  slate.carousel.initHero();
  slate.rte.wrapTable();
  slate.rte.iframeReset();
  slate.search.init();
  slate.header.init();
  slate.backToTop.init();
  slate.carousel.init();
  slate.cart.init();
  slate.cart.registerEvent();
  slate.filter.init();
  slate.homepageHero.init();
  slate.carousel.homepageSlideshow();
  slate.carousel.collectionSlideshow();
  slate.carousel.productSlideshow();
  slate.carousel.relatedProductSlideshow();
  slate.wishlist.init();
  slate.alert.init();

  $( window ).resize(function() {
    slate.header.menuArrange();
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

  // Init masonry grid
  gemini.collectionGrid.init();

  // Run swatch js
  gemini.swatch.removeBgColorWhenBgImgLoaded();

  // Init magnific popup, including quickView
  gemini.magnificPopup.init();

  // Init zoom
  gemini.zoom.init();

  // Product detail and quick view Ajax add to cart
  gemini.ajaxifyCart.init();

  // Responsive interactive group in each product item
  gemini.interactiveGroup.init();

  // Call perfect-scrollbar to display fancy scrollbar on header05
  gemini.scrollbar.init();

  // Init view switcher in collection page
  gemini.viewSwitcher.init();

  // Init google map on contact page
  gemini.googleMap.init();

  // Init Ajax function for Newsletter Popup
  gemini.ajaxifyNewsletter.init();
});
