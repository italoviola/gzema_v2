export function getTextOffset(
  v: number,
  isHorizontal: boolean,
  fontSize: number,
  textWidth: number,
  textHeight: number,
) {
  return {
    offsetX: textWidth / 2,
    offsetY: -(textHeight / 2) * 0.75,
  };
}

export function measureTextWidth(
  text: string,
  fontSize: number,
  fontFamily = 'monospace',
  fontStyle = 'bold',
): number {
  // Cria um canvas temporário
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 0;
  context.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
  const metrics = context.measureText(text);
  return metrics.width;
}
