import React, { useEffect, useState } from "react";
import PriceCard from "./PriceCard";
import { fetchLatestItemData } from "../../lib/fetchUtils";
import { slugify } from "../../lib/stringUtilities";

export default function CategoryRow({ category, items }) {
  const [itemsWithPrices, setItemsWithPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const pricesPromises = Object.entries(items).map(
          async ([key, item]) => {
            // Fetch the latest price data for this item.
            const priceData = await fetchLatestItemData(
              "national",
              item.dataKey,
            );
            return {
              ...item,
              price: priceData ? parseFloat(priceData.value) : null,
              priceChange: priceData?.calculations?.net_changes["1"]
                ? parseFloat(priceData.calculations.net_changes["1"])
                : null,
              percentChange: priceData?.calculations?.pct_changes["1"]
                ? parseFloat(priceData.calculations.pct_changes["1"])
                : null,
              // Extract the latest period info. If your API returns the full JSON with a data array,
              // use: priceData && priceData.data && priceData.data[0] ? `${priceData.data[0].periodName} ${priceData.data[0].year}` : null
              latestDate: priceData
                ? `${priceData.periodName} ${priceData.year}`
                : null,
            };
          },
        );

        const itemsData = await Promise.all(pricesPromises);
        console.log(itemsData);
        setItemsWithPrices(itemsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prices:", error);
        setLoading(false);
      }
    }

    fetchPrices();
  }, [items]);

  if (!category || !items) {
    return null;
  }

  // Here we assume that all items in the row share the same "latestDate".
  // If not, you might want to handle this differently.
  const pricesAsOf = itemsWithPrices[0]?.latestDate || "N/A";
  const categorySlug = slugify(category);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        <a
          href={`/${categorySlug}`}
          className="hover:text-gray-600 transition-colors"
        >
          {category}
        </a>
      </h2>
      <div className="border-t border-gray-200 mb-6">
        Prices As Of: {loading ? "Loading..." : pricesAsOf}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {itemsWithPrices.map((item) => (
          <PriceCard
            key={item.dataKey}
            item={item}
            loading={loading}
            error={!item.price && !loading}
          />
        ))}
      </div>
    </div>
  );
}
