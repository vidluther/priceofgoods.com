import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PriceHistoryChart = React.memo(({ item, historyData, regions }) => {
  const CustomTooltip = React.useCallback(
    ({ active, payload, label }) => {
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
                .sort((a, b) => b.value - a.value)
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
                        {regions[entry.dataKey].name}
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
    },
    [regions],
  );

  // Memoize the legend elements
  const legendContent = useMemo(
    () => (
      <div className="flex flex-wrap gap-4 mb-6">
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
    ),
    [regions],
  );

  // Memoize the chart lines
  const chartLines = useMemo(
    () =>
      Object.entries(regions).map(([region, info]) => (
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
      )),
    [regions],
  );

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Price History by Region</h2>
      {legendContent}
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
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              width={60}
              tick={{ fill: "#6B7280" }}
              label={{
                value: `Price per ${item.unit}`,
                angle: -90,
                position: "insideLeft",
                style: { fill: "#6B7280", paddingRight: "10px" },
              }}
            />
            <Tooltip content={CustomTooltip} />
            {chartLines}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

PriceHistoryChart.displayName = "PriceHistoryChart";

export default PriceHistoryChart;
