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
import CustomTooltip from "./CustomToolTip.jsx";

export default function PriceChart({
  data,
  items,
  loading,
  error,
  timeRange,
  setTimeRange,
}) {
  const isMobile = false;

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Historical Price Trends
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="w-full sm:w-auto bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1y">Last Year</option>
          <option value="4y">Last 4 Years</option>
          <option value="10y">Last 10 Years</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Adjust height based on screen size */}
      <div className="h-[400px] sm:h-96">
        {loading ? (
          <div className="h-full w-full bg-gray-100 animate-pulse rounded" />
        ) : error ? (
          <div className="h-full w-full flex items-center justify-center text-red-500">
            Error loading price trends
          </div>
        ) : (
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
                    month: isMobile ? "numeric" : "short",
                    year: "2-digit",
                  });
                }}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 60 : 30}
              />
              <YAxis
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickFormatter={(value) => `$${value}`}
                width={isMobile ? 45 : 60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign={isMobile ? "bottom" : "top"}
                height={36}
                wrapperStyle={{
                  paddingTop: isMobile ? "20px" : "0px",
                  fontSize: isMobile ? "12px" : "14px",
                }}
              />
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
        )}
      </div>
    </div>
  );
}
