import kaplay from "kaplay";
import { determineWidthAndHeight } from "./utils";

const k = kaplay({
  ...determineWidthAndHeight(),
  pixelDensity: Math.min(window.devicePixelRatio, 2),
  background: [0, 0, 0],
  global: false,
  buttons: {
    jump: {
      keyboard: ["space"],
    },
  },
  debug: true,
});

export default k;
