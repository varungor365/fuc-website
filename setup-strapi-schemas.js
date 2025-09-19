const fs = require('fs');
const path = require('path');

// Content type schemas
const schemas = {
  // Product schema
  product: {
    kind: 'collectionType',
    collectionName: 'products',
    info: {
      singularName: 'product',
      pluralName: 'products',
      displayName: 'Product',
      description: 'E-commerce product'
    },
    options: {
      draftAndPublish: true,
    },
    pluginOptions: {},
    attributes: {
      name: {
        type: 'string',
        required: true,
        maxLength: 255
      },
      description: {
        type: 'richtext'
      },
      price: {
        type: 'decimal',
        required: true,
        min: 0
      },
      originalPrice: {
        type: 'decimal',
        min: 0
      },
      images: {
        type: 'media',
        multiple: true,
        required: false,
        allowedTypes: ['images']
      },
      category: {
        type: 'relation',
        relation: 'manyToOne',
        target: 'api::category.category',
        inversedBy: 'products'
      },
      sizes: {
        type: 'json',
        default: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      },
      colors: {
        type: 'json',
        default: ['Black', 'White', 'Navy', 'Grey']
      },
      stock: {
        type: 'integer',
        required: true,
        default: 0,
        min: 0
      },
      sku: {
        type: 'string',
        required: true,
        unique: true
      },
      tags: {
        type: 'json',
        default: []
      },
      featured: {
        type: 'boolean',
        default: false
      },
      isNew: {
        type: 'boolean',
        default: true
      },
      rating: {
        type: 'decimal',
        default: 0,
        min: 0,
        max: 5
      },
      reviewCount: {
        type: 'integer',
        default: 0,
        min: 0
      },
      seoTitle: {
        type: 'string',
        maxLength: 60
      },
      seoDescription: {
        type: 'string',
        maxLength: 160
      },
      slug: {
        type: 'uid',
        targetField: 'name',
        required: true
      }
    }
  },

  // Category schema
  category: {
    kind: 'collectionType',
    collectionName: 'categories',
    info: {
      singularName: 'category',
      pluralName: 'categories',
      displayName: 'Category',
      description: 'Product categories'
    },
    options: {
      draftAndPublish: true,
    },
    pluginOptions: {},
    attributes: {
      name: {
        type: 'string',
        required: true,
        unique: true
      },
      slug: {
        type: 'uid',
        targetField: 'name',
        required: true
      },
      description: {
        type: 'text'
      },
      image: {
        type: 'media',
        multiple: false,
        required: false,
        allowedTypes: ['images']
      },
      productCount: {
        type: 'integer',
        default: 0,
        min: 0
      },
      featured: {
        type: 'boolean',
        default: false
      },
      products: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::product.product',
        mappedBy: 'category'
      }
    }
  },

  // Order schema
  order: {
    kind: 'collectionType',
    collectionName: 'orders',
    info: {
      singularName: 'order',
      pluralName: 'orders',
      displayName: 'Order',
      description: 'Customer orders'
    },
    options: {
      draftAndPublish: false,
    },
    pluginOptions: {},
    attributes: {
      items: {
        type: 'json',
        required: true
      },
      total: {
        type: 'decimal',
        required: true,
        min: 0
      },
      subtotal: {
        type: 'decimal',
        required: true,
        min: 0
      },
      tax: {
        type: 'decimal',
        default: 0,
        min: 0
      },
      shipping: {
        type: 'decimal',
        default: 0,
        min: 0
      },
      status: {
        type: 'enumeration',
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        required: true
      },
      customerEmail: {
        type: 'email',
        required: true
      },
      shippingAddress: {
        type: 'json',
        required: true
      },
      billingAddress: {
        type: 'json',
        required: true
      },
      trackingNumber: {
        type: 'string'
      },
      notes: {
        type: 'text'
      },
      customer: {
        type: 'relation',
        relation: 'manyToOne',
        target: 'api::customer.customer',
        inversedBy: 'orders'
      }
    }
  },

  // Customer schema
  customer: {
    kind: 'collectionType',
    collectionName: 'customers',
    info: {
      singularName: 'customer',
      pluralName: 'customers',
      displayName: 'Customer',
      description: 'Customer profiles'
    },
    options: {
      draftAndPublish: false,
    },
    pluginOptions: {},
    attributes: {
      email: {
        type: 'email',
        required: true,
        unique: true
      },
      firstName: {
        type: 'string',
        required: true
      },
      lastName: {
        type: 'string',
        required: true
      },
      phone: {
        type: 'string'
      },
      dateOfBirth: {
        type: 'date'
      },
      addresses: {
        type: 'json',
        default: []
      },
      orders: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::order.order',
        mappedBy: 'customer'
      },
      totalSpent: {
        type: 'decimal',
        default: 0,
        min: 0
      },
      orderCount: {
        type: 'integer',
        default: 0,
        min: 0
      },
      lastOrderDate: {
        type: 'datetime'
      },
      isVip: {
        type: 'boolean',
        default: false
      }
    }
  }
};

// Function to create directories and files
function createContentTypeFile(name, schema) {
  const dir = path.join(__dirname, 'fashun-cms-new', 'src', 'api', name, 'content-types', name);
  
  // Create directory structure
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write schema file
  const schemaPath = path.join(dir, 'schema.json');
  fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
  
  console.log(`✅ Created content type: ${name}`);
}

// Create all content types
console.log('🚀 Setting up Strapi content types...');

Object.entries(schemas).forEach(([name, schema]) => {
  createContentTypeFile(name, schema);
});

console.log('✅ All content types created successfully!');
console.log('📝 Next steps:');
console.log('1. Restart Strapi server to register content types');
console.log('2. Visit http://localhost:1337/admin to complete setup');
console.log('3. Create your admin account');
console.log('4. Configure API permissions');
console.log('5. Import sample data');
