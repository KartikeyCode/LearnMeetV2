import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 30;
  state = new MyRoomState();

  onCreate(options: any) {
    // Listen for player movement and animation updates from the client
    this.onMessage("update", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = data.x;
        player.y = data.y;
        player.anim = data.anim;
        player.flipX = data.flipX;
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    // Create a new player instance and add it to the state
    const player = new Player();

    // You can set a default spawn position or randomize it
    player.x = 500;
    player.y = 900;
    player.sessionId = client.sessionId;
    // Set the username from the options sent by the client
    // Provide a default name if one isn't given
    player.username = options.username || "Guest";

    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    // Remove player from the state when they disconnect
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId);
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
