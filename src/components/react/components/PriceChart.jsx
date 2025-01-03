import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

export default function PriceChart({ data, items }) {
  const [timeRange, setTimeRange] = useState("4y");
  const item = items[0];

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

    return data.filter((item) => {
      const itemDate = new Date(item.month + "-01");
      return itemDate >= filterDate;
    });
  };

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
            data={data}
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
                // Use shorter format on mobile
                return date.toLocaleDateString(undefined, {
                  month: "short",
                  year: "2-digit",
                });
              }}
              tick={{ fontSize: 12 }}
              angle={0}
              textAnchor={"middle"}
              height={60}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />

            {items.map((item) => (
              <Line
                key={item.name.toLowerCase()}
                type="monotone"
                dataKey={item.name.toLowerCase()}
                stroke={item.lineColor}
                name={item.name}
                dot={false}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
