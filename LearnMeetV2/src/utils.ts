export function determineWidthAndHeight(): { width: number; height: number } {
  // Calculate responsive width and height based on window size
  let width = Math.min(window.innerWidth);

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

// This function manually loads a font and returns a promise that resolves
// when the font is loaded and ready for use in the canvas.
export const loadFont = async (name: string, url: string): Promise<void> => {
  const font = new FontFace(name, `url(${url})`);

  // Check if the font is already in the document's font set
  if (!document.fonts.has(font)) {
    try {
      const loadedFont = await font.load();
      document.fonts.add(loadedFont);
    } catch (err) {
      console.error(`Failed to load font: ${name}`, err);
    }
  }
};
