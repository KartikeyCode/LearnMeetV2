export function SetCamScale(k) {
  const resizeFactor = k.width() / k.height();
  if (resizeFactor < 1) {
    k.setCamScale(k.vec2(1));
  } else {
    k.setCamScale(k.vec2(1.5));
  }
}
