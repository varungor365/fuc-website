/**
 * Database Migration Management
 * Handles database schema migrations and version control
 */

import { env } from './environment';

interface Migration {
  id: string;
  version: number;
  name: string;
  description: string;
  up: string;
  down: string;
  checksum: string;
  createdAt: Date;
  executedAt?: Date;
}

interface MigrationResult {
  success: boolean;
  migration: Migration;
  error?: string;
  duration: number;
}

class DatabaseMigrationManager {
  private static instance: DatabaseMigrationManager;
  private migrations: Migration[] = [];
  private connectionString: string;

  private constructor() {
    this.connectionString = env.get('DATABASE_URL');
    this.loadMigrations();
  }

  static getInstance(): DatabaseMigrationManager {
    if (!DatabaseMigrationManager.instance) {
      DatabaseMigrationManager.instance = new DatabaseMigrationManager();
    }
    return DatabaseMigrationManager.instance;
  }

  private loadMigrations(): void {
    // Define database migrations
    this.migrations = [
      {
        id: '001_initial_schema',
        version: 1,
        name: 'Initial Schema',
        description: 'Create initial database schema with users, products, orders tables',
        up: `
          -- Users table
          CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255),
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            phone VARCHAR(20),
            email_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- User profiles
          CREATE TABLE IF NOT EXISTS user_profiles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            avatar_url TEXT,
            date_of_birth DATE,
            gender VARCHAR(20),
            preferences JSONB DEFAULT '{}',
            measurements JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Categories
          CREATE TABLE IF NOT EXISTS categories (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(100) NOT NULL,
            slug VARCHAR(100) UNIQUE NOT NULL,
            description TEXT,
            image_url TEXT,
            parent_id UUID REFERENCES categories(id),
            sort_order INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Products
          CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            short_description TEXT,
            sku VARCHAR(100) UNIQUE NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            compare_price DECIMAL(10,2),
            cost_price DECIMAL(10,2),
            category_id UUID REFERENCES categories(id),
            brand VARCHAR(100),
            images JSONB DEFAULT '[]',
            variants JSONB DEFAULT '[]',
            tags TEXT[],
            metadata JSONB DEFAULT '{}',
            is_active BOOLEAN DEFAULT TRUE,
            featured BOOLEAN DEFAULT FALSE,
            inventory_tracked BOOLEAN DEFAULT TRUE,
            stock_quantity INTEGER DEFAULT 0,
            low_stock_threshold INTEGER DEFAULT 10,
            weight DECIMAL(8,2),
            dimensions JSONB DEFAULT '{}',
            seo_title VARCHAR(255),
            seo_description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Orders
          CREATE TABLE IF NOT EXISTS orders (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            order_number VARCHAR(50) UNIQUE NOT NULL,
            user_id UUID REFERENCES users(id),
            email VARCHAR(255) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            payment_status VARCHAR(50) DEFAULT 'pending',
            fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled',
            subtotal DECIMAL(10,2) NOT NULL,
            tax_amount DECIMAL(10,2) DEFAULT 0,
            shipping_amount DECIMAL(10,2) DEFAULT 0,
            discount_amount DECIMAL(10,2) DEFAULT 0,
            total_amount DECIMAL(10,2) NOT NULL,
            currency VARCHAR(3) DEFAULT 'USD',
            billing_address JSONB NOT NULL,
            shipping_address JSONB,
            notes TEXT,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Order items
          CREATE TABLE IF NOT EXISTS order_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id),
            product_variant_id VARCHAR(100),
            quantity INTEGER NOT NULL,
            unit_price DECIMAL(10,2) NOT NULL,
            total_price DECIMAL(10,2) NOT NULL,
            product_snapshot JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Create indexes
          CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
          CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
          CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
          CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
          CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
          CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
          CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
        `,
        down: `
          DROP TABLE IF EXISTS order_items CASCADE;
          DROP TABLE IF EXISTS orders CASCADE;
          DROP TABLE IF EXISTS products CASCADE;
          DROP TABLE IF EXISTS categories CASCADE;
          DROP TABLE IF EXISTS user_profiles CASCADE;
          DROP TABLE IF EXISTS users CASCADE;
        `,
        checksum: this.generateChecksum('initial_schema'),
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '002_sessions_and_auth',
        version: 2,
        name: 'Sessions and Authentication',
        description: 'Add session management and OAuth tables',
        up: `
          -- Sessions table for NextAuth
          CREATE TABLE IF NOT EXISTS sessions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            session_token VARCHAR(255) UNIQUE NOT NULL,
            expires TIMESTAMP WITH TIME ZONE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Accounts table for OAuth
          CREATE TABLE IF NOT EXISTS accounts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            provider VARCHAR(100) NOT NULL,
            provider_account_id VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            access_token TEXT,
            refresh_token TEXT,
            expires_at BIGINT,
            token_type VARCHAR(100),
            scope TEXT,
            id_token TEXT,
            oauth_token TEXT,
            oauth_token_secret TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(provider, provider_account_id)
          );

          -- Verification tokens
          CREATE TABLE IF NOT EXISTS verification_tokens (
            identifier VARCHAR(255) NOT NULL,
            token VARCHAR(255) UNIQUE NOT NULL,
            expires TIMESTAMP WITH TIME ZONE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            PRIMARY KEY (identifier, token)
          );

          -- Password reset tokens
          CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            token VARCHAR(255) UNIQUE NOT NULL,
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Create indexes
          CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
          CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
          CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);
          CREATE INDEX IF NOT EXISTS idx_password_reset_token ON password_reset_tokens(token);
        `,
        down: `
          DROP TABLE IF EXISTS password_reset_tokens CASCADE;
          DROP TABLE IF EXISTS verification_tokens CASCADE;
          DROP TABLE IF EXISTS accounts CASCADE;
          DROP TABLE IF EXISTS sessions CASCADE;
        `,
        checksum: this.generateChecksum('sessions_and_auth'),
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '003_analytics_and_events',
        version: 3,
        name: 'Analytics and Events',
        description: 'Add analytics tracking and event logging tables',
        up: `
          -- Analytics events
          CREATE TABLE IF NOT EXISTS analytics_events (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id),
            session_id VARCHAR(255),
            event_type VARCHAR(100) NOT NULL,
            event_name VARCHAR(255) NOT NULL,
            properties JSONB DEFAULT '{}',
            user_agent TEXT,
            ip_address INET,
            country VARCHAR(2),
            city VARCHAR(100),
            device_type VARCHAR(50),
            browser VARCHAR(100),
            os VARCHAR(100),
            referrer TEXT,
            utm_source VARCHAR(255),
            utm_medium VARCHAR(255),
            utm_campaign VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Page views
          CREATE TABLE IF NOT EXISTS page_views (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id),
            session_id VARCHAR(255),
            page_url TEXT NOT NULL,
            page_title VARCHAR(255),
            referrer TEXT,
            user_agent TEXT,
            ip_address INET,
            duration INTEGER, -- time spent on page in seconds
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- A/B test experiments
          CREATE TABLE IF NOT EXISTS ab_experiments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            description TEXT,
            variants JSONB NOT NULL,
            traffic_allocation JSONB NOT NULL,
            start_date TIMESTAMP WITH TIME ZONE,
            end_date TIMESTAMP WITH TIME ZONE,
            status VARCHAR(50) DEFAULT 'draft',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- A/B test assignments
          CREATE TABLE IF NOT EXISTS ab_assignments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            experiment_id UUID REFERENCES ab_experiments(id) ON DELETE CASCADE,
            user_id UUID REFERENCES users(id),
            session_id VARCHAR(255),
            variant_id VARCHAR(100) NOT NULL,
            assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Create indexes for analytics
          CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
          CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
          CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
          CREATE INDEX IF NOT EXISTS idx_page_views_user ON page_views(user_id);
          CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);
          CREATE INDEX IF NOT EXISTS idx_ab_assignments_experiment ON ab_assignments(experiment_id);
        `,
        down: `
          DROP TABLE IF EXISTS ab_assignments CASCADE;
          DROP TABLE IF EXISTS ab_experiments CASCADE;
          DROP TABLE IF EXISTS page_views CASCADE;
          DROP TABLE IF EXISTS analytics_events CASCADE;
        `,
        checksum: this.generateChecksum('analytics_and_events'),
        createdAt: new Date('2024-02-01'),
      },
      {
        id: '004_shopping_cart_and_wishlist',
        version: 4,
        name: 'Shopping Cart and Wishlist',
        description: 'Add shopping cart and wishlist functionality',
        up: `
          -- Shopping carts
          CREATE TABLE IF NOT EXISTS shopping_carts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            session_id VARCHAR(255),
            currency VARCHAR(3) DEFAULT 'USD',
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id),
            UNIQUE(session_id)
          );

          -- Cart items
          CREATE TABLE IF NOT EXISTS cart_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            cart_id UUID REFERENCES shopping_carts(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id) ON DELETE CASCADE,
            product_variant_id VARCHAR(100),
            quantity INTEGER NOT NULL CHECK (quantity > 0),
            unit_price DECIMAL(10,2) NOT NULL,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(cart_id, product_id, product_variant_id)
          );

          -- Wishlists
          CREATE TABLE IF NOT EXISTS wishlists (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            name VARCHAR(255) DEFAULT 'My Wishlist',
            description TEXT,
            is_public BOOLEAN DEFAULT FALSE,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Wishlist items
          CREATE TABLE IF NOT EXISTS wishlist_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id) ON DELETE CASCADE,
            product_variant_id VARCHAR(100),
            notes TEXT,
            priority INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(wishlist_id, product_id, product_variant_id)
          );

          -- Create indexes
          CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
          CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items(product_id);
          CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
          CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist ON wishlist_items(wishlist_id);
        `,
        down: `
          DROP TABLE IF EXISTS wishlist_items CASCADE;
          DROP TABLE IF EXISTS wishlists CASCADE;
          DROP TABLE IF EXISTS cart_items CASCADE;
          DROP TABLE IF EXISTS shopping_carts CASCADE;
        `,
        checksum: this.generateChecksum('shopping_cart_and_wishlist'),
        createdAt: new Date('2024-02-15'),
      },
      {
        id: '005_reviews_and_ratings',
        version: 5,
        name: 'Reviews and Ratings',
        description: 'Add product reviews and rating system',
        up: `
          -- Product reviews
          CREATE TABLE IF NOT EXISTS product_reviews (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            product_id UUID REFERENCES products(id) ON DELETE CASCADE,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            order_item_id UUID REFERENCES order_items(id),
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            title VARCHAR(255),
            content TEXT,
            pros TEXT[],
            cons TEXT[],
            verified_purchase BOOLEAN DEFAULT FALSE,
            helpful_count INTEGER DEFAULT 0,
            status VARCHAR(50) DEFAULT 'pending',
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(product_id, user_id, order_item_id)
          );

          -- Review helpfulness votes
          CREATE TABLE IF NOT EXISTS review_votes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            review_id UUID REFERENCES product_reviews(id) ON DELETE CASCADE,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            helpful BOOLEAN NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(review_id, user_id)
          );

          -- Review images
          CREATE TABLE IF NOT EXISTS review_images (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            review_id UUID REFERENCES product_reviews(id) ON DELETE CASCADE,
            image_url TEXT NOT NULL,
            alt_text VARCHAR(255),
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Create indexes
          CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);
          CREATE INDEX IF NOT EXISTS idx_reviews_user ON product_reviews(user_id);
          CREATE INDEX IF NOT EXISTS idx_reviews_rating ON product_reviews(rating);
          CREATE INDEX IF NOT EXISTS idx_reviews_status ON product_reviews(status);
          CREATE INDEX IF NOT EXISTS idx_review_votes_review ON review_votes(review_id);
        `,
        down: `
          DROP TABLE IF EXISTS review_images CASCADE;
          DROP TABLE IF EXISTS review_votes CASCADE;
          DROP TABLE IF EXISTS product_reviews CASCADE;
        `,
        checksum: this.generateChecksum('reviews_and_ratings'),
        createdAt: new Date('2024-03-01'),
      }
    ];

    console.log(`📋 Loaded ${this.migrations.length} database migrations`);
  }

