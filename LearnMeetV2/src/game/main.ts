import { createKaplayInstance } from "./kaplayCtx";
import Hub from "./scenes/hub";

// Initialize Kaplay
const k = createKaplayInstance();
//set bg
k.setBackground(k.Color.fromHex("#54713E"));
// Define Scenes
k.scene("hub", () => Hub(k));

// Start the game
k.go("hub");
