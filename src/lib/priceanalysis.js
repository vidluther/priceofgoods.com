import Anthropic from "@anthropic-ai/sdk";
import { fetchItemHistory, fetchLatestItemData } from "./fetchUtils";
import { cacheAnalysis, getCachedAnalysis } from "./llmcache";

const anthropicClient = new Anthropic({
  apiKey: import.meta.env.PUBLIC_ANTHROPIC_API_KEY,
});

/**
 * Generates a prompt for the Anthropic API based on price data
 */
function generatePrompt(nameOfGood, itemData, historyData, regions) {
  const prompt = `You are a data analyst specializing in commodity price analysis. Your task is to analyze price data for ${nameOfGood} and provide insights. Here's the data you'll be working with:

  <latest_price_data>
  {{ ${JSON.stringify(itemData)}}}
  </latest_price_data>

  <historical_data_points>
  {{ ${JSON.stringify(historyData)}}}
  </historical_data_points>

  <regional_variations>
  {{ ${JSON.stringify(regions)}}}
  </regional_variations>
  Analysis steps:
  1. Price Trends:
     - Latest price and YoY change
     - Identify significant price movements and patterns
     - Compare with historical averages

  2. External Factors Analysis:
     - Weather events affecting production/distribution
     - Policy changes (tariffs, regulations, subsidies)
     - Global trade dynamics
     - Supply chain disruptions
     - Labor market changes
     - Energy costs impact

  3. Regional Analysis:
     - Price differences across regions
     - Region-specific factors (local policies, transportation, market competition)
     - Production vs consumption patterns by region

  4. Output Format:
  <analysis>
  <market_overview>
  [Current price state and major shifts]
  </market_overview>

  <key_drivers>
  [Major factors affecting prices: weather, policy, supply chain, etc.]
  </key_drivers>

  <regional_insights>
  [Geographic variations and local market conditions]
  </regional_insights>

  <outlook>
  [Short-term price trajectory based on current factors]
  </outlook>
  </analysis>

  Use specific data points and cite relevant external events affecting prices. Note any significant correlations between price changes and external factors.
 Respond with Markdown format.

`;
  return prompt;
}

async function fetchAnthropicAnalysis(prompt) {
  try {
    const message = await anthropicClient.messages.create({
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "claude-3-5-sonnet-latest",
    });
    console.log(message.content);
    return message.content[0].text;
  } catch (error) {
    console.error("Error during API call or processing analysis:", error);
    throw error;
  }
}

async function fetchPerplexityAnalysis(prompt) {
  const perplexityKey = import.meta.env.PUBLIC_PERPLEXITY_API_KEY;
  // console.log(prompt);
  const perplexityResponse = await fetch(
    "https://api.perplexity.ai/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${perplexityKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        frequency_penalty: 1.0,
        max_tokens: 1000,
      }),
    },
  );
  const perplexityAnalysis = await perplexityResponse.json();

  // Generate markdown content
  const citations = perplexityAnalysis.citations;
  const markdown = perplexityAnalysis.choices[0].message.content;
  return markdown;
}

export async function analyzeItemPrices(item, useAnthropic = true) {
  // Only use cache in development
  if (import.meta.env.PUBLIC_CACHE_AI_RESPONSE) {
    const cached = await getCachedAnalysis(item.dataKey);
    if (cached) {
      console.log(
        `Using cached analysis for ${item.name} from ${cached.provider}`,
      );
      return cached.data;
    }
  }

  try {
    // Fetch all data in parallel
    const [nationalData, historyData, regionalData] = await Promise.all([
      fetchLatestItemData("national", item.dataKey),
      fetchItemHistory("national", item.dataKey),
      Promise.all(
        ["northeast", "midwest", "south", "west"].map(async (region) => ({
          region,
          ...(await fetchLatestItemData(region, item.dataKey)),
        })),
      ),
    ]);

    const prompt = generatePrompt(
      item.name,
      nationalData,
      historyData,
      regionalData,
    );

    let analysis;
    try {
      if (useAnthropic) {
        analysis = await fetchAnthropicAnalysis(prompt);
        if (import.meta.env.DEV) {
          await cacheAnalysis(item.dataKey, analysis, prompt, "anthropic");
        }
      } else {
        analysis = await fetchPerplexityAnalysis(prompt);
        if (import.meta.env.DEV) {
          await cacheAnalysis(item.dataKey, analysis, prompt, "perplexity");
        }
      }
    } catch (error) {
      console.error(`Analysis failed for ${item.name}:`, error);
      throw error;
    }

    return analysis;
  } catch (error) {
    console.error(`Error analyzing prices for ${item.name}:`, error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
}
