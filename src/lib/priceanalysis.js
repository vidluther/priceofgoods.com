// src/lib/priceAnalysis.js
import { fetchItemHistory, fetchLatestItemData } from "./fetchUtils";

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

/**
 * Fetches and analyzes price data for a specific item
 */
export async function analyzeItemPrices(item) {
  try {
    // Fetch national and regional data
    const [nationalData, historyData] = await Promise.all([
      fetchLatestItemData("national", item.dataKey),
      fetchItemHistory("national", item.dataKey),
    ]);

    // Fetch regional data
    const regions = ["northeast", "midwest", "south", "west"];
    const regionalData = await Promise.all(
      regions.map((region) =>
        fetchLatestItemData(region, item.dataKey).then((data) => ({
          region,
          ...data,
        })),
      ),
    );

    // Generate analysis prompt
    const prompt = generatePrompt(
      item.name,
      nationalData,
      historyData,
      regionalData,
    );
    // console.log(prompt);
    // Call Anthropic API
    try {
      // const anthropicResponse = await fetch(
      //   "https://api.anthropic.com/v1/messages",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "x-api-key": import.meta.env.PUBLIC_ANTHROPIC_API_KEY,
      //       "anthropic-version": "2023-06-01",
      //     },
      //     body: JSON.stringify({
      //       model: "claude-3-5-sonnet-20241022",
      //       messages: [
      //         {
      //           role: "user",
      //           content: prompt,
      //         },
      //       ],
      //       max_tokens: 1000,
      //     }),
      //   },
      // );
      // const Anthropic_analysis = await anthropicResponse.json();
      // console.log("Anthropic_Analysis:", Anthropic_analysis);
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

      // console.log(perplexityResponse);
      const perplexityAnalysis = await perplexityResponse.json();
      // console.log("Perplexity_Analysis:", perplexityAnalysis);
      // console.log(perplexityAnalysis.choices);
      // Generate markdown content
      const citations = perplexityAnalysis.citations;
      const markdown = perplexityAnalysis.choices[0].message.content;

      return markdown;
    } catch (error) {
      console.error("Error during API call or processing analysis:", error);
      throw error;
    }
  } catch (error) {
    console.error(`Error analyzing prices for ${item.name}:`, error);
    throw error;
  }
}
