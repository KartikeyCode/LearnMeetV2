import { Schema, MapSchema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") name: string = "";
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("string") anim: string = "idle_down";
  @type("boolean") flipX: boolean = false;
}

export class RoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
