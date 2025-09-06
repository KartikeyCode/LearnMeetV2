import kaplay from "kaplay";
import { determineWidthAndHeight } from "./utils";
const dimensions = determineWidthAndHeight();

const k = kaplay({
  width: dimensions.width,
  height: dimensions.height,
  letterbox: true,
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
