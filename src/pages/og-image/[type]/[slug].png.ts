// src/pages/og-image/[type]/[slug].png.ts
import type { APIRoute } from "astro";
import sharp from "sharp";
import { fetchGoodsConfig } from "../../../lib/fetchUtils";
import { processItemData } from "../../../lib/dataUtils";
import { slugify } from "../../../lib/stringUtilities";

// Shared styles with consistent sizes
const styles = {
  base: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;display=swap');
    .title { fill: #000; font-size: 64px; font-weight: bold; font-family: 'Inter', sans-serif; }
    .subtitle { fill: #666; font-size: 32px; font-family: 'Inter', sans-serif; }
    .price-item { fill: #333; font-size: 28px; font-family: 'Inter', sans-serif; }
    .category-name { fill: #4299E1; font-size: 24px; font-weight: bold; font-family: 'Inter', sans-serif; }
    .site { fill: #4299E1; font-size: 24px; font-family: 'Inter', sans-serif; }
    .data-source { fill: #666; font-size: 24px; font-family: 'Inter', sans-serif; }
  `,
  item: `
    .price { fill: #000; font-size: 96px; font-weight: bold; font-family: 'Inter', sans-serif; }
    .unit { fill: #666; font-size: 32px; font-family: 'Inter', sans-serif; }
    .change { font-size: 48px; font-weight: bold; font-family: 'Inter', sans-serif; }
    .trend-label { fill: #666; font-size: 32px; font-family: 'Inter', sans-serif; }
  `,
};

// Helper functions
function createSvgWrapper(content: string, additionalStyles = "") {
  return `
    <svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
      <style>${styles.base}${additionalStyles}</style>
      <rect width="1200" height="600" fill="#ffffff"/>
      <rect width="1200" height="5" fill="#4299E1" y="0"/>
      ${content}
    </svg>
  `;
}

function formatPriceChange(change: string | number, includeParens = true) {
  if (change === "N/A") return "";
  const numChange = Number(change);
  const symbol = numChange > 0 ? "▲" : "▼";
  const formatted = `${symbol} ${Math.abs(numChange).toFixed(1)}%`;
  return includeParens ? ` (${formatted})` : formatted;
}

function formatPrice(price: string | number) {
  return price === "N/A" ? "Data pending" : `$${Number(price).toFixed(2)}`;
}

function createFooter(type: "home" | "category" | "item", date?: string) {
  const secondPart =
    type === "home"
      ? "Updated monthly"
      : type === "category"
        ? "BLS Data"
        : `Updated ${date}`;
  return `
    <text x="60" y="560" class="site">priceofgoods.com</text>
    <text x="280" y="560" class="data-source">${secondPart}</text>
  `;
}

// Main image generators
async function generateHomeImage(goodsConfig) {
  try {
    const highlights = await Promise.all(
      Object.values(goodsConfig.categories).map(async (category) => {
        const item = Object.values(category.items)[0];
        try {
          const itemData = await processItemData(item.dataKey);
          return {
            category: category.name,
            item: item.name,
            price: itemData?.currentPrices?.national?.current ?? "N/A",
            change: itemData?.currentPrices?.national?.percentChange ?? "N/A",
          };
        } catch (error) {
          console.error(`Error processing data for ${item.name}:`, error);
          return {
            category: category.name,
            item: item.name,
            price: "N/A",
            change: "N/A",
          };
        }
      }),
    );

    const pricesList = highlights
      .map(
        (highlight, idx) => `
        <text x="60" y="${200 + idx * 80}" class="category-name">${highlight.category}</text>
        <text x="60" y="${230 + idx * 80}" class="price-item">
          ${highlight.item}: ${highlight.price === "N/A" ? "Data pending BLS updates" : formatPrice(highlight.price)}${formatPriceChange(highlight.change)}
        </text>
      `,
      )
      .join("");

    return createSvgWrapper(`
      <text x="60" y="100" class="title">Price of Goods: US Averages at a Glance</text>
      <text x="60" y="160" class="subtitle">Latest BLS Data on Essential Items</text>
      ${pricesList}
      ${createFooter("home")}
    `);
  } catch (error) {
    console.error("Error in generateHomeImage:", error);
    return createErrorSvg(`Unable to load prices overview: ${error.message}`);
  }
}

async function generateCategoryImage(category) {
  try {
    const prices = await Promise.all(
      Object.values(category.items).map(async (item) => {
        try {
          const itemData = await processItemData(item.dataKey);
          return {
            name: item.name,
            price: itemData?.currentPrices?.national?.current ?? "N/A",
            change: itemData?.currentPrices?.national?.percentChange ?? "N/A",
          };
        } catch (error) {
          console.error(`Error processing data for ${item.name}:`, error);
          return { name: item.name, price: "N/A", change: "N/A" };
        }
      }),
    );

    const pricesList = prices
      .map(
        (item, idx) => `
        <text x="60" y="${240 + idx * 50}" class="price-item">
          ${item.name}: ${formatPrice(item.price)}${formatPriceChange(item.change)}
        </text>
      `,
      )
      .join("");

    return createSvgWrapper(`
      <text x="60" y="100" class="title">${category.name} Prices</text>
      <text x="60" y="160" class="subtitle">Tracking Monthly Changes in the US</text>
      ${pricesList}
      ${createFooter("category")}
    `);
  } catch (error) {
    console.error("Error in generateCategoryImage:", error);
    return createErrorSvg(
      `Unable to load ${category.name} prices: ${error.message}`,
    );
  }
}

async function generateSparkline(history) {
  if (!history?.length) return "";
  const validPrices = history.filter((d) => !isNaN(Number(d?.current)));
  if (!validPrices.length) return "";

  const values = validPrices.map((d) => Number(d.current));
  const minPrice = Math.min(...values);
  const maxPrice = Math.max(...values);
  const width = 300;
  const height = 50;

  const points = validPrices
    .map((point, index) => {
      const x = (index / (validPrices.length - 1)) * width;
      const y =
        height -
        ((Number(point.current) - minPrice) / (maxPrice - minPrice)) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return `
    <g transform="translate(700, 250)">
      <text x="0" y="-20" class="trend-label">12 Month Trend</text>
      <polyline points="${points}" fill="none" stroke="#4299E1" stroke-width="3"/>
    </g>
  `;
}

async function generateItemImage(item, categoryName, itemData) {
  try {
    const currentPrice = itemData?.currentPrices?.national;
    if (!currentPrice?.current || isNaN(Number(currentPrice.current))) {
      throw new Error(`Invalid or missing price data for ${item.name}`);
    }

    const priceValue = Number(currentPrice.current);
    const percentChange = Number(currentPrice.percentChange || 0);
    const sparklineGroup = await generateSparkline(
      itemData?.history?.national?.slice(-12),
    );
    const changeColor = percentChange > 0 ? "#ef4444" : "#22c55e";
    const dateString = new Date().toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    return createSvgWrapper(
      `
      <text x="60" y="120" class="title">${item.name}</text>
      <text x="60" y="180" class="subtitle">National Average Price (BLS)</text>

      <text x="60" y="320" class="price">${formatPrice(priceValue)}</text>
      <text x="60" y="370" class="unit">per ${item.unit}</text>

      <text x="60" y="440" class="change" fill="${changeColor}">
        Change: ${formatPriceChange(percentChange, false)}
      </text>
      <text x="60" y="485" class="trend-label">Year-over-year</text>

      ${sparklineGroup}
      ${createFooter("item", dateString)}
    `,
      styles.item,
    );
  } catch (error) {
    console.error(`Error in generateItemImage for ${item.name}:`, error);
    return createErrorSvg(
      `Unable to load ${item.name} price data: ${error.message}`,
    );
  }
}

function createErrorSvg(message = "Data temporarily unavailable") {
  return createSvgWrapper(`
    <text x="60" y="300" class="message">${message}</text>
  `);
}

export async function getStaticPaths() {
  const goodsConfig = await fetchGoodsConfig();
  const paths = [
    { params: { type: "home", slug: "index" } },
    ...Object.values(goodsConfig.categories).flatMap((category) => [
      { params: { type: "categories", slug: slugify(category.name) } },
      ...Object.values(category.items).map((item) => ({
        params: { type: "items", slug: item.dataKey },
      })),
    ]),
  ];
  return paths;
}

export const GET: APIRoute = async ({ params }: Props) => {
  try {
    const { type, slug } = params;
    if (!type || !slug) throw new Error("Missing required parameters");

    const goodsConfig = await fetchGoodsConfig();
    let svg: string;

    if (type === "home" && slug === "index") {
      svg = await generateHomeImage(goodsConfig);
    } else if (type === "categories") {
      const category = Object.values(goodsConfig.categories).find(
        (cat) => slugify(cat.name) === slug,
      );
      if (!category) throw new Error("Category not found");
      svg = await generateCategoryImage(category);
    } else if (type === "items") {
      let foundItem, categoryName;
      for (const category of Object.values(goodsConfig.categories)) {
        const item = Object.values(category.items).find(
          (item) => item.dataKey === slug,
        );
        if (item) {
          foundItem = item;
          categoryName = category.name;
          break;
        }
      }
      if (!foundItem) throw new Error("Item not found");
      const itemData = await processItemData(foundItem.dataKey);
      svg = await generateItemImage(foundItem, categoryName, itemData);
    } else {
      throw new Error("Invalid type");
    }

    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
    return new Response(pngBuffer, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    const errorSvg = createErrorSvg("An error occurred");
    const pngBuffer = await sharp(Buffer.from(errorSvg)).png().toBuffer();
    return new Response(pngBuffer, {
      headers: { "Content-Type": "image/png" },
    });
  }
};
