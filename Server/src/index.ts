import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
import { GameRoom } from "./rooms/HubRoom";

const port = Number(process.env.PORT || 2567);
const app = express();
app.use(express.json());

const gameServer = new Server({
  server: createServer(app),
});

// Register your room
gameServer.define("hub_room", GameRoom);

gameServer.listen(port);
console.log(`Server is listening on port ${port}`);
