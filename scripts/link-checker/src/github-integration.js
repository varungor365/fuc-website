import { Octokit } from '@octokit/rest';
import chalk from 'chalk';

export class GitHubIntegration {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    
    this.owner = process.env.GITHUB_OWNER || 'varungor365';
    this.repo = process.env.GITHUB_REPO || 'fuc-website';
    
    // Issue labels for categorization
    this.labels = {
      brokenLink: 'broken-link',
      externalLink: 'external-link',
      internalLink: 'internal-link',
      priority: 'priority',
      automated: 'automated'
    };
  }

  async createIssuesForBrokenLinks(brokenLinks) {
    console.log(chalk.blue(`🔧 Creating GitHub issues for ${brokenLinks.length} broken links...`));

    // Ensure labels exist
    await this.ensureLabelsExist();

    // Group broken links by type and priority
    const groupedLinks = this.groupBrokenLinks(brokenLinks);

    // Create issues for each group
    for (const group of groupedLinks) {
      try {
        await this.createIssue(group);
        console.log(chalk.green(`✅ Created issue: ${group.title}`));
      } catch (error) {
        console.error(chalk.red(`❌ Failed to create issue for ${group.title}:`), error.message);
      }
    }
  }

  groupBrokenLinks(brokenLinks) {
    const groups = [];

    // Priority external links get individual issues
    const priorityExternal = brokenLinks.filter(link => link.isExternal && link.isPriority);
    priorityExternal.forEach(link => {
      groups.push({
        type: 'single',
        priority: true,
        external: true,
        links: [link],
        title: `🔗 Priority External Link Broken: ${this.getDomainFromUrl(link.url)}`,
        labels: [this.labels.brokenLink, this.labels.externalLink, this.labels.priority, this.labels.automated]
      });
    });

    // Group non-priority external links by domain
    const externalLinks = brokenLinks.filter(link => link.isExternal && !link.isPriority);
    const externalByDomain = this.groupByDomain(externalLinks);
    
    Object.entries(externalByDomain).forEach(([domain, links]) => {
      if (links.length === 1) {
        groups.push({
          type: 'single',
          priority: false,
          external: true,
          links: links,
          title: `🔗 External Link Broken: ${domain}`,
          labels: [this.labels.brokenLink, this.labels.externalLink, this.labels.automated]
        });
      } else {
        groups.push({
          type: 'multiple',
          priority: false,
          external: true,
          links: links,
          title: `🔗 Multiple External Links Broken: ${domain} (${links.length} links)`,
          labels: [this.labels.brokenLink, this.labels.externalLink, this.labels.automated]
        });
      }
    });

    // Group internal links
    const internalLinks = brokenLinks.filter(link => !link.isExternal);
    if (internalLinks.length > 0) {
      if (internalLinks.length === 1) {
        groups.push({
          type: 'single',
          priority: true,
          external: false,
          links: internalLinks,
          title: `🏠 Internal Link Broken: ${internalLinks[0].url}`,
          labels: [this.labels.brokenLink, this.labels.internalLink, this.labels.priority, this.labels.automated]
        });
      } else {
        groups.push({
          type: 'multiple',
          priority: true,
          external: false,
          links: internalLinks,
          title: `🏠 Multiple Internal Links Broken (${internalLinks.length} links)`,
          labels: [this.labels.brokenLink, this.labels.internalLink, this.labels.priority, this.labels.automated]
        });
      }
    }

    return groups;
  }

  async createIssue(group) {
    const title = group.title;
    const body = this.generateIssueBody(group);
    
    // Check if similar issue already exists
    const existingIssue = await this.findExistingIssue(title);
    if (existingIssue) {
      console.log(chalk.yellow(`⚠️ Issue already exists: ${title}`));
      return existingIssue;
    }

    const issue = await this.octokit.rest.issues.create({
      owner: this.owner,
      repo: this.repo,
      title: title,
      body: body,
      labels: group.labels,
      assignees: [this.owner] // Auto-assign to repo owner
    });

    return issue.data;
  }

  generateIssueBody(group) {
    const timestamp = new Date().toLocaleString();
    const isMultiple = group.links.length > 1;
    
    let body = `## 🔍 Broken Link${isMultiple ? 's' : ''} Detected\n\n`;
    body += `**Detected on:** ${timestamp}\n`;
    body += `**Link Type:** ${group.external ? 'External' : 'Internal'}\n`;
    body += `**Priority:** ${group.priority ? 'High' : 'Normal'}\n\n`;

    body += `### ${isMultiple ? 'Broken Links' : 'Broken Link'}\n\n`;

    group.links.forEach((link, index) => {
      body += `${isMultiple ? `${index + 1}. ` : ''}**URL:** \`${link.url}\`\n`;
      body += `   - **Status:** ${link.status}\n`;
      body += `   - **Found on:** ${link.parent}\n`;
      body += `   - **Timestamp:** ${link.timestamp}\n`;

      if (link.suggestions && link.suggestions.length > 0) {
        body += `   - **Suggestions:**\n`;
        link.suggestions.forEach(suggestion => {
          body += `     - [${suggestion.description}](${suggestion.url})\n`;
        });
      }
      body += '\n';
    });

    body += `### 🔧 Action Required\n\n`;
    
    if (group.external) {
      body += `- [ ] Verify if the external link is permanently broken\n`;
      body += `- [ ] Replace with alternative link if available\n`;
      body += `- [ ] Remove link if no alternative exists\n`;
      body += `- [ ] Update any related documentation\n`;
    } else {
      body += `- [ ] Fix the internal routing issue\n`;
      body += `- [ ] Update any redirects or URL mappings\n`;
      body += `- [ ] Test the fix across all environments\n`;
      body += `- [ ] Update sitemap if necessary\n`;
    }

    body += `\n### 📊 Impact Assessment\n\n`;
    body += `- **SEO Impact:** ${group.priority ? 'High' : 'Medium'} - Broken links can negatively affect search rankings\n`;
    body += `- **User Experience:** ${group.external ? 'Medium' : 'High'} - ${group.external ? 'External' : 'Internal'} links affect user navigation\n`;
    body += `- **Pages Affected:** ${group.links.length}\n`;

    body += `\n---\n`;
    body += `*This issue was automatically created by the FASHUN.CO Link Checker*\n`;
    body += `*Run \`npm run link-check\` to manually verify fixes*`;

    return body;
  }

  async findExistingIssue(title) {
    try {
      const issues = await this.octokit.rest.issues.listForRepo({
        owner: this.owner,
        repo: this.repo,
        state: 'open',
        labels: this.labels.automated,
        per_page: 100
      });

      return issues.data.find(issue => 
        issue.title.includes(title.substring(0, 50)) // Match first 50 chars
      );
    } catch (error) {
      console.warn(chalk.yellow('⚠️ Could not check for existing issues'));
      return null;
    }
  }

  async ensureLabelsExist() {
    const labelConfigs = [
      {
        name: this.labels.brokenLink,
        description: 'Issues related to broken links',
        color: 'ff4757'
      },
      {
        name: this.labels.externalLink,
        description: 'External link issues',
        color: 'ffa502'
      },
      {
        name: this.labels.internalLink,
        description: 'Internal link issues',
        color: 'ff6b6b'
      },
      {
        name: this.labels.priority,
        description: 'High priority issues requiring immediate attention',
        color: 'ff3742'
      },
      {
        name: this.labels.automated,
        description: 'Issues created by automated systems',
        color: '747d8c'
      }
    ];

    for (const labelConfig of labelConfigs) {
      try {
        await this.octokit.rest.issues.createLabel({
          owner: this.owner,
          repo: this.repo,
          ...labelConfig
        });
      } catch (error) {
        // Label might already exist, which is fine
        if (!error.message.includes('already_exists')) {
          console.warn(chalk.yellow(`⚠️ Could not create label ${labelConfig.name}`));
        }
      }
    }
  }

  groupByDomain(links) {
    const grouped = {};
    
    links.forEach(link => {
      const domain = this.getDomainFromUrl(link.url);
      if (!grouped[domain]) {
        grouped[domain] = [];
      }
      grouped[domain].push(link);
    });

    return grouped;
  }

  getDomainFromUrl(url) {
    try {
      return new URL(url).hostname;
    } catch (error) {
      return 'unknown-domain';
    }
  }
}