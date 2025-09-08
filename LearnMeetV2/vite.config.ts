import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
const kaplayCongrats = () => {
  return {
    name: "vite-plugin-kaplay-hello",
    buildEnd() {
      const line = "---------------------------------------------------------";
      const msg = `🦖 Awesome pal! Send your game to us:\n\n💎 Discord: https://discord.com/invite/aQ6RuQm3TF \n💖 Donate to KAPLAY: https://opencollective.com/kaplay\n\ (you can disable this msg on vite.config)`;

      process.stdout.write(`\n${line}\n${msg}\n${line}\n`);
    },
  };
};

export default defineConfig({
  // index.html out file will start with a relative path for script
  base: "./",
  server: {
    port: 3001,
  },
  build: {
    // disable this for low bundle sizes
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        game: resolve(__dirname, "game.html"), // Assuming game.html is in the root
      },
      output: {
        manualChunks: {
          kaplay: ["kaplay"],
        },
      },
    },
  },
  plugins: [
    // Disable messages removing this line
    kaplayCongrats(),
    tailwindcss(),
  ],
});
