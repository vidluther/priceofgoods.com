// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [react(), tailwind(), sitemap()],
  site: "https://priceofgoods.com",
  output: "static",
});
