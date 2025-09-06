import k from "../kaplayCtx";
k.loadSprite("hub", "/tilemaps/mainmap.png");
k.loadFont("Bitty", "/fonts/Bitty.ttf");
k.loadSprite("protag", "/sprites/characters/player.png", {
  sliceX: 6, //no of cols in the spritesheet
  sliceY: 10, // no of rows in the spritesheet
  anims: {
    idle_down: {
      //frame 0-5
      from: 0,
      to: 5,
      loop: true,
      speed: 6,
    },
    idle_right: {
      from: 6,
      to: 11,
      loop: true,
      speed: 6,
    },
    idle_up: {
      from: 12,
      to: 17,
      loop: true,
      speed: 6,
    },
    walk_down: {
      from: 18,
      to: 23,
      loop: true,
      speed: 6,
    },
    walk_right: {
      from: 24,
      to: 29,
      loop: true,
      speed: 6,
    },
    walk_up: {
      from: 30,
      to: 35,
      loop: true,
      speed: 6,
    },
  },
});
export default async function hub() {
  const mapData = await (await fetch("/tilemaps/mainmap.json")).json();
  const layers = mapData.layers;
  const map = k.add([k.sprite("hub"), k.pos(0), k.scale(6)]);
  const player = k.make([
    k.sprite("protag", { anim: "idle_down" }),
    k.area({
      shape: new k.Rect(k.vec2(0, 3), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(),
    k.scale(4),
    {
      speed: 250,
      direction: "down",
      isInDialogue: false,
    },
    "player",
  ]);

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
      continue;
    }
    if (layer.name === "Positions") {
      for (const entity of layer.objects) {
        if (entity.name === "Player") {
          player.pos = k.vec2(
            (map.pos.x + entity.x) * 6, //scale factor is 4
            (map.pos.y + entity.y) * 6
          );
          k.add(player);
          continue;
        }
      }
    }
  }

  k.onUpdate(() => {
    k.setCamPos(player.worldPos().x, player.worldPos().y);
  });

  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== "left" || player.isInDialogue) return;
    const worldMousePos = k.toWorld(k.mousePos());
    player.moveTo(worldMousePos, player.speed);

    const mouseAngle = player.pos.angle(worldMousePos);

    const lowerBound = 50;
    const upperBound = 125;

    if (
      mouseAngle > lowerBound &&
      mouseAngle < upperBound &&
      player.getCurAnim().name !== "walk_up"
    ) {
      player.play("walk_up");
      player.direction = "up";
      return;
    }

    if (
      mouseAngle < -lowerBound &&
      mouseAngle > -upperBound &&
      player.getCurAnim().name !== "walk_down"
    ) {
      player.play("walk_down");
      player.direction = "down";
      return;
    }

    if (Math.abs(mouseAngle) > upperBound) {
      player.flipX = false;
      if (player.getCurAnim().name !== "walk_right") player.play("walk_right");
      player.direction = "right";
      return;
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      player.flipX = true;
      if (player.getCurAnim().name !== "walk_right") player.play("walk_right");
      player.direction = "left";
      return;
    }
  });

  function stopAnims() {
    if (player.direction === "down") {
      player.play("idle_down");
      return;
    }
    if (player.direction === "up") {
      player.play("idle_up");
      return;
    }

    player.play("idle_right");
  }

  k.onMouseRelease(stopAnims);

  k.onKeyRelease(() => {
    stopAnims();
  });
  k.onKeyDown((key) => {
    const keyMap = [
      k.isKeyDown("right"),
      k.isKeyDown("left"),
      k.isKeyDown("up"),
      k.isKeyDown("down"),
    ];

    let nbOfKeyPressed = 0;
    for (const key of keyMap) {
      if (key) {
        nbOfKeyPressed++;
      }
    }

    if (nbOfKeyPressed > 1) return;

    if (player.isInDialogue) return;
    if (keyMap[0]) {
      player.flipX = false;
      if (player.getCurAnim().name !== "walk_right") player.play("walk_right");
      player.direction = "right";
      player.move(player.speed, 0);
      return;
    }

    if (keyMap[1]) {
      player.flipX = true;
      if (player.getCurAnim().name !== "walk_right") player.play("walk_right");
      player.direction = "left";
      player.move(-player.speed, 0);
      return;
    }

    if (keyMap[2]) {
      if (player.getCurAnim().name !== "walk_up") player.play("walk_up");
      player.direction = "up";
      player.move(0, -player.speed);
      return;
    }

    if (keyMap[3]) {
      if (player.getCurAnim().name !== "walk_down") player.play("walk_down");
      player.direction = "down";
      player.move(0, player.speed);
    }
  });
  const WelcomeText = k.add([
    k.pos(150, 600),
    k.text("Welcome to LearnMeet!\nLeft Click/Arrow Keys to move", {
      align: "center",
      font: "Bitty",
      size: 64,
    }),
  ]);
}
