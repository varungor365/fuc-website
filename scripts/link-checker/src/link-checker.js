import { LinkChecker as Linkinator } from 'linkinator';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class LinkChecker {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:3000';
    this.fullScan = options.fullScan || false;
    this.externalOnly = options.externalOnly || false;
    this.timeout = options.timeout || 30000;
    this.concurrency = options.concurrency || 10;
    
    // Critical paths for FASHUN.CO
    this.criticalPaths = [
      '/',
      '/collections',
      '/products',
      '/cart',
      '/about',
      '/contact',
      '/admin',
      '/api/health'
    ];
    
    // External domains to prioritize
    this.priorityDomains = [
      'instagram.com',
      'facebook.com',
      'twitter.com',
      'youtube.com',
      'github.com',
      'vercel.com',
      'stripe.com'
    ];
  }

  async scan() {
    console.log(chalk.blue(`🔍 Scanning ${this.baseUrl}...`));
    
    const startTime = Date.now();
    const results = {
      totalLinks: 0,
      workingLinks: [],
      brokenLinks: [],
      redirects: [],
      warnings: [],
      scanDuration: 0,
      timestamp: new Date().toISOString()
    };

    try {
      // Configure linkinator
      const checker = new Linkinator();
      
      const config = {
        path: this.baseUrl,
        port: this.getPortFromUrl(this.baseUrl),
        recurse: true,
        timeout: this.timeout,
        concurrency: this.concurrency,
        linksToSkip: [
          // Skip these patterns
          'mailto:',
          'tel:',
          'javascript:',
          '#',
          'data:',
          // Skip social media login URLs
          'https://accounts.google.com',
          'https://www.facebook.com/login',
          'https://twitter.com/login'
        ],
        // Only check specific paths if not full scan
        directoryListing: this.fullScan
      };

      // Start the scan
      const linkResults = await checker.check(config);
      
      // Process results
      for (const link of linkResults.links) {
        results.totalLinks++;
        
        if (link.state === 'BROKEN') {
          const brokenLink = await this.processBrokenLink(link);
          results.brokenLinks.push(brokenLink);
        } else if (link.state === 'OK') {
          results.workingLinks.push({
            url: link.url,
            status: link.status,
            parent: link.parent
          });
        } else if (link.state === 'REDIRECT') {
          results.redirects.push({
            url: link.url,
            status: link.status,
            parent: link.parent,
            target: link.target
          });
        } else {
          results.warnings.push({
            url: link.url,
            state: link.state,
            status: link.status,
            parent: link.parent
          });
        }
      }

      results.scanDuration = Date.now() - startTime;
      
      console.log(chalk.green(`✅ Scan completed in ${results.scanDuration}ms`));
      console.log(chalk.cyan(`📊 Summary:`));
      console.log(`  Total links: ${results.totalLinks}`);
      console.log(`  Working: ${chalk.green(results.workingLinks.length)}`);
      console.log(`  Broken: ${chalk.red(results.brokenLinks.length)}`);
      console.log(`  Redirects: ${chalk.yellow(results.redirects.length)}`);
      console.log(`  Warnings: ${chalk.yellow(results.warnings.length)}`);

      return results;
      
    } catch (error) {
      console.error(chalk.red('❌ Scan failed:'), error.message);
      throw error;
    }
  }

  async processBrokenLink(link) {
    console.log(chalk.red(`❌ Broken link: ${link.url}`));
    
    const brokenLink = {
      url: link.url,
      status: link.status,
      parent: link.parent,
      timestamp: new Date().toISOString(),
      isExternal: this.isExternalLink(link.url),
      isPriority: this.isPriorityDomain(link.url),
      suggestions: []
    };

    // Try to find suggestions for broken links
    try {
      // For external links, try Wayback Machine
      if (brokenLink.isExternal) {
        const waybackUrl = await this.checkWaybackMachine(link.url);
        if (waybackUrl) {
          brokenLink.suggestions.push({
            type: 'wayback',
            url: waybackUrl,
            description: 'Archived version from Wayback Machine'
          });
        }
      }

      // For internal links, suggest similar pages
      if (!brokenLink.isExternal) {
        const similarPages = await this.findSimilarPages(link.url);
        brokenLink.suggestions.push(...similarPages);
      }

    } catch (error) {
      console.warn(chalk.yellow(`⚠️ Could not find suggestions for ${link.url}`));
    }

    return brokenLink;
  }

  async checkWaybackMachine(url) {
    try {
      const waybackApi = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
      const response = await fetch(waybackApi, { timeout: 10000 });
      const data = await response.json();
      
      if (data.archived_snapshots?.closest?.available) {
        return data.archived_snapshots.closest.url;
      }
    } catch (error) {
      console.warn(chalk.yellow(`⚠️ Wayback Machine check failed for ${url}`));
    }
    return null;
  }

  async findSimilarPages(brokenUrl) {
    const suggestions = [];
    
    try {
      // Extract path segments from broken URL
      const urlPath = new URL(brokenUrl, this.baseUrl).pathname;
      const segments = urlPath.split('/').filter(s => s.length > 0);
      
      // Try to find pages with similar path segments
      const possiblePaths = [
        // Try removing last segment
        segments.slice(0, -1).join('/'),
        // Try common variations
        segments.join('-'),
        segments.join('_'),
        // Try parent directory
        segments.slice(0, Math.max(1, segments.length - 1)).join('/')
      ].filter(p => p.length > 0).map(p => `/${p}`);

      for (const testPath of possiblePaths) {
        try {
          const testUrl = new URL(testPath, this.baseUrl).toString();
          const response = await fetch(testUrl, { 
            method: 'HEAD', 
            timeout: 5000 
          });
          
          if (response.ok) {
            suggestions.push({
              type: 'similar',
              url: testUrl,
              description: `Similar page (${response.status})`
            });
            break; // Only suggest the first working alternative
          }
        } catch (error) {
          // Continue to next suggestion
        }
      }
    } catch (error) {
      console.warn(chalk.yellow(`⚠️ Could not find similar pages for ${brokenUrl}`));
    }

    return suggestions;
  }

  isExternalLink(url) {
    try {
      const linkDomain = new URL(url).hostname;
      const baseDomain = new URL(this.baseUrl).hostname;
      return linkDomain !== baseDomain;
    } catch (error) {
      return false;
    }
  }

  isPriorityDomain(url) {
    try {
      const linkDomain = new URL(url).hostname;
      return this.priorityDomains.some(domain => linkDomain.includes(domain));
    } catch (error) {
      return false;
    }
  }

  getPortFromUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80);
    } catch (error) {
      return 3000;
    }
  }
}