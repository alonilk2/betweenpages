#!/usr/bin/env node
/**
 * Build-time script to generate search index
 * This runs during next build to create a static search index
 */

const fs = require('fs');
const path = require('path');

// We need to use dynamic import for ES modules
async function loadContentModule() {
  const { buildSearchIndex } = await import('../lib/content.js');
  return buildSearchIndex;
}

const SEARCH_INDEX_PATH = path.join(
  process.cwd(),
  'public',
  'search-index.json'
);

async function generateSearchIndex() {
  try {
    console.log('🔍 Building search index...');

    // Dynamically import the ES module
    const buildSearchIndex = await loadContentModule();

    // Build the search index from all content
    const searchIndex = buildSearchIndex();

    // Ensure public directory exists
    const publicDir = path.dirname(SEARCH_INDEX_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write the index to public directory
    fs.writeFileSync(SEARCH_INDEX_PATH, JSON.stringify(searchIndex, null, 2));

    console.log(`✅ Search index generated with ${searchIndex.length} items`);
    console.log(`📄 Written to: ${SEARCH_INDEX_PATH}`);

    // Generate some stats
    const stats = searchIndex.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 Index stats:', stats);
  } catch (error) {
    console.error('❌ Error generating search index:', error);
    process.exit(1);
  }
}

// Run the function
generateSearchIndex();
