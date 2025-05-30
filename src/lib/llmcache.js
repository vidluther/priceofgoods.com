import fs from "fs/promises";
import path from "path";

const CACHE_DIR = ".cache/llm";

/**
 * Get cached analysis for an item
 * @param {string} itemKey - The unique identifier for the item
 * @returns {Promise<{data: string, citations?: Array, timestamp: number, prompt: string, provider: string}|null>} The cached analysis or null if not found/expired
 */
export async function getCachedAnalysis(itemKey) {
  try {
    const filePath = path.join(CACHE_DIR, `${itemKey}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    const cached = JSON.parse(content);

    // Invalidate cache after 24 hours or if the cache version is outdated
    // Adding a version check to force regeneration when the prompt format changes
    const CACHE_VERSION = 2; // Increment this when the prompt format changes
    if (Date.now() - cached.timestamp > 24 * 60 * 60 * 1000 || 
        !cached.version || 
        cached.version < CACHE_VERSION) {
      return null;
    }

    return {
      data: cached.data || '',
      citations: cached.citations || [],
      timestamp: cached.timestamp,
    };
  } catch (error) {
    console.log("Error reading from cache:", error);
    return null;
  }
}

/**
 * Cache analysis result for an item
 * @param {string} itemKey - The unique identifier for the item
 * @param {Object} analysis - The analysis result to cache
 * @param {Array} [citations] - Optional citations from the analysis
 * @param {string} prompt - The prompt used for analysis
 * @param {'anthropic'|'perplexity'} provider - The LLM provider used
 */
export async function cacheAnalysis(itemKey, analysis, citations = [], prompt, provider = 'anthropic') {
  // The cache version should match the version in getCachedAnalysis
  const CACHE_VERSION = 2;
  
  const entry = {
    timestamp: Date.now(),
    data: analysis,
    citations,
    prompt,
    provider,
    version: CACHE_VERSION,
  };

  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const filePath = path.join(CACHE_DIR, `${itemKey}.json`);
    await fs.writeFile(filePath, JSON.stringify(entry, null, 2));
    console.log(
      `Successfully cached analysis for ${itemKey} with ${citations.length} citations using ${provider} (v${CACHE_VERSION})`,
    );
  } catch (error) {
    console.error("Error writing to cache:", error);
  }
}