  private generateChecksum(content: string): string {
    // Simple checksum generation (in production, use crypto)
    return Buffer.from(content).toString('base64').substring(0, 16);
  }

  private async executeQuery(query: string): Promise<any> {
    // Mock database execution for demo
    console.log(`🔍 Executing query: ${query.substring(0, 100)}...`);
    
    // Simulate query execution time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return { success: true, rowCount: 1 };
  }

  async createMigrationsTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        migration_id VARCHAR(255) UNIQUE NOT NULL,
        version INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        checksum VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    await this.executeQuery(createTableQuery);
    console.log('✅ Schema migrations table created');
  }

  async getExecutedMigrations(): Promise<Migration[]> {
    // Mock getting executed migrations
    const executedMigrationIds = ['001_initial_schema', '002_sessions_and_auth'];
    
    return this.migrations
      .filter(m => executedMigrationIds.includes(m.id))
      .map(m => ({ ...m, executedAt: new Date() }));
  }

  async getPendingMigrations(): Promise<Migration[]> {
    const executed = await this.getExecutedMigrations();
    const executedIds = executed.map(m => m.id);
    
    return this.migrations.filter(m => !executedIds.includes(m.id));
  }

  async executeMigration(migration: Migration): Promise<MigrationResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🚀 Executing migration: ${migration.name}`);
      
      // Execute the migration
      await this.executeQuery(migration.up);
      
      // Record the migration
      const recordQuery = `
        INSERT INTO schema_migrations (migration_id, version, name, checksum)
        VALUES ('${migration.id}', ${migration.version}, '${migration.name}', '${migration.checksum}')
      `;
      await this.executeQuery(recordQuery);
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ Migration ${migration.name} completed in ${duration}ms`);
      
      return {
        success: true,
        migration: { ...migration, executedAt: new Date() },
        duration
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error(`❌ Migration ${migration.name} failed: ${errorMessage}`);
      
      return {
        success: false,
        migration,
        error: errorMessage,
        duration
      };
    }
  }

  async rollbackMigration(migration: Migration): Promise<MigrationResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🔄 Rolling back migration: ${migration.name}`);
      
      // Execute the rollback
      await this.executeQuery(migration.down);
      
      // Remove the migration record
      const removeQuery = `
        DELETE FROM schema_migrations WHERE migration_id = '${migration.id}'
      `;
      await this.executeQuery(removeQuery);
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ Rollback ${migration.name} completed in ${duration}ms`);
      
      return {
        success: true,
        migration,
        duration
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error(`❌ Rollback ${migration.name} failed: ${errorMessage}`);
      
      return {
        success: false,
        migration,
        error: errorMessage,
        duration
      };
    }
  }

  async migrateUp(targetVersion?: number): Promise<MigrationResult[]> {
    console.log('🔄 Starting database migration...');
    
    await this.createMigrationsTable();
    
    const pending = await this.getPendingMigrations();
    const toExecute = targetVersion 
      ? pending.filter(m => m.version <= targetVersion)
      : pending;
    
    if (toExecute.length === 0) {
      console.log('✅ Database is up to date');
      return [];
    }
    
    console.log(`📝 Executing ${toExecute.length} pending migrations`);
    
    const results: MigrationResult[] = [];
    
    for (const migration of toExecute.sort((a, b) => a.version - b.version)) {
      const result = await this.executeMigration(migration);
      results.push(result);
      
      if (!result.success) {
        console.error('🛑 Migration failed, stopping execution');
        break;
      }
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`📊 Migration summary: ${successful} successful, ${failed} failed`);
    
    return results;
  }

  async migrateDown(targetVersion: number): Promise<MigrationResult[]> {
    console.log(`🔄 Rolling back to version ${targetVersion}...`);
    
    const executed = await this.getExecutedMigrations();
    const toRollback = executed
      .filter(m => m.version > targetVersion)
      .sort((a, b) => b.version - a.version); // Rollback in reverse order
    
    if (toRollback.length === 0) {
      console.log('✅ Already at target version');
      return [];
    }
    
    console.log(`📝 Rolling back ${toRollback.length} migrations`);
    
    const results: MigrationResult[] = [];
    
    for (const migration of toRollback) {
      const result = await this.rollbackMigration(migration);
      results.push(result);
      
      if (!result.success) {
        console.error('🛑 Rollback failed, stopping execution');
        break;
      }
    }
    
    return results;
  }

  async getStatus(): Promise<{
    currentVersion: number;
    latestVersion: number;
    executedMigrations: number;
    pendingMigrations: number;
    status: 'up-to-date' | 'pending' | 'error';
  }> {
    const executed = await this.getExecutedMigrations();
    const pending = await this.getPendingMigrations();
    
    const currentVersion = executed.length > 0 
      ? Math.max(...executed.map(m => m.version))
      : 0;
    const latestVersion = Math.max(...this.migrations.map(m => m.version));
    
    return {
      currentVersion,
      latestVersion,
      executedMigrations: executed.length,
      pendingMigrations: pending.length,
      status: pending.length === 0 ? 'up-to-date' : 'pending'
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.executeQuery('SELECT 1');
      return true;
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const migrationManager = DatabaseMigrationManager.getInstance();

// Export types
export type { Migration, MigrationResult };

// Default export
export default migrationManager;