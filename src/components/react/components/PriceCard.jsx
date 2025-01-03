// src/components/react/components/PriceCard.jsx
export default function PriceCard({ item, loading, error }) {
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
            <p className="text-3xl font-bold text-gray-900">
              ${item.price?.toFixed(2)}
            </p>
          )}
        </div>
      </div>
      <div className="absolute right-4 bottom-4 opacity-10">
        <span className="text-6xl">{item.icon}</span>
      </div>
    </div>
  );
}
