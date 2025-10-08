export const executiveSummary = `
Fashun.co.in presents a potent brand identity with a strong, modern voice tailored for the Indian streetwear market. However, its growth is severely hamstrung by <strong>critical technical SEO deficiencies, a non-existent off-page digital footprint, and damaging on-site content errors</strong>. The website currently operates in a vacuum, invisible to search engines and potential customers alike. The most urgent priority is to rectify foundational technical issues—particularly the invalid sitemap—to enable basic search engine visibility. Only after establishing a stable technical base can the brand begin to build authority and compete in its crowded market.`;

export const swotData = {
    labels: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
    values: [3, 4, 4, 4],
    details: {
        strengths: {
            title: "Strengths",
            points: [
                "<strong>Potent Brand Identity:</strong> Energetic, youthful tone ('STREETWEAR REVOLUTION') that resonates with the target audience.",
                "<strong>Effective Foundational Content:</strong> Strong homepage and an exceptionally clear, trust-building Shipping Policy page.",
                "<strong>Solid E-commerce Basics:</strong> Good product imagery, social proof (ratings), and clear contact information enhance credibility."
            ]
        },
        weaknesses: {
            title: "Weaknesses",
            points: [
                "<strong>Crippling Technical SEO:</strong> Invalid sitemap data (future dates), inclusion of non-indexable URLs (`/admin`), and duplicate content signals.",
                "<strong>Zero Off-Page Authority:</strong> A non-existent backlink profile and lack of brand mentions make the site invisible to search engines.",
                "<strong>Damaging On-Site Errors:</strong> Highly unprofessional `Privacy Policy` title ('FUC! Fashion') and a completely empty FAQ page.",
                "<strong>Poor User Experience:</strong> Rudimentary product filtering and a high-friction manual returns process."
            ]
        },
        opportunities: {
            title: "Opportunities",
            points: [
                "<strong>Technical SEO Rectification:</strong> Fixing the sitemap and on-page errors is low-hanging fruit for immediate SEO improvement.",
                "<strong>Authority Building:</strong> A blank slate to build a high-quality backlink profile through targeted outreach and digital PR.",
                "<strong>Content & Social Engagement:</strong> Populating the FAQ and leveraging social media (e.g., existing `#fashun` hashtag) can build a community and drive traffic.",
                "<strong>On-Site Conversion Enhancement:</strong> Implementing advanced filtering and streamlining returns can directly boost sales."
            ]
        },
        threats: {
            title: "Threats",
            points: [
                "<strong>E-commerce Giants:</strong> Myntra, Flipkart, and Amazon possess dominant market share, massive budgets, and established logistics.",
                "<strong>Niche & Curated Platforms:</strong> Ajio and Nykaa Fashion attract fashion-forward consumers with curated experiences.",
                "<strong>International Fast Fashion:</strong> Zara and H&M excel at rapidly delivering global trends to the Indian market.",
                "<strong>Affordable D2C Competitors:</strong> Brands like Beyoung and Urbanic directly target the same youth demographic with competitive pricing."
            ]
        }
    }
};

export const competitorData = {
    summary: `Fashun.co.in enters a "red ocean" market, saturated with established competitors at every tier. The primary challenge is not just to attract customers, but to gain any visibility at all against giants with immense brand recognition and marketing power.`,
    breakdown: {
        'E-commerce Giants': 3,
        'Niche Platforms': 2,
        'Fast Fashion': 2,
        'D2C Brands': 3
    },
    breakdownText: `
        <p>The competitive landscape is layered:</p>
        <br>
        <p><strong>E-commerce Giants</strong> like Myntra and Amazon represent the largest threat due to scale and market dominance.</p>
        <br>
        <p><strong>Niche Platforms</strong> like Ajio compete directly on style curation and user experience.</p>
        <br>
        <p><strong>Fast Fashion</strong> retailers Zara & H&M are masters of trend velocity.</p>
        <br>
        <p><strong>D2C Brands</strong> such as Beyoung are agile and compete aggressively on price for the same target demographic.</p>
    `,
    competitors: [
        { name: "Myntra", type: "E-commerce Giant", threat: "Market leader with massive brand recognition, budget, and logistics.", threatLevel: "High" },
        { name: "Ajio", type: "Niche Platform", threat: "Focuses on curated collections and enhanced UX, directly challenging Fashun's positioning.", threatLevel: "High" },
        { name: "Beyoung / Urbanic", type: "D2C Brands", threat: "Directly target the same youth demographic with trendy, affordable streetwear.", threatLevel: "High" },
        { name: "Flipkart / Amazon Fashion", type: "E-commerce Giant", threat: "Dominate on selection, price, and delivery speed.", threatLevel: "Medium" },
        { name: "Zara / H&M", type: "Fast Fashion", threat: "Strong online presence and experts at rapid trend adoption.", threatLevel: "Medium" },
        { name: "Nykaa Fashion", type: "Niche Platform", threat: "Attracts premium and fashion-forward customers.", threatLevel: "Medium" },
    ]
};

