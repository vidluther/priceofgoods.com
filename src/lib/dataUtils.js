// src/lib/dataUtils.js
import {
  fetchLatestItemData,
  fetchItemHistory,
  fetchGoodsConfig,
} from "./fetchUtils";

const regions = {
  national: { name: "National Average", color: "#1e40af" },
  northeast: { name: "Northeast", color: "#0891b2" },
  midwest: { name: "Midwest", color: "#15803d" },
  south: { name: "South", color: "#b45309" },
  west: { name: "West", color: "#7c3aed" },
};

export { regions };

const DEFAULT_PRICE_DATA = {
  current: 0,
  priceChange: null,
  percentChange: null,
};

export async function processItemData(itemKey) {
  try {
    console.log("Proccessing item:", itemKey);
    // Fetch all regional data in parallel
    const [currentPrices, historicalData] = await Promise.all([
      Promise.all(
        Object.keys(regions).map(async (region) => {
          try {
            const data = await fetchLatestItemData(region, itemKey);
            if (!data) {
              console.warn(`No current price data for ${region}/${itemKey}`);
              return { region, ...DEFAULT_PRICE_DATA };
            }
            return {
              region,
              current: data.value ? parseFloat(data.value) : 0,
              priceChange: data.calculations?.net_changes?.["1"]
                ? parseFloat(data.calculations.net_changes["1"])
                : null,
              percentChange: data.calculations?.pct_changes?.["1"]
                ? parseFloat(data.calculations.pct_changes["1"])
                : null,
            };
          } catch (error) {
            console.error(
              `Error fetching current price for ${region}/${itemKey}:`,
              error,
            );
            return { region, ...DEFAULT_PRICE_DATA };
          }
        }),
      ),
      Promise.all(
        Object.keys(regions).map(async (region) => {
          try {
            const data = await fetchItemHistory(region, itemKey);
            if (!data || !Array.isArray(data)) {
              console.warn(`No historical data for ${region}/${itemKey}`);
              return { region, data: [] };
            }
            return { region, data };
          } catch (error) {
            console.error(
              `Error fetching history for ${region}/${itemKey}:`,
              error,
            );
            return { region, data: [] };
          }
        }),
      ),
    ]);

    // Process current prices
    const prices = currentPrices.reduce((acc, data) => {
      acc[data.region] = {
        current: data.current,
        priceChange: data.priceChange,
        percentChange: data.percentChange,
      };
      return acc;
    }, {});

    // Process historical data
    let history = [];
    historicalData.forEach(({ region, data }) => {
      if (!data) return;

      data.forEach((entry) => {
        if (!entry?.year || !entry?.period || !entry?.value) return;

        const month = `${entry.year}-${entry.period.substring(1)}`;
        const existingIndex = history.findIndex((e) => e.date === month);

        if (existingIndex >= 0) {
          history[existingIndex][region] = parseFloat(entry.value) || 0;
        } else {
          history.push({
            date: month,
            [region]: parseFloat(entry.value) || 0,
          });
        }
      });
    });

    // Sort and limit history to last 24 months
    history = history
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-24);

    // Ensure all regions have data for all dates
    history = history.map((entry) => {
      const filledEntry = { ...entry };
      Object.keys(regions).forEach((region) => {
        if (!(region in filledEntry)) {
          filledEntry[region] = 0;
        }
      });
      return filledEntry;
    });

    return {
      currentPrices: prices,
      history: history.length > 0 ? history : [],
    };
  } catch (error) {
    console.error("Error processing item data:", error);
    // Return a safe default structure
    const defaultPrices = Object.keys(regions).reduce((acc, region) => {
      acc[region] = DEFAULT_PRICE_DATA;
      return acc;
    }, {});

    return {
      currentPrices: defaultPrices,
      history: [],
    };
  }
}
