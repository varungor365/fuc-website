// Centralized API Integration Manager
import { getSettings } from './settings';

export class APIIntegrations {
  // Auth0 / Clerk Authentication
  static async initAuth() {
    const settings = await getSettings();
    const authProvider = settings.authProvider || 'clerk';
    
    if (authProvider === 'clerk') {
      return {
        provider: 'clerk',
        publishableKey: settings.clerkPublishableKey,
        secretKey: settings.clerkSecretKey,
      };
    } else {
      return {
        provider: 'auth0',
        domain: settings.auth0Domain,
        clientId: settings.auth0ClientId,
        clientSecret: settings.auth0ClientSecret,
      };
    }
  }

  // Cloudflare Turnstile (Bot Protection)
  static async verifyTurnstile(token: string): Promise<boolean> {
    const settings = await getSettings();
    if (!settings.cloudflareTurnstileSecret) return true;

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: settings.cloudflareTurnstileSecret,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success;
  }

  // ImageKit.io (Image Optimization)
  static getImageKitConfig() {
    const settings = getSettings();
    return {
      publicKey: settings.imagekitPublicKey,
      privateKey: settings.imagekitPrivateKey,
      urlEndpoint: settings.imagekitUrlEndpoint,
    };
  }

  static optimizeImage(url: string, width?: number, height?: number) {
    const settings = getSettings();
    if (!settings.imagekitUrlEndpoint) return url;

    const params = new URLSearchParams();
    if (width) params.append('tr', `w-${width}`);
    if (height) params.append('tr', `h-${height}`);
    params.append('tr', 'f-auto,q-80');

    return `${settings.imagekitUrlEndpoint}/${url}?${params.toString()}`;
  }

  // Sanity.io (Headless CMS)
  static getSanityClient() {
    const settings = getSettings();
    return {
      projectId: settings.sanityProjectId,
      dataset: settings.sanityDataset,
      apiVersion: '2024-01-01',
      token: settings.sanityToken,
      useCdn: true,
    };
  }

  // Algolia (Search)
  static getAlgoliaConfig() {
    const settings = getSettings();
    return {
      appId: settings.algoliaAppId,
      apiKey: settings.algoliaApiKey,
      indexName: settings.algoliaIndexName || 'products',
    };
  }

  // Resend (Email)
  static async sendEmail(to: string, subject: string, html: string) {
    const settings = await getSettings();
    if (!settings.resendApiKey) throw new Error('Resend API key not configured');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: settings.resendFromEmail || 'noreply@fashun.co',
        to,
        subject,
        html,
      }),
    });

    return response.json();
  }

  // Cloudinary (Media Management)
  static getCloudinaryConfig() {
    const settings = getSettings();
    return {
      cloudName: settings.cloudinaryCloudName,
      apiKey: settings.cloudinaryApiKey,
      apiSecret: settings.cloudinaryApiSecret,
    };
  }

  static getCloudinaryUrl(publicId: string, transformations?: string) {
    const settings = getSettings();
    if (!settings.cloudinaryCloudName) return '';

    const baseUrl = `https://res.cloudinary.com/${settings.cloudinaryCloudName}/image/upload`;
    return transformations ? `${baseUrl}/${transformations}/${publicId}` : `${baseUrl}/${publicId}`;
  }

  // Open Exchange Rates (Currency Conversion)
  static async getExchangeRates(base: string = 'USD') {
    const settings = await getSettings();
    if (!settings.openExchangeRatesKey) return null;

    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${settings.openExchangeRatesKey}&base=${base}`
    );

    return response.json();
  }

  static async convertCurrency(amount: number, from: string, to: string): Promise<number> {
    const rates = await this.getExchangeRates(from);
    if (!rates || !rates.rates[to]) return amount;

    return amount * rates.rates[to];
  }

  // Unsplash (Stock Photos)
  static async searchUnsplashPhotos(query: string, perPage: number = 10) {
    const settings = await getSettings();
    if (!settings.unsplashAccessKey) return [];

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': `Client-ID ${settings.unsplashAccessKey}`,
        },
      }
    );

    const data = await response.json();
    return data.results;
  }

  // Formspree (Form Handling)
  static async submitForm(formId: string, data: Record<string, any>) {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }

  // Crisp Chat
  static initCrispChat() {
    const settings = getSettings();
    if (!settings.crispWebsiteId) return;

    if (typeof window !== 'undefined') {
      (window as any).$crisp = [];
      (window as any).CRISP_WEBSITE_ID = settings.crispWebsiteId;
      
      const script = document.createElement('script');
      script.src = 'https://client.crisp.chat/l.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }
}
