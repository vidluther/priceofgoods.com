import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function PriceCard({ item, loading, error }) {
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

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${item.bgColor} shadow transition hover:shadow-lg`}
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl">{item.icon}</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500">per {item.unit}</p>
          </div>
        </div>
        <div className="mt-4">
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : error ? (
            <p className="text-red-500">Error loading price</p>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-900">
                ${item.price?.toFixed(2)}
              </p>
              {item.priceChange !== null && (
                <div className="mt-2 flex items-center">
                  {item.priceChange > 0 ? (
                    <TrendingUp
                      className={getChangeColor(item.priceChange)}
                      size={16}
                    />
                  ) : (
                    <TrendingDown
                      className={getChangeColor(item.priceChange)}
                      size={16}
                    />
                  )}
                  <span className={`ml-1 ${getChangeColor(item.priceChange)}`}>
                    ${formatChange(item.priceChange)} (
                    {formatChange(item.percentChange)}%)
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="absolute right-4 bottom-4 opacity-10">
        <span className="text-6xl">{item.icon}</span>
      </div>
    </div>
  );
}
