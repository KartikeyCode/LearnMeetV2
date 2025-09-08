import kaplay from "kaplay";
import { determineWidthAndHeight } from "../utils";

export const createKaplayInstance = () => {
  return kaplay({
    ...determineWidthAndHeight(),
    pixelDensity: Math.min(window.devicePixelRatio, 2),
    background: [0, 0, 0],
    global: true,
    buttons: {
      jump: {
        keyboard: ["space"],
      },
    },
    debug: true,
  });
};
