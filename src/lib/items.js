// src/config/items.js
import {
  Egg,
  Milk,
  ShoppingBasket,
  Fuel,
  Beef,
  Drumstick,
  Coffee,
  Banana,
  Citrus,
  Zap,
} from "lucide-react";

export const allItems = {
  // Staples
  eggs: {
    name: "Eggs",
    dataKey: "eggs", // matches the key in priceData.current
    icon: Egg,
    unit: "dozen",
    bgColor: "bg-yellow-50",
    lineColor: "#8884d8",
  },
  milk: {
    name: "Milk",
    dataKey: "milk",
    icon: Milk,
    unit: "gallon",
    bgColor: "bg-blue-50",
    lineColor: "#82ca9d",
  },
  bread: {
    name: "Bread",
    dataKey: "bread",
    icon: ShoppingBasket,
    unit: "loaf",
    bgColor: "bg-amber-50",
    lineColor: "#ffc658",
  },
  gas: {
    name: "Gas",
    dataKey: "gas",
    icon: Fuel,
    unit: "gallon",
    bgColor: "bg-red-50",
    lineColor: "#ff7300",
  },

  // Meats
  bacon: {
    name: "Bacon",
    dataKey: "bacon",
    icon: Beef,
    unit: "pound",
    bgColor: "bg-rose-50",
    lineColor: "#e11d48",
  },
  chicken: {
    name: "Chicken",
    dataKey: "chicken",
    icon: Drumstick,
    unit: "pound",
    bgColor: "bg-orange-50",
    lineColor: "#ea580c",
  },

  // Produce
  bananas: {
    name: "Bananas",
    dataKey: "bananas",
    icon: Banana,
    unit: "pound",
    bgColor: "bg-yellow-50",
    lineColor: "#eab308",
  },
  oranges: {
    name: "Oranges",
    dataKey: "oranges",
    icon: Citrus,
    unit: "pound",
    bgColor: "bg-orange-50",
    lineColor: "#f97316",
  },

  // Other
  coffee: {
    name: "Coffee",
    dataKey: "coffee",
    icon: Coffee,
    unit: "pound",
    bgColor: "bg-brown-50",
    lineColor: "#92400e",
  },
  electricity: {
    name: "Electricity",
    dataKey: "electricity",
    icon: Zap,
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
