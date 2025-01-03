import { useState } from "react";
import PriceCard from "./components/PriceCard";
import PriceChart from "./components/PriceChart";
import { pullData } from "../../lib/pulldata";
import { getItemsWithPrices, itemGroups } from "../../lib/items";

export default function Homepage() {
  const { priceData, loading, error } = pullData();
  const [timeRange, setTimeRange] = useState("4y");

  const [selectedGroup, setSelectedGroup] = useState("breakfast");
  // Get items based on selected group
  const items = getItemsWithPrices(selectedGroup, priceData);

  // Create an array of group options for the dropdown
  const groupOptions = Object.keys(itemGroups).map((key) => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  const getFilteredData = () => {
    if (!priceData?.historical) return [];

    const now = new Date();
    let filterDate = new Date();

    switch (timeRange) {
      case "1y":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      case "4y":
        filterDate.setFullYear(now.getFullYear() - 4);
        break;
      case "10y":
        filterDate.setFullYear(now.getFullYear() - 10);
        break;
      default:
        filterDate.setFullYear(now.getFullYear() - 1);
    }

    return priceData.historical.filter((item) => {
      const itemDate = new Date(item.month + "-01");
      return itemDate >= filterDate;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            priceofgoods
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Current price of Goods in the USA 🇺🇸
          </p>
          {priceData?.metadata?.lastUpdated && (
            <p className="mt-2 text-sm text-gray-500">
              Data Last Updated On:{" "}
              {new Date(priceData.metadata.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Add group selector */}
        <div className="mt-8 flex justify-center">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {groupOptions.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <PriceCard
                key={item.name}
                item={item}
                loading={loading}
                error={error}
              />
            ))}
          </div>
        </div>

        <div className="mt-12">
          <PriceChart
            data={getFilteredData()}
            items={items}
            loading={loading}
            error={error}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </div>
      </div>
    </div>
  );
}
