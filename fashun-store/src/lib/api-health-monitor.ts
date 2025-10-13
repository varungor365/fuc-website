import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface APIStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastChecked: string;
  responseTime: number;
  errorMessage?: string;
}

export async function checkAPIHealth(apiName: string, endpoint: string, apiKey?: string): Promise<APIStatus> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {},
      signal: AbortSignal.timeout(5000)
    });

    const responseTime = Date.now() - startTime;
    const status = response.ok ? 'healthy' : 'degraded';

    const result: APIStatus = {
      name: apiName,
      status,
      lastChecked: new Date().toISOString(),
      responseTime,
      errorMessage: response.ok ? undefined : `HTTP ${response.status}`
    };

    await logAPIStatus(result);
    return result;
  } catch (error: any) {
    const result: APIStatus = {
      name: apiName,
      status: 'down',
      lastChecked: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      errorMessage: error.message
    };

    await logAPIStatus(result);
    await sendAdminAlert(result);
    return result;
  }
}

async function logAPIStatus(status: APIStatus) {
  await supabase.from('api_health_logs').insert({
    api_name: status.name,
    status: status.status,
    response_time: status.responseTime,
    error_message: status.errorMessage,
    checked_at: status.lastChecked
  });
}

async function sendAdminAlert(status: APIStatus) {
  await supabase.from('admin_alerts').insert({
    type: 'api_failure',
    severity: 'high',
    title: `${status.name} API Down`,
    message: `${status.name} is not responding. Error: ${status.errorMessage}`,
    metadata: { api: status.name, error: status.errorMessage },
    created_at: new Date().toISOString()
  });
}

export async function checkAllAPIs() {
  const apis = [
    { name: 'Supabase', endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    { name: 'Replicate', endpoint: 'https://api.replicate.com/v1/models', key: process.env.REPLICATE_API_TOKEN },
    { name: 'Gemini', endpoint: `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}` },
    { name: 'Medusa', endpoint: `${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/products` },
    { name: 'Turnstile', endpoint: 'https://challenges.cloudflare.com/turnstile/v0/siteverify' }
  ];

  const results = await Promise.all(
    apis.map(api => checkAPIHealth(api.name, api.endpoint, api.key))
  );

  return results;
}
