// src/pages/og-image/[category].png.ts
import type { APIRoute } from "astro";
import sharp from "sharp";
import { fetchGoodsConfig, fetchLatestItemData } from "../lib/fetchUtils";
import { slugify } from "../lib/stringUtilities";

export const GET: APIRoute = async ({ params }) => {
  const { category } = params;
  const goodsConfig = await fetchGoodsConfig();

  // Find the category data
  const categoryData = Object.values(goodsConfig.categories).find(
    (cat) => slugify(cat.name) === category,
  );

  if (!categoryData) {
    return new Response("Category not found", { status: 404 });
  }

  // Fetch latest prices for all items in category
  const pricePromises = Object.values(categoryData.items).map(async (item) => {
    const priceData = await fetchLatestItemData("national", item.dataKey);
    return {
      name: item.name,
      price: priceData ? parseFloat(priceData.value).toFixed(2) : "N/A",
      change: priceData?.calculations?.pct_changes["1"]
        ? parseFloat(priceData.calculations.pct_changes["1"]).toFixed(1)
        : "N/A",
    };
  });

  const prices = await Promise.all(pricePromises);

  // Create price list text
  const pricesList = prices
    .map(
      (item, idx) =>
        `<text x="60" y="${240 + idx * 50}" class="price-item">
        ${item.name}: $${item.price} (${item.change}%)
       </text>`,
    )
    .join("");

  const svg = `
    <svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;display=swap');
        .title { fill: #000; font-size: 48px; font-weight: bold; font-family: 'Inter', sans-serif; }
        .subtitle { fill: #666; font-size: 32px; font-family: 'Inter', sans-serif; }
        .price-item { fill: #333; font-size: 28px; font-family: 'Inter', sans-serif; }
        .site { fill: #4299E1; font-size: 24px; font-family: 'Inter', sans-serif; }
      </style>

      <rect width="1200" height="600" fill="#ffffff"/>
      <rect width="1200" height="5" fill="#4299E1" y="0"/>

      <text x="60" y="100" class="title">${categoryData.name} Prices</text>
      <text x="60" y="160" class="subtitle">Current prices and trends in the USA</text>

      ${pricesList}

      <text x="60" y="560" class="site">priceofgoods.com</text>
    </svg>
  `;

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(pngBuffer, {
    headers: { "Content-Type": "image/png" },
  });
};

export async function getStaticPaths() {
  const goodsConfig = await fetchGoodsConfig();

  return Object.values(goodsConfig.categories).map((category) => ({
    params: { category: slugify(category.name) },
  }));
}
