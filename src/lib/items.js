export const allItems = {
  // Staples
  eggs: {
    name: "Eggs",
    dataKey: "eggs", // matches the key in priceData.current
    icon: "🐣",
    unit: "dozen",
    bgColor: "bg-yellow-50",
    lineColor: "#8884d8",
  },
  milk: {
    name: "Milk",
    dataKey: "milk",
    icon: "🥛",
    unit: "gallon",
    bgColor: "bg-blue-50",
    lineColor: "#82ca9d",
  },
  bread: {
    name: "Bread",
    dataKey: "bread",
    icon: "🥖",
    unit: "loaf",
    bgColor: "bg-amber-50",
    lineColor: "#ffc658",
  },
  gas: {
    name: "Gas",
    dataKey: "gas",
    icon: "⛽️",
    unit: "gallon",
    bgColor: "bg-red-50",
    lineColor: "#ff7300",
  },

  // Meats
  bacon: {
    name: "Bacon",
    dataKey: "bacon",
    icon: "🥓",
    unit: "pound",
    bgColor: "bg-rose-50",
    lineColor: "#e11d48",
  },
  chicken: {
    name: "Chicken",
    dataKey: "chicken",
    icon: "🐔",
    unit: "pound",
    bgColor: "bg-orange-50",
    lineColor: "#ea580c",
  },

  // Produce
  bananas: {
    name: "Bananas",
    dataKey: "bananas",
    icon: "🍌",
    unit: "pound",
    bgColor: "bg-yellow-50",
    lineColor: "#eab308",
  },
  oranges: {
    name: "Oranges",
    dataKey: "oranges",
    icon: "🍊",
    unit: "pound",
    bgColor: "bg-orange-50",
    lineColor: "#f97316",
  },

  // Other
  coffee: {
    name: "Coffee",
    dataKey: "coffee",
    icon: "☕️",
    unit: "pound",
    bgColor: "bg-brown-50",
    lineColor: "#92400e",
  },
  electricity: {
    name: "Electricity",
    dataKey: "electricity",
    icon: "💡",
    unit: "KWH",
    bgColor: "bg-yellow-50",
    lineColor: "#facc15",
  },
};

// Create item groups for different pages
export const itemGroups = {
  breakfast: ["eggs", "milk", "bread", "coffee"],
  meats: ["bacon", "chicken"],
  produce: ["bananas", "oranges"],
  utilities: ["electricity", "gas"],
};

// Helper function to get items with prices
export function getItemsWithPrices(groupName, priceData) {
  const groupItems = itemGroups[groupName] || [];
  return groupItems.map((itemKey) => ({
    ...allItems[itemKey],
    price: priceData?.current?.[allItems[itemKey].dataKey],
  }));
}

export function getMeatItems(priceData) {
  const meatIds = ["chicken", "bacon"];
  return meatIds.map((id) => ({
    ...allItems[id],
    price: priceData?.current?.[allItems[id].dataKey],
  }));
}

export function getAllItems(priceData) {
  return Object.values(allItems).map((item) => ({
    ...item,
    price: priceData?.current?.[item.dataKey],
  }));
}

export function getProduceItems(priceData) {
  const produceIds = ["bananas", "oranges"];
  return produceIds.map((id) => ({
    ...allItems[id],
    price: priceData?.current?.[allItems[id].dataKey],
  }));
}

export function getUtilityItems(priceData) {
  const utilityIds = ["gas", "electricity"];
  return utilityIds.map((id) => ({
    ...allItems[id],
    price: priceData?.current?.[allItems[id].dataKey],
  }));
}
