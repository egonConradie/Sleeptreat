import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "index.html"),
        shop: resolve(import.meta.dirname, "shop.html"),
        ingredients: resolve(import.meta.dirname, "ingredients.html"),
        gallery: resolve(import.meta.dirname, "gallery.html"),
        meetUs: resolve(import.meta.dirname, "meet-us.html"),
        contact: resolve(import.meta.dirname, "contact.html")
      }
    }
  }
});
