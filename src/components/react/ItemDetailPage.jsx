import React, { useState, useEffect } from "react";
import * as Separator from "@radix-ui/react-separator";
import { TrendingDown, TrendingUp, MapPin } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { fetchLatestItemData, fetchItemHistory } from "../../lib/fetchUtils";

const regions = {
  national: { name: "National Average", color: "#1e40af" },
  northeast: { name: "Northeast", color: "#0891b2" },
  midwest: { name: "Midwest", color: "#15803d" },
  south: { name: "South", color: "#b45309" },
  west: { name: "West", color: "#7c3aed" },
};

const ItemDetailPage = ({ item }) => {
  const [currentPrices, setCurrentPrices] = useState({});
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch current prices for all regions
        const pricesPromises = Object.keys(regions).map(async (region) => {
          const data = await fetchLatestItemData(region, item.dataKey);
          return { region, data };
        });

        // Fetch historical data for all regions
        const historyPromises = Object.keys(regions).map(async (region) => {
          const data = await fetchItemHistory(region, item.dataKey);
          return { region, data };
        });

        // Wait for all data to be fetched
        const [priceResults, historyResults] = await Promise.all([
          Promise.all(pricesPromises),
          Promise.all(historyPromises),
        ]);

        // Process current prices
        const prices = priceResults.reduce((acc, { region, data }) => {
          if (data) {
            acc[region] = {
              current: parseFloat(data.value),
              priceChange: data.calculations?.net_changes["1"]
                ? parseFloat(data.calculations.net_changes["1"])
                : null,
              percentChange: data.calculations?.pct_changes["1"]
                ? parseFloat(data.calculations.pct_changes["1"])
                : null,
            };
          }
          return acc;
        }, {});

        // Process historical data
        let combinedHistory = [];
        historyResults.forEach(({ region, data }) => {
          data.forEach((entry) => {
            const month = `${entry.year}-${entry.period.substring(1)}`;
            const existingIndex = combinedHistory.findIndex(
              (e) => e.date === month,
            );

            if (existingIndex >= 0) {
              combinedHistory[existingIndex][region] = parseFloat(entry.value);
            } else {
              combinedHistory.push({
                date: month,
                [region]: parseFloat(entry.value),
              });
            }
          });
        });

        // Sort historical data by date and get last 24 months
        combinedHistory = combinedHistory
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-24);

        setCurrentPrices(prices);
        setHistoryData(combinedHistory);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [item]);

  const getChangeColor = (change) => {
    if (change > 0) return "text-red-600";
    if (change < 0) return "text-green-600";
    return "text-gray-600";
  };

  const formatChange = (change) => {
    if (change === null || change === undefined) return "";
    const prefix = change > 0 ? "+" : "";
    return `${prefix}${change.toFixed(2)}`;
  };

  const getChangeIndicator = (change) => {
    if (change > 0) return <TrendingUp className="text-red-600" size={20} />;
    if (change < 0)
      return <TrendingDown className="text-green-600" size={20} />;
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">Loading...</div>
    );
  }

  return (
    <div className="space-y-8">
      {/* National Price Section */}
      <div className={`${item.bgColor} rounded-lg shadow-lg overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">{item.icon}</span>
            <h1 className="text-2xl font-semibold">{item.name}</h1>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">
              ${currentPrices.national?.current.toFixed(2)}
            </span>
            <span className="text-gray-600">per {item.unit}</span>
          </div>
          {currentPrices.national?.percentChange !== null && (
            <div className="flex items-center gap-2 mt-2">
              {getChangeIndicator(currentPrices.national.percentChange)}
              <div className="flex flex-col">
                <span
                  className={getChangeColor(
                    currentPrices.national.percentChange,
                  )}
                >
                  ${formatChange(currentPrices.national.priceChange)} from last
                  month
                </span>
                <span
                  className={getChangeColor(
                    currentPrices.national.percentChange,
                  )}
                >
                  ({formatChange(currentPrices.national.percentChange)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator.Root className="h-px bg-gray-200 my-8" />

      {/* Regional Comparison */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">
          Regional Price Comparison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(regions)
            .filter(([key]) => key !== "national")
            .map(([region, info]) => (
              <div key={region} className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} style={{ color: info.color }} />
                  <span className="font-medium">{info.name}</span>
                </div>
                <div className="text-2xl font-bold">
                  ${currentPrices[region]?.current.toFixed(2)}
                </div>
                {currentPrices[region]?.percentChange !== null && (
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-1">
                      {getChangeIndicator(currentPrices[region].percentChange)}
                      <span
                        className={getChangeColor(
                          currentPrices[region].percentChange,
                        )}
                      >
                        ${formatChange(currentPrices[region].priceChange)}
                      </span>
                    </div>
                    <span
                      className={`${getChangeColor(currentPrices[region].percentChange)} text-sm`}
                    >
                      ({formatChange(currentPrices[region].percentChange)}%)
                    </span>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      <Separator.Root className="h-px bg-gray-200 my-8" />

      {/* Price History Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Price History by Region</h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(regions).map(([region, info]) => (
                <div key={region} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: info.color }}
                  />
                  <span className="text-sm text-gray-600">{info.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historyData}
                margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => {
                    const d = new Date(date + "-01");
                    return d.toLocaleDateString("en-US", {
                      month: "short",
                      year: "2-digit",
                    });
                  }}
                  height={50}
                  tick={{ fill: "#6B7280" }}
                />
                <YAxis
                  tickFormatter={(value) => `${value.toFixed(2)}`}
                  width={60}
                  tick={{ fill: "#6B7280" }}
                  label={{
                    value: `Price per ${item.unit}`,
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#6B7280", paddingRight: "10px" },
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const date = new Date(label + "-01");
                      return (
                        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded">
                          <p className="font-semibold mb-2">
                            {date.toLocaleDateString(undefined, {
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          <div className="flex flex-col gap-2">
                            {payload
                              .sort((a, b) => b.value - a.value) // Sort by value descending
                              .map((entry) => (
                                <div
                                  key={entry.name}
                                  className="flex items-center justify-between gap-4"
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-sm">
                                      {regions[entry.dataKey].name}:
                                    </span>
                                  </div>
                                  <span className="font-medium">
                                    ${Number(entry.value).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {Object.entries(regions).map(([region, info]) => (
                  <Line
                    key={region}
                    type="monotone"
                    dataKey={region}
                    name={info.name}
                    stroke={info.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
