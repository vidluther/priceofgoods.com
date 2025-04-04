import { BookTemplate } from "lucide-react";
import { fetchItemHistory, fetchLatestItemData } from "./fetchUtils";
import { cacheAnalysis, getCachedAnalysis } from "./llmcache";

function generatePrompt(nameOfGood, itemData, historyData, regions) {
  const prompt = `You are a data analyst specializing in price analysis.


Your task is to analyze price data for ${nameOfGood} in the United States of America
and provide insights. Here's the data you'll be working with:

    Here's the latest data from the BLS.
  <latest_price_data>
  {{ ${JSON.stringify(itemData)} }}
  </latest_price_data>

  This is the historical data from the BLS.
  <historical_data_points>
  {{ ${JSON.stringify(historyData)} }}
  </historical_data_points>


Use specific data points and cite current relevant external events affecting prices.
Note any significant correlations between price changes and external factors like policy changes, weather events, or natural phenomenon.



IMPORTANT: Format your response using proper Markdown syntax with the following guidelines:
1. Use # for main heading (title)
2. Use ## for section headings (e.g., "Trends", "Recent Events", "Key Factors")
3. Use bullet points with * for lists
4. Use **bold** for important facts and figures
5. Use tables for comparative data when appropriate
6. Include a "Summary" section at the top with key findings
7. Use blockquotes (>) for highlighting important insights

Your final analysis should be well-structured, including proper headings, paragraphs, and formatting.
`;
  return prompt;
}

async function fetchAnalysis(prompt) {
  const perplexityKey = import.meta.env.PUBLIC_PERPLEXITY_API_KEY;
  const perplexityResponse = await fetch(
    "https://api.perplexity.ai/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${perplexityKey}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content:
              "Provide only the final answer. It is important that you do not include any explanation on the steps below.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        frequency_penalty: 1,
        temperature: 0.2,
        search_recency_filter: "month",
        max_tokens: 1000,
      }),
    },
  );
  const perplexityAnalysis = await perplexityResponse.json();

  const citations = perplexityAnalysis.citations;
  const markdown = perplexityAnalysis.choices[0].message.content;
  return { markdown, citations };
}

export async function analyzeItemPrices(item, useAnthropic = true) {
  // Only use cache if enabled via environment variable.
  if (import.meta.env.PUBLIC_CACHE_AI_RESPONSE) {
    const cached = await getCachedAnalysis(item.dataKey);
    if (cached) {
      console.log(`Using cached analysis for ${item.name}`);
      return cached;
    }
  }

  try {
    // Fetch all required data in parallel.
    const [nationalData, historyData, regionalData] = await Promise.all([
      fetchLatestItemData("national", item.dataKey),
      fetchItemHistory("national", item.dataKey),
      // Promise.all(
      //   ["northeast", "midwest", "south", "west"].map(async (region) => ({
      //     region,
      //     ...(await fetchLatestItemData(region, item.dataKey)),
      //   })),
      // ),
    ]);

    const prompt = generatePrompt(
      item.name,
      nationalData,
      historyData,
      regionalData,
    );

    let analysis;
    let citations;
    try {
      const result = await fetchAnalysis(prompt);
      // result contains { markdown, citations }
      analysis = result.markdown;
      citations = result.citations;
      console.log(analysis);
      console.log(citations);
      // Cache the analysis if in development.
      if (import.meta.env.DEV) {
        await cacheAnalysis(
          item.dataKey,
          analysis,
          citations,
          prompt,
          "perplexity",
        );
      }
    } catch (error) {
      console.error(`Analysis failed for ${item.name}:`, error);
      throw error;
    }
    const timestamp = Date.now();
    // console.log("Returning analysis", analysis);
    // console.log("Returning citations", citations);
    // Return the analysis result with the same structure as cachedAnalysis.
    return { data: analysis, citations, timestamp };
  } catch (error) {
    console.error(`Error analyzing prices for ${item.name}:`, error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
}
