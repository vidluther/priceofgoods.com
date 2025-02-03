// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

import markdoc from "@astrojs/markdoc";

export default defineConfig({
  integrations: [react(), tailwind(), sitemap(), markdoc()],
  site: "https://www.priceofgoods.com",
  output: "static",
});
