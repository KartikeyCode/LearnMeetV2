import { Room, Client } from "colyseus";
import { RoomState, Player } from "../schemas/RoomState";

export class GameRoom extends Room<RoomState> {
  maxClients = 10; // Or any number you prefer for your hub

  onCreate(options: any) {
    this.setState(new RoomState());

    // Handle player movement messages
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = data.x;
        player.y = data.y;
      }
    });

    // Handle animation changes
    this.onMessage("anim", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.anim = data.anim;
        player.flipX = data.flipX;
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const player = new Player();
    // You'll set the initial position based on your map data logic
    // For now, let's set a default
    player.x = 400;
    player.y = 400;
    player.name = options.name || "Guest"; // You can pass player name on join

    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