export const onPageAnalysisData = [
    { title: "Brand Voice & Tone", description: "The energetic, youthful, and aspirational tone is well-aligned with the target streetwear audience. The messaging is confident and impactful.", icon: "megaphone", isPositive: true },
    { title: "Critical Content Errors", description: "The 'FUC! Fashion' title on the privacy policy is extremely unprofessional and damaging. The FAQ page is completely empty, creating a dead-end for users.", icon: "file-x-2", isPositive: false },
    { title: "User Experience (UX) Gaps", description: "Product filtering is too basic, lacking essential options like size and color. The returns process requires manual emailing, adding unnecessary friction for customers.", icon: "mouse-pointer-click", isPositive: false }
];

export const technicalAuditData = [
    { title: "Sitemap: Invalid Timestamps", details: "All 46 URLs have a `<lastmod>` date of <strong>October 7, 2025</strong>. These future dates are invalid and will cause search engines to distrust or ignore the sitemap.", icon: "calendar-x", colorClass: "text-red-400" },
    { title: "Sitemap: Improper URL Inclusion", details: "The sitemap includes URLs that should not be indexed, such as <code>/admin</code>, <code>/login</code>, and <code>/wishlist</code>. This wastes crawl budget and signals poor configuration.", icon: "list-x", colorClass: "text-red-400" },
    { title: "Sitemap: Duplicate Content Signal", details: "The sitemap contains both <code>/returns-policy</code> and <code>/return-policy</code>, signaling a duplicate content issue that needs to be resolved with a 301 redirect.", icon: "copy", colorClass: "text-amber-400" },
    { title: "Page Speed", details: "Google PageSpeed Insights reports <strong>'insufficient real-world speed data'</strong>. This indicates the site has very low traffic, making performance analysis impossible at this time.", icon: "gauge-circle", colorClass: "text-sky-400" },
    { title: "Robots.txt", details: "The <code>robots.txt</code> file is correctly configured, properly disallowing crawlers from admin, cart, and account pages. This is a positive finding.", icon: "file-check-2", colorClass: "text-green-400" }
];

export const offPageAnalysisData = [
    { title: "Backlink Profile", description: "Analysis reveals an extremely low to non-existent backlink profile. The absence of links from authoritative or relevant domains severely hinders domain authority and the ability to rank in search results.", icon: "link-2-off" },
    { title: "Brand Mentions", description: "No significant brand mentions, partnerships, or press coverage were found outside of the fashun.co.in domain. The brand is currently invisible in the broader digital landscape.", icon: "search-slash" },
    { title: "Social Media Footprint", description: "While the hashtag #fashun is popular, there is no evidence of an active, branded social media presence for fashun.co.in itself. This is a major missed opportunity for community building and brand awareness.", icon: "message-square-off" }
];

export const recommendationsData = [
    { priority: 1, title: "Fix Critical Sitemap & Content Errors", justification: "This is the absolute top priority. An invalid sitemap and unprofessional content make all other marketing efforts futile. Fixing these foundational issues is required for basic search engine viability and brand credibility.", tags: ["Critical", "Technical SEO", "On-Page"] },
    { priority: 2, title: "Enhance On-Site User Experience", justification: "After fixing critical errors, focus on improving the customer journey. Implement advanced product filtering to aid discovery and streamline the returns process to build trust and reduce friction.", tags: ["UX", "Conversion", "E-commerce"] },
    { priority: 3, title: "Initiate Authority Building & Social Presence", justification: "With a stable technical foundation, begin building off-page authority. Launch a targeted backlink acquisition campaign and create active social media profiles to engage with the community and build brand awareness from the ground up.", tags: ["Growth", "Off-Page SEO", "Social Media"] }
];

export const conclusionData = `
Fashun.co.in possesses a promising brand concept and a clear vision for its target market. However, it is currently a house built on a faulty foundation. The combination of <strong>crippling technical errors and a complete lack of off-page authority renders it invisible and uncompetitive</strong>. Success is entirely contingent on a disciplined, sequential approach: first, fix the fundamental technical and content issues (Priority 1). Second, optimize the on-site experience (Priority 2). Only then can the brand realistically embark on the long-term journey of building authority and capturing market share (Priority 3).`;
