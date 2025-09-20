import { Schema, MapSchema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") username: string = "";
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("string") anim: string = "idle_down";
  @type("boolean") flipX: boolean = false;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
