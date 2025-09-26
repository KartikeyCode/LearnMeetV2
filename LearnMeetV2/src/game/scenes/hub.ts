import { KAPLAYCtx } from "kaplay";
import { getStateCallbacks, Room } from "colyseus.js";
import type {
  MyRoomState,
  Player,
} from "../../../../server/src/rooms/schema/MyRoomState";

// This function defines the multiplayer "hub" scene
export function createHubScene(k: KAPLAYCtx) {
  k.scene("hub", async (room: Room<MyRoomState>) => {
    // 1. Load assets and map data within the scene
    k.loadSprite("hub", "/tilemaps/mainmap.png");
    k.loadFont("Bitty", "/fonts/Bitty.ttf");
    k.loadSprite("protag", "/sprites/characters/player.png", {
      sliceX: 6,
      sliceY: 10,
      anims: {
        idle_down: { from: 0, to: 5, loop: true, speed: 6 },
        idle_right: { from: 6, to: 11, loop: true, speed: 6 },
        idle_up: { from: 12, to: 17, loop: true, speed: 6 },
        walk_down: { from: 18, to: 23, loop: true, speed: 6 },
        walk_right: { from: 24, to: 29, loop: true, speed: 6 },
        walk_up: { from: 30, to: 35, loop: true, speed: 6 },
      },
    });

    const mapData = await (await fetch("/tilemaps/mainmap.json")).json();
    const layers = mapData.layers;
    const map = k.add([k.sprite("hub"), k.pos(0), k.scale(6)]);

    // Add colliders from the map data
    for (const layer of layers) {
      if (layer.name === "Colliders") {
        for (const collider of layer.objects) {
          map.add([
            k.area({
              shape: new k.Rect(k.vec2(0), collider.width, collider.height),
            }),
            k.body({ isStatic: true }),
            k.pos(collider.x, collider.y),
          ]);
        }
      }
    }

    const $ = getStateCallbacks(room);
    const spritesBySessionId: Record<string, any> = {};
    let localPlayer: any = null;

    // 2. Listen for players joining the room
    $(room.state).players.onAdd((player, sessionId) => {
      const isLocal = sessionId === room.sessionId;
      spritesBySessionId[sessionId] = createPlayer(k, player, isLocal);

      if (isLocal) {
        localPlayer = spritesBySessionId[sessionId];

        // It's better to set up the camera once the player exists
        k.onUpdate(() => {
          if (localPlayer) {
            k.setCamPos(localPlayer.worldPos());
          }
        });
      }
    });

    // 3. Listen for players leaving the room
    $(room.state).players.onRemove((player, sessionId) => {
      k.destroy(spritesBySessionId[sessionId]);
      delete spritesBySessionId[sessionId];
    });

    // 4. Handle local player input and send to server
    k.onMouseDown((mouseBtn) => {
      // Guard Clause: Only run if the local player exists and input is valid.
      if (!localPlayer || mouseBtn !== "left" || localPlayer.isInDialogue) {
        return;
      }

      const worldMousePos = k.toWorld(k.mousePos());
      localPlayer.moveTo(worldMousePos, localPlayer.speed);

      const mouseAngle = localPlayer.pos.angle(worldMousePos);
      const lowerBound = 50;
      const upperBound = 125;

      let newAnim = localPlayer.curAnim()?.name || "idle_down";
      let newFlipX = localPlayer.flipX;

      if (mouseAngle > lowerBound && mouseAngle < upperBound) {
        newAnim = "walk_up";
        localPlayer.direction = "up";
      } else if (mouseAngle < -lowerBound && mouseAngle > -upperBound) {
        newAnim = "walk_down";
        localPlayer.direction = "down";
      } else if (Math.abs(mouseAngle) > upperBound) {
        newFlipX = false;
        newAnim = "walk_right";
        localPlayer.direction = "right";
      } else if (Math.abs(mouseAngle) < lowerBound) {
        newFlipX = true;
        newAnim = "walk_right";
        localPlayer.direction = "left";
      }

      // Send the update to the server
      room.send("update", {
        x: localPlayer.pos.x,
        y: localPlayer.pos.y,
        anim: newAnim,
        flipX: newFlipX,
      });
    });

    k.onMouseRelease(() => {
      if (!localPlayer) return;

      const dir = localPlayer.direction || "down";
      let newAnim = `idle_${dir}`;
      let newFlipX = localPlayer.flipX;

      if (dir === "left") {
        newAnim = "idle_right";
        newFlipX = true;
      } else if (dir === "right") {
        newFlipX = false;
      }

      room.send("update", {
        x: localPlayer.pos.x,
        y: localPlayer.pos.y,
        anim: newAnim,
        flipX: newFlipX,
      });
    });

    // You would add similar guards for k.onKeyDown and k.onKeyRelease
    k.onKeyDown((key) => {
      if (!localPlayer) return;
      // ... your keyboard logic here, sending an "update" message ...
    });

    k.onKeyRelease(() => {
      if (!localPlayer) return;
      // ... logic to stop animation and send an "update" message ...
    });

    k.add([
      k.pos(200, 600),
      k.text("Welcome to LearnMeet!\nLeft Click to move", {
        align: "center",
        font: "Bitty",
        size: 64,
      }),
    ]);
  });
}

// This function creates a player sprite and sets up its state synchronization
function createPlayer(k: KAPLAYCtx, player: Player, isLocal: boolean) {
  const sprite = k.add([
    k.sprite("protag", { anim: player.anim || "idle_down" }),
    k.pos(player.x, player.y),
    k.area({ shape: new k.Rect(k.vec2(0, 3), 10, 10) }),
    k.body(),
    k.anchor("center"),
    k.scale(4),
    {
      speed: 420,
      direction: "down",
      isInDialogue: false,
    },
    "player",
    // Add a tag to differentiate local player if needed
    isLocal ? "local-player" : "remote-player",
  ]);
  const nametag = k.add([
    k.text(player.username, {
      font: "Bitty",
      size: 32,
      align: "center",
      transform: {
        color: k.Color.BLACK,
      },
    }),
    k.pos(sprite.pos.x, sprite.pos.y - 30), // Position it above the sprite
    k.anchor("center"),
  ]);
  // Smoothly interpolate position and update animations for all players
  sprite.onUpdate(() => {
    sprite.pos.x = k.lerp(sprite.pos.x, player.x, 15 * k.dt());
    sprite.pos.y = k.lerp(sprite.pos.y, player.y, 15 * k.dt());

    // --- ADD THIS BLOCK TO MAKE THE NAMETAG FOLLOW THE PLAYER ---
    nametag.pos.x = sprite.pos.x;
    nametag.pos.y = sprite.pos.y - 30; // Keep it positioned above

    if (sprite.getCurAnim()?.name !== player.anim) {
      sprite.play(player.anim);
    }
    sprite.flipX = player.flipX;
  });
  sprite.onDestroy(() => {
    //when player leaves remove player nametag also
    k.destroy(nametag);
  });
  return sprite;
}
