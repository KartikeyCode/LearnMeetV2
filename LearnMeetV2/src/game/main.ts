import { createKaplayInstance } from "./kaplayCtx";
import { createHubScene } from "./scenes/hub"; // Correctly import the scene creation function
import { colyseusSDK } from "../core/colyseus"; // Assuming this is where you initialize the Colyseus client
import type { MyRoomState } from "../../../server/src/rooms/schema/MyRoomState";

// Initialize Kaplay
const k = createKaplayInstance();

// Set background color
k.setBackground(k.Color.fromHex("#54713E"));

// Define the "hub" scene by calling the function you created
createHubScene(k);

// Main function to connect to the server and start the game
async function main() {
  // 1. Display a loading message while connecting
  const connectingText = k.add([
    k.text("Connecting to server..."),
    k.pos(k.center()),
    k.anchor("center"),
  ]);

  try {
    // 2. Join or create a room on the Colyseus server
    const room = await colyseusSDK.joinOrCreate<MyRoomState>("my_room", {
      // You can pass options here, like the player's name
      username: "Player",
    });

    // 3. Once connected, transition to the "hub" scene, passing the room object
    k.go("hub", room);
  } catch (e) {
    // Handle connection errors
    connectingText.text = "Failed to connect to the server.";
    console.error("Connection failed:", e);
  }
}

// Start the main process
main();
