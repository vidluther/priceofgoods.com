export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const date = new Date(label + "-01");
    const isMobile = false;

    return (
      <div className="bg-white p-2 sm:p-4 border border-gray-200 shadow-lg rounded-lg max-w-[200px] sm:max-w-none">
        <p className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
          {date.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="space-y-1">
          {payload.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              style={{ color: item.color }}
            >
              <div
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium">{item.name}:</span>
              <span className="font-normal">
                ${Number(item.value).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}
