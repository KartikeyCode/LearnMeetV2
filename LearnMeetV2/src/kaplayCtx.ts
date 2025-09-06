import kaplay from "kaplay";

const k = kaplay({
  width: 1920,
  height: 1080,
  background: [0, 0, 0],
  global: false,
  buttons: {
    jump: {
      keyboard: ["space"],
    },
  },
  debug: true,
});

export default k;
