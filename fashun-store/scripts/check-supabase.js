#!/usr/bin/env node

/**
 * Supabase Configuration Checker
 * Verifies your Supabase setup and environment variables
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking Supabase Configuration...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.log('   Create it by copying .env.example or following SUPABASE_SETUP.md\n');
  process.exit(1);
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf-8');

// Check required variables
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const optionalVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SITE_URL',
];

let hasErrors = false;
let hasWarnings = false;

console.log('📋 Required Environment Variables:\n');

requiredVars.forEach(varName => {
  const regex = new RegExp(`${varName}=(.+)`);
  const match = envContent.match(regex);
  
  if (!match) {
    console.log(`   ❌ ${varName} - NOT FOUND`);
    hasErrors = true;
  } else {
    const value = match[1].trim();
    if (value === '' || value.includes('your-') || value.includes('xxx')) {
      console.log(`   ⚠️  ${varName} - PLACEHOLDER VALUE`);
      hasErrors = true;
    } else {
      console.log(`   ✅ ${varName} - CONFIGURED`);
    }
  }
});

console.log('\n📋 Optional Environment Variables:\n');

optionalVars.forEach(varName => {
  const regex = new RegExp(`${varName}=(.+)`);
  const match = envContent.match(regex);
  
  if (!match || match[1].trim() === '') {
    console.log(`   ⚠️  ${varName} - NOT SET`);
    hasWarnings = true;
  } else {
    const value = match[1].trim();
    if (value.includes('your-') || value.includes('xxx')) {
      console.log(`   ⚠️  ${varName} - PLACEHOLDER VALUE`);
      hasWarnings = true;
    } else {
      console.log(`   ✅ ${varName} - CONFIGURED`);
    }
  }
});

// Check Supabase client file
console.log('\n📁 Supabase Client Files:\n');

const clientPath = path.join(__dirname, '..', 'src', 'lib', 'supabase-client.ts');
if (fs.existsSync(clientPath)) {
  console.log('   ✅ src/lib/supabase-client.ts - EXISTS');
} else {
  console.log('   ❌ src/lib/supabase-client.ts - NOT FOUND');
  hasErrors = true;
}

// Check auth routes
const authPaths = [
  'src/app/auth/callback/route.ts',
  'src/app/api/auth/social/google/route.ts',
];

console.log('\n📁 Authentication Routes:\n');

authPaths.forEach(authPath => {
  const fullPath = path.join(__dirname, '..', authPath);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${authPath} - EXISTS`);
  } else {
    console.log(`   ⚠️  ${authPath} - NOT FOUND`);
    hasWarnings = true;
  }
});

// Check middleware
console.log('\n📁 Middleware:\n');

const middlewarePath = path.join(__dirname, '..', 'src', 'middleware.ts');
if (fs.existsSync(middlewarePath)) {
  console.log('   ✅ src/middleware.ts - EXISTS');
} else {
  console.log('   ⚠️  src/middleware.ts - NOT FOUND');
  hasWarnings = true;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Configuration Summary:\n');

if (hasErrors) {
  console.log('   ❌ CONFIGURATION INCOMPLETE');
  console.log('   → Follow steps in SUPABASE_SETUP.md to complete setup\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('   ⚠️  CONFIGURATION MOSTLY COMPLETE');
  console.log('   → Some optional features may not work\n');
} else {
  console.log('   ✅ CONFIGURATION COMPLETE!');
  console.log('   → Run "npm run dev" to test authentication\n');
}

// Next steps
console.log('📝 Next Steps:\n');

if (hasErrors) {
  console.log('   1. Create a Supabase account at https://supabase.com');
  console.log('   2. Create a new project');
  console.log('   3. Copy your Project URL and anon key');
  console.log('   4. Update .env.local with your credentials');
  console.log('   5. Run this script again to verify\n');
} else {
  console.log('   1. Enable authentication providers in Supabase dashboard');
  console.log('   2. Configure OAuth credentials (Google, Apple, etc.)');
  console.log('   3. Test login at http://localhost:3000/login');
  console.log('   4. Check users in Supabase dashboard → Authentication\n');
}

console.log('📚 Documentation: See SUPABASE_SETUP.md for detailed guide\n');
