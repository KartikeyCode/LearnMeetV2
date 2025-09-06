export function determineWidthAndHeight(): { width: number; height: number } {
  // Calculate responsive width and height based on window size
  let width = Math.min(window.innerWidth, 400);

  // Make width even for better pixel alignment
  if (width % 2 !== 0) {
    width -= 1;
  }

  let height = Math.floor(width / (window.innerWidth / window.innerHeight));

  // Make height even as well
  if (height % 2 !== 0) {
    height -= 1;
  }

  return { width, height };
}
