import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip.jsx";
import { fetchItemHistory } from "../../lib/fetchUtils";

export default function PriceChart({ itemKey, item }) {
  const [timeRange, setTimeRange] = useState("4y");
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await fetchItemHistory("national", itemKey);
        // Transform the data for the chart
        const formattedData = data.map((entry) => ({
          month: `${entry.year}-${entry.period.substring(1)}`, // Convert M11 to 11
          [item.name.toLowerCase()]: parseFloat(entry.value),
        }));
        // Sort by date
        formattedData.sort((a, b) => new Date(a.month) - new Date(b.month));
        setHistoryData(formattedData);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    }

    if (itemKey) {
      fetchHistory();
    }
  }, [itemKey, item.name]);

  const getFilteredData = () => {
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
        filterDate.setFullYear(now.getFullYear() - 4);
    }

    return historyData.filter((dataPoint) => {
      const itemDate = new Date(dataPoint.month + "-01");
      return itemDate >= filterDate;
    });
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p className="text-gray-500">Loading price history...</p>
      </div>
    );
  }

  const filteredData = getFilteredData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1y">Last Year</option>
          <option value="4y">Last 4 Years</option>
          <option value="10y">Last 10 Years</option>
        </select>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(tick) => {
                const date = new Date(tick + "-01");
                return date.toLocaleDateString(undefined, {
                  month: "short",
                  year: "2-digit",
                });
              }}
              tick={{ fontSize: 12 }}
              angle={0}
              textAnchor="middle"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={item.name.toLowerCase()}
              stroke={item.lineColor}
              name={item.name}
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
