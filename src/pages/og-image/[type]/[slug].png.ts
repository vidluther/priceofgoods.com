// src/pages/og-image/[type]/[slug].png.ts
import type { APIRoute } from "astro";
import sharp from "sharp";
import { fetchGoodsConfig } from "../../../lib/fetchUtils";
import { processItemData } from "../../../lib/dataUtils";
import { slugify } from "../../../lib/stringUtilities";

interface Props {
  params: {
    type: string;
    slug: string;
  };
}

export async function getStaticPaths() {
  const goodsConfig = await fetchGoodsConfig();
  const paths = [];

  // Add category paths
  for (const category of Object.values(goodsConfig.categories)) {
    paths.push({
      params: {
        type: "categories",
        slug: slugify(category.name),
      },
    });

    // Add item paths for this category
    for (const item of Object.values(category.items)) {
      paths.push({
        params: {
          type: "items",
          slug: item.dataKey,
        },
      });
    }
  }

  return paths;
}

async function generateCategoryImage(category) {
  try {
    console.log(`Generating image for category: ${category.name}`);

    const pricePromises = Object.values(category.items).map(async (item) => {
      try {
        const itemData = await processItemData(item.dataKey);
        console.log(
          `Data for ${item.name}:`,
          itemData?.currentPrices?.national,
        );

        const priceValue = itemData?.currentPrices?.national?.current;
        const percentChange = itemData?.currentPrices?.national?.percentChange;

        return {
          name: item.name,
          price: typeof priceValue === "number" ? priceValue.toFixed(2) : "N/A",
          change:
            typeof percentChange === "number"
              ? percentChange.toFixed(1)
              : "N/A",
        };
      } catch (error) {
        console.error(`Error processing data for ${item.name}:`, error);
        return { name: item.name, price: "N/A", change: "N/A" };
      }
    });

    const prices = await Promise.all(pricePromises);
    console.log(`Processed prices for ${category.name}:`, prices);

    const pricesList = prices
      .map((item, idx) => {
        const changeDisplay = item.change === "N/A" ? "" : ` (${item.change}%)`;
        const priceDisplay =
          item.price === "N/A" ? "Price unavailable" : `$${item.price}`;
        return `<text x="60" y="${240 + idx * 50}" class="price-item">
          ${item.name}: ${priceDisplay}${changeDisplay}
        </text>`;
      })
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

        <text x="60" y="100" class="title">${category.name} Prices</text>
        <text x="60" y="160" class="subtitle">Current prices and trends in the USA</text>

        ${pricesList}

        <text x="60" y="560" class="site">priceofgoods.com</text>
      </svg>
    `;

    console.log(`Generated SVG for ${category.name}`);
    return svg;
  } catch (error) {
    console.error("Error in generateCategoryImage:", error);
    return createErrorSvg(
      `Unable to load ${category.name} prices: ${error.message}`,
    );
  }
}

function createErrorSvg(message = "Data temporarily unavailable") {
  return `
    <svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;display=swap');
        .message { fill: #666; font-size: 24px; font-family: 'Inter', sans-serif; }
      </style>
      <rect width="1200" height="600" fill="#ffffff"/>
      <text x="60" y="300" class="message">${message}</text>
    </svg>
  `;
}

async function generateItemImage(item, categoryName, itemData) {
  try {
    // Validate current price data
    const currentPrice = itemData?.currentPrices?.national;
    if (!currentPrice?.current) {
      throw new Error(`Missing price data for ${item.name}`);
    }

    const priceValue = Number(currentPrice.current);
    const percentChange = Number(currentPrice.percentChange || 0);

    if (isNaN(priceValue)) {
      throw new Error(`Invalid price value for ${item.name}`);
    }

    // Historical data is now optional
    const recentHistory = (itemData?.history?.national || []).slice(-12);
    const hasValidHistory =
      recentHistory.length > 0 &&
      recentHistory.some((d) => !isNaN(Number(d?.current)));

    let sparklineGroup = "";

    if (hasValidHistory) {
      const validPrices = recentHistory.filter(
        (d) => !isNaN(Number(d?.current)),
      );
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
            ((Number(point.current) - minPrice) / (maxPrice - minPrice)) *
              height;
          return `${x},${y}`;
        })
        .join(" ");

      sparklineGroup = `
        <g transform="translate(700, 250)">
          <text x="0" y="-20" class="trend-label">12 Month Trend</text>
          <polyline
            points="${points}"
            fill="none"
            stroke="#4299E1"
            stroke-width="3"
          />
        </g>
      `;
    }

    const changeColor = percentChange > 0 ? "#ef4444" : "#22c55e";

    return `
      <svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;display=swap');
          .title { fill: #000; font-size: 52px; font-weight: bold; font-family: 'Inter', sans-serif; }
          .category { fill: #666; font-size: 32px; font-family: 'Inter', sans-serif; }
          .price { fill: #000; font-size: 64px; font-weight: bold; font-family: 'Inter', sans-serif; }
          .unit { fill: #666; font-size: 24px; font-family: 'Inter', sans-serif; }
          .change { font-size: 32px; font-weight: bold; font-family: 'Inter', sans-serif; }
          .trend-label { fill: #666; font-size: 24px; font-family: 'Inter', sans-serif; }
          .site { fill: #4299E1; font-size: 24px; font-family: 'Inter', sans-serif; }
        </style>

        <rect width="1200" height="600" fill="#ffffff"/>
        <rect width="1200" height="5" fill="#4299E1" y="0"/>

        <text x="60" y="100" class="title">${item.name}</text>
        <text x="60" y="150" class="category">${categoryName}</text>
        <text x="60" y="280" class="price">$${priceValue.toFixed(2)}</text>
        <text x="60" y="320" class="unit">per ${item.unit}</text>
        <text x="60" y="380" class="change" fill="${changeColor}">
          ${percentChange.toFixed(1)}% ${percentChange > 0 ? "↑" : "↓"}
        </text>

        ${sparklineGroup}

        <text x="60" y="560" class="site">priceofgoods.com</text>
      </svg>
    `;
  } catch (error) {
    console.error(`Error in generateItemImage for ${item.name}:`, error);
    return createErrorSvg(
      `Unable to load ${item.name} price data: ${error.message}`,
    );
  }
}

export const GET: APIRoute = async ({ params }: Props) => {
  try {
    const { type, slug } = params;
    if (!type || !slug) {
      throw new Error("Missing required parameters");
    }

    const goodsConfig = await fetchGoodsConfig();
    let svg;

    if (type === "categories") {
      const category = Object.values(goodsConfig.categories).find(
        (cat) => slugify(cat.name) === slug,
      );

      if (!category) {
        throw new Error("Category not found");
      }

      svg = await generateCategoryImage(category);
    } else if (type === "items") {
      let foundItem = null;
      let categoryName = "";

      for (const category of Object.values(goodsConfig.categories)) {
        for (const item of Object.values(category.items)) {
          if (item.dataKey === slug) {
            foundItem = item;
            categoryName = category.name;
            break;
          }
        }
        if (foundItem) break;
      }

      if (!foundItem) {
        throw new Error("Item not found");
      }

      const itemData = await processItemData(foundItem.dataKey);
      svg = await generateItemImage(foundItem, categoryName, itemData);
    } else {
      throw new Error("Invalid type");
    }

    // Ensure we always have valid SVG content
    if (!svg) {
      svg = createErrorSvg("Failed to generate image");
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
