import fetch from 'node-fetch';
import chalk from 'chalk';

export class WaybackMachine {
  constructor() {
    this.baseUrl = 'https://archive.org/wayback';
    this.timeout = 10000;
  }

  /**
   * Check if a URL has archived versions on the Wayback Machine
   */
  async checkAvailability(url) {
    try {
      console.log(chalk.blue(`🕰️ Checking Wayback Machine for: ${url}`));
      
      const apiUrl = `${this.baseUrl}/available?url=${encodeURIComponent(url)}`;
      const response = await fetch(apiUrl, { 
        timeout: this.timeout,
        headers: {
          'User-Agent': 'FASHUN.CO-LinkChecker/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Wayback API responded with ${response.status}`);
      }

      const data = await response.json();
      
      if (data.archived_snapshots?.closest?.available) {
        const snapshot = data.archived_snapshots.closest;
        return {
          available: true,
          url: snapshot.url,
          timestamp: snapshot.timestamp,
          status: snapshot.status,
          originalUrl: url
        };
      }

      return {
        available: false,
        originalUrl: url
      };

    } catch (error) {
      console.warn(chalk.yellow(`⚠️ Wayback Machine check failed for ${url}: ${error.message}`));
      return {
        available: false,
        originalUrl: url,
        error: error.message
      };
    }
  }

  /**
   * Get multiple snapshots for a URL over time
   */
  async getSnapshots(url, limit = 5) {
    try {
      const apiUrl = `${this.baseUrl}/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&limit=${limit}`;
      const response = await fetch(apiUrl, { 
        timeout: this.timeout,
        headers: {
          'User-Agent': 'FASHUN.CO-LinkChecker/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Wayback CDX API responded with ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || data.length < 2) {
        return [];
      }

      // Skip header row and process snapshots
      const snapshots = data.slice(1).map(row => ({
        timestamp: row[1],
        url: `https://web.archive.org/web/${row[1]}/${row[2]}`,
        mimeType: row[3],
        statusCode: row[4],
        digest: row[5],
        length: row[6]
      }));

      return snapshots;

    } catch (error) {
      console.warn(chalk.yellow(`⚠️ Wayback snapshots fetch failed for ${url}: ${error.message}`));
      return [];
    }
  }

  /**
   * Find the best archived version of a URL
   */
  async findBestArchive(url, preferredDate = null) {
    try {
      console.log(chalk.blue(`🎯 Finding best archive for: ${url}`));

      // First try the availability API for the closest match
      const availability = await this.checkAvailability(url);
      
      if (availability.available) {
        // Get additional snapshots to find the best one
        const snapshots = await this.getSnapshots(url, 10);
        
        if (snapshots.length > 0) {
          // Filter out failed snapshots (status codes 4xx, 5xx)
          const goodSnapshots = snapshots.filter(snapshot => {
            const status = parseInt(snapshot.statusCode);
            return status >= 200 && status < 400;
          });

          if (goodSnapshots.length > 0) {
            // If preferred date is specified, find closest to that date
            if (preferredDate) {
              const targetTimestamp = this.dateToWaybackTimestamp(preferredDate);
              goodSnapshots.sort((a, b) => {
                const diffA = Math.abs(parseInt(a.timestamp) - parseInt(targetTimestamp));
                const diffB = Math.abs(parseInt(b.timestamp) - parseInt(targetTimestamp));
                return diffA - diffB;
              });
            }

            return {
              available: true,
              url: goodSnapshots[0].url,
              timestamp: goodSnapshots[0].timestamp,
              statusCode: goodSnapshots[0].statusCode,
              originalUrl: url,
              totalSnapshots: snapshots.length,
              goodSnapshots: goodSnapshots.length
            };
          }
        }

        // Fallback to availability API result
        return availability;
      }

      return availability;

    } catch (error) {
      console.warn(chalk.yellow(`⚠️ Best archive search failed for ${url}: ${error.message}`));
      return {
        available: false,
        originalUrl: url,
        error: error.message
      };
    }
  }

  /**
   * Batch check multiple URLs
   */
  async batchCheck(urls, maxConcurrency = 5) {
    console.log(chalk.blue(`🔍 Batch checking ${urls.length} URLs on Wayback Machine...`));
    
    const results = [];
    const batches = this.createBatches(urls, maxConcurrency);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(chalk.cyan(`Processing batch ${i + 1}/${batches.length}...`));

      const batchResults = await Promise.all(
        batch.map(url => this.checkAvailability(url))
      );

      results.push(...batchResults);

      // Small delay between batches to be respectful to the API
      if (i < batches.length - 1) {
        await this.delay(1000);
      }
    }

    const available = results.filter(r => r.available).length;
    console.log(chalk.green(`✅ Batch check complete: ${available}/${urls.length} URLs have archives`));

    return results;
  }

  /**
   * Generate suggestions for broken links using Wayback Machine
   */
  async generateSuggestions(brokenLinks) {
    console.log(chalk.blue(`💡 Generating Wayback suggestions for ${brokenLinks.length} broken links...`));

    const suggestions = [];

    for (const link of brokenLinks) {
      try {
        const archive = await this.findBestArchive(link.url);
        
        if (archive.available) {
          suggestions.push({
            originalUrl: link.url,
            suggestion: {
              type: 'wayback',
              url: archive.url,
              description: `Archived version from ${this.formatWaybackDate(archive.timestamp)}`,
              confidence: 'high',
              timestamp: archive.timestamp
            }
          });
        } else {
          // Try to find archives of similar URLs
          const similarSuggestions = await this.findSimilarArchives(link.url);
          if (similarSuggestions.length > 0) {
            suggestions.push({
              originalUrl: link.url,
              suggestion: similarSuggestions[0] // Take the best match
            });
          }
        }
      } catch (error) {
        console.warn(chalk.yellow(`⚠️ Could not generate suggestion for ${link.url}`));
      }
    }

    console.log(chalk.green(`✅ Generated ${suggestions.length} Wayback suggestions`));
    return suggestions;
  }

  /**
   * Find archives of similar URLs when exact match fails
   */
  async findSimilarArchives(url) {
    try {
      const urlObj = new URL(url);
      const baseDomain = urlObj.hostname;
      const pathSegments = urlObj.pathname.split('/').filter(s => s.length > 0);

      const similarUrls = [];

      // Try removing last path segment
      if (pathSegments.length > 1) {
        const parentPath = pathSegments.slice(0, -1).join('/');
        similarUrls.push(`${urlObj.protocol}//${baseDomain}/${parentPath}`);
      }

      // Try just the domain
      similarUrls.push(`${urlObj.protocol}//${baseDomain}/`);

      // Check each similar URL
      for (const similarUrl of similarUrls) {
        const archive = await this.checkAvailability(similarUrl);
        if (archive.available) {
          return [{
            type: 'wayback-similar',
            url: archive.url,
            description: `Similar archived page from ${this.formatWaybackDate(archive.timestamp)}`,
            confidence: 'medium',
            timestamp: archive.timestamp
          }];
        }
      }

      return [];
    } catch (error) {
      return [];
    }
  }

  // Helper methods
  createBatches(array, batchSize) {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  dateToWaybackTimestamp(date) {
    const d = new Date(date);
    return d.getFullYear().toString() +
           (d.getMonth() + 1).toString().padStart(2, '0') +
           d.getDate().toString().padStart(2, '0') +
           d.getHours().toString().padStart(2, '0') +
           d.getMinutes().toString().padStart(2, '0') +
           d.getSeconds().toString().padStart(2, '0');
  }

  formatWaybackDate(timestamp) {
    if (!timestamp || timestamp.length < 8) return 'Unknown Date';
    
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    
    return `${year}-${month}-${day}`;
  }
}