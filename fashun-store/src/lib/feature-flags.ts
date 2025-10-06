import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

let cachedFlags: Record<string, boolean> = {};
let lastFetch = 0;
const CACHE_DURATION = 60000; // 1 minute

export async function isFeatureEnabled(featureName: string): Promise<boolean> {
  const now = Date.now();
  
  if (now - lastFetch > CACHE_DURATION) {
    const { data } = await supabase.from('feature_flags').select('name, enabled');
    if (data) {
      cachedFlags = data.reduce((acc, flag) => ({ ...acc, [flag.name]: flag.enabled }), {});
      lastFetch = now;
    }
  }

  return cachedFlags[featureName] ?? true;
}

export async function withFeatureFlag<T>(
  featureName: string,
  enabledFn: () => T,
  disabledFn: () => T
): Promise<T> {
  const enabled = await isFeatureEnabled(featureName);
  return enabled ? enabledFn() : disabledFn();
}
