import type { Attribute, Schema } from '@strapi/strapi';

export interface OrderAddress extends Schema.Component {
  collectionName: 'components_order_addresses';
  info: {
    description: 'Shipping and billing address information';
    displayName: 'Address';
  };
  attributes: {
    addressLine1: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    addressLine2: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    city: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    company: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    country: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Attribute.DefaultTo<'India'>;
    firstName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    lastName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    phone: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    postalCode: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    state: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

export interface OrderOrderItem extends Schema.Component {
  collectionName: 'components_order_order_items';
  info: {
    description: 'Individual items within an order';
    displayName: 'Order Item';
  };
  attributes: {
    customization: Attribute.JSON;
    designData: Attribute.JSON;
    mockupUrl: Attribute.String;
    product: Attribute.Relation<
      'order.order-item',
      'oneToOne',
      'api::product.product'
    >;
    productImage: Attribute.String;
    productName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    productSku: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    quantity: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    totalPrice: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    unitPrice: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    variantColor: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    variantSize: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
  };
}

export interface ProductDimensions extends Schema.Component {
  collectionName: 'components_product_dimensions';
  info: {
    description: 'Physical dimensions of the product';
    displayName: 'Product Dimensions';
  };
  attributes: {
    height: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    length: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    unit: Attribute.Enumeration<['cm', 'inches']> & Attribute.DefaultTo<'cm'>;
    width: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface ProductInventory extends Schema.Component {
  collectionName: 'components_product_inventory';
  info: {
    description: 'Inventory tracking and stock management';
    displayName: 'Product Inventory';
  };
  attributes: {
    allowBackorders: Attribute.Boolean & Attribute.DefaultTo<false>;
    availableStock: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    lowStockThreshold: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<10>;
    reservedStock: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    stockStatus: Attribute.Enumeration<
      ['in_stock', 'out_of_stock', 'low_stock']
    > &
      Attribute.DefaultTo<'in_stock'>;
    totalStock: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    trackQuantity: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface ProductSustainability extends Schema.Component {
  collectionName: 'components_product_sustainability';
  info: {
    description: 'Sustainability and eco-friendly information';
    displayName: 'Product Sustainability';
  };
  attributes: {
    carbonFootprint: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    certifications: Attribute.JSON;
    fairTrade: Attribute.Boolean & Attribute.DefaultTo<false>;
    isEcoFriendly: Attribute.Boolean & Attribute.DefaultTo<false>;
    manufacturingLocation: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    materials: Attribute.JSON;
    recycledContent: Attribute.Integer &
      Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
  };
}

export interface ProductVariant extends Schema.Component {
  collectionName: 'components_product_variants';
  info: {
    description: 'Product size, color, and inventory variants';
    displayName: 'Product Variant';
  };
  attributes: {
    color: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    colorHex: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 7;
      }>;
    image: Attribute.Media<'images'>;
    isActive: Attribute.Boolean & Attribute.DefaultTo<true>;
    lowStockThreshold: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<5>;
    price: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    size: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    sku: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    stock: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    weight: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface SubscriptionPreferences extends Schema.Component {
  collectionName: 'components_subscription_preferences';
  info: {
    description: 'Customer preferences for subscription boxes';
    displayName: 'Subscription Preferences';
  };
  attributes: {
    allergens: Attribute.JSON;
    categories: Attribute.JSON;
    colors: Attribute.JSON;
    excludeCategories: Attribute.JSON;
    priceRange: Attribute.JSON;
    sizes: Attribute.JSON;
    specialInstructions: Attribute.Text;
    stylePreference: Attribute.Enumeration<
      ['streetwear', 'casual', 'minimalist', 'bold', 'vintage']
    > &
      Attribute.DefaultTo<'streetwear'>;
  };
}

export interface UserAddress extends Schema.Component {
  collectionName: 'components_user_addresses';
  info: {
    description: 'User saved addresses for shipping and billing';
    displayName: 'User Address';
  };
  attributes: {
    addressLine1: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    addressLine2: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    city: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    company: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    country: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Attribute.DefaultTo<'India'>;
    firstName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    isDefault: Attribute.Boolean & Attribute.DefaultTo<false>;
    lastName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    phone: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    postalCode: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    state: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    type: Attribute.Enumeration<['shipping', 'billing', 'both']> &
      Attribute.DefaultTo<'both'>;
  };
}

export interface UserAffiliateProfile extends Schema.Component {
  collectionName: 'components_user_affiliate_profiles';
  info: {
    description: 'Affiliate and influencer profile information';
    displayName: 'Affiliate Profile';
  };
  attributes: {
    approvedAt: Attribute.DateTime;
    bankDetails: Attribute.JSON;
    commissionRate: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          max: 1;
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0.05>;
    followersCount: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    isActive: Attribute.Boolean & Attribute.DefaultTo<false>;
    lastPayoutAt: Attribute.DateTime;
    pendingEarnings: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    platform: Attribute.Enumeration<
      ['instagram', 'youtube', 'tiktok', 'twitter', 'facebook', 'other']
    >;
    socialMediaHandle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    totalClicks: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    totalConversions: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    totalEarnings: Attribute.Decimal &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    trackingCode: Attribute.String &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
  };
}

export interface UserNotificationSettings extends Schema.Component {
  collectionName: 'components_user_notification_settings';
  info: {
    description: 'User notification preferences';
    displayName: 'Notification Settings';
  };
  attributes: {
    emailNotifications: Attribute.Boolean & Attribute.DefaultTo<true>;
    loyaltyUpdates: Attribute.Boolean & Attribute.DefaultTo<true>;
    marketingEmails: Attribute.Boolean & Attribute.DefaultTo<false>;
    newProductNotifications: Attribute.Boolean & Attribute.DefaultTo<false>;
    orderUpdates: Attribute.Boolean & Attribute.DefaultTo<true>;
    priceDropNotifications: Attribute.Boolean & Attribute.DefaultTo<true>;
    pushNotifications: Attribute.Boolean & Attribute.DefaultTo<true>;
    smsNotifications: Attribute.Boolean & Attribute.DefaultTo<false>;
    stockNotifications: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'order.address': OrderAddress;
      'order.order-item': OrderOrderItem;
      'product.dimensions': ProductDimensions;
      'product.inventory': ProductInventory;
      'product.sustainability': ProductSustainability;
      'product.variant': ProductVariant;
      'subscription.preferences': SubscriptionPreferences;
      'user.address': UserAddress;
      'user.affiliate-profile': UserAffiliateProfile;
      'user.notification-settings': UserNotificationSettings;
    }
  }
}
