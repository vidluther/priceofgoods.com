// src/components/react/components/CustomTooltip.jsx
export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const date = new Date(label + '-01');
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
        <p className="font-semibold mb-2">
          {date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </p>
        {payload.map((entry, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 text-sm"
            style={{ color: entry.color }}
          >
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }} 
            />
            <span className="font-medium">{entry.name}:</span>
            <span>${Number(entry.value).toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}