import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ItemDetailPage = ({ item, currentPrices, historyData, aiAnalysis }) => {
  const formatPrice = (price) => {
    return typeof price === "number" ? `$${price.toFixed(2)}` : "N/A";
  };

  const formatChange = (change) => {
    if (typeof change !== "number") return "";
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const getChangeIcon = (change) => {
    if (typeof change !== "number") return null;
    return change > 0 ? (
      <TrendingUp className="text-red-500 w-6 h-6" />
    ) : (
      <TrendingDown className="text-green-500 w-6 h-6" />
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <h1 className="text-4xl font-bold mb-2">The Price of {item.name}</h1>
      <p className="text-gray-600 mb-8">
        As of {currentPrices?.national?.latestDate}
      </p>

      {/* Price Display */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-5xl font-bold">
          {formatPrice(currentPrices?.national?.current)}
        </span>
        <span className="text-gray-600">per {item.unit}</span>
      </div>

      {/* Price Change */}
      <div className="flex items-center gap-2 mb-8">
        {getChangeIcon(currentPrices?.national?.percentChange)}
        <span
          className={`text-lg ${
            currentPrices?.national?.percentChange > 0
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
          {formatChange(currentPrices?.national?.percentChange)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price History Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Price History</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
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
                />
                <YAxis
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
                  labelFormatter={(label) => {
                    const date = new Date(label + "-01");
                    return date.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    });
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="national"
                  stroke="#1e40af"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Price Comparison */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Regional Price Comparison
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Northeast</h3>
              <div className="text-2xl font-bold mt-2">
                {formatPrice(currentPrices?.northeast?.current)}
              </div>
              {currentPrices?.northeast?.percentChange && (
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(currentPrices.northeast.percentChange)}
                  <span
                    className={
                      currentPrices.northeast.percentChange > 0
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {formatChange(currentPrices.northeast.percentChange)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Midwest</h3>
              <div className="text-2xl font-bold mt-2">
                {formatPrice(currentPrices?.midwest?.current)}
              </div>
              {currentPrices?.midwest?.percentChange && (
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(currentPrices.midwest.percentChange)}
                  <span
                    className={
                      currentPrices.midwest.percentChange > 0
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {formatChange(currentPrices.midwest.percentChange)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">South</h3>
              <div className="text-2xl font-bold mt-2">
                {formatPrice(currentPrices?.south?.current)}
              </div>
              {currentPrices?.south?.percentChange && (
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(currentPrices.south.percentChange)}
                  <span
                    className={
                      currentPrices.south.percentChange > 0
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {formatChange(currentPrices.south.percentChange)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">West</h3>
              <div className="text-2xl font-bold mt-2">
                {formatPrice(currentPrices?.west?.current)}
              </div>
              {currentPrices?.west?.percentChange && (
                <div className="flex items-center gap-1 mt-1">
                  {getChangeIcon(currentPrices.west.percentChange)}
                  <span
                    className={
                      currentPrices.west.percentChange > 0
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {formatChange(currentPrices.west.percentChange)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Market Analysis Section */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-600">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl bg-blue-100 p-2 rounded-full">🤖</span>
          <h2 className="text-2xl font-semibold text-blue-900">Market Analysis</h2>
        </div>
        <div className="prose prose-lg max-w-none">
          {aiAnalysis ? (
            <article className="markdown-body">
              <div 
                dangerouslySetInnerHTML={{ __html: aiAnalysis }} 
                className="prose-h1:text-2xl prose-h1:font-bold prose-h1:text-blue-900 prose-h1:mb-4 
                           prose-h2:text-xl prose-h2:font-semibold prose-h2:text-blue-800 prose-h2:mt-6 prose-h2:mb-3
                           prose-h3:text-lg prose-h3:font-medium prose-h3:text-blue-700 prose-h3:mt-5 prose-h3:mb-2
                           prose-p:text-gray-700 prose-p:my-3 prose-p:leading-relaxed
                           prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                           prose-strong:text-blue-700 prose-strong:font-semibold
                           prose-ul:my-4 prose-ul:pl-6 prose-li:text-gray-700 prose-li:my-1 prose-li:marker:text-blue-500
                           prose-ol:my-4 prose-ol:pl-6
                           prose-blockquote:border-l-4 prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:my-4 prose-blockquote:rounded-r prose-blockquote:italic prose-blockquote:text-gray-700
                           prose-code:bg-gray-100 prose-code:p-1 prose-code:rounded prose-code:text-blue-800 prose-code:text-sm
                           prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-md prose-pre:overflow-auto prose-pre:my-4
                           prose-table:border-collapse prose-table:w-full prose-table:my-4
                           prose-th:bg-blue-50 prose-th:p-2 prose-th:text-left prose-th:font-medium prose-th:border prose-th:border-gray-300
                           prose-td:border prose-td:p-2 prose-td:border-gray-200"
              />
            </article>
          ) : (
            <p className="text-gray-500 italic">Analysis not available for this item.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
