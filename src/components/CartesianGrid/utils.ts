export function getTextOffset(
  v: number,
  isHorizontal: boolean,
  fontSize: number,
) {
  // Zero
  if (v === 0) {
    return { offsetX: fontSize * 0.75, offsetY: fontSize - fontSize * 1.2 };
  }

  // Positivos verticais
  if (!isHorizontal && v > 0) {
    return {
      offsetX: fontSize - fontSize * 0.1,
      offsetY: -(fontSize - fontSize * 1.5),
    };
  }

  // Negativos verticais
  if (!isHorizontal && v < 0) {
    return {
      offsetX: fontSize + fontSize * 0.5,
      offsetY: -(fontSize - fontSize * 1.5),
    };
  }

  // Positivos horizontais
  if (isHorizontal && v > 0) {
    return {
      offsetX: fontSize - fontSize * 0.15,
      offsetY: fontSize - fontSize * 1.3,
    };
  }

  // Negativos horizontais
  if (isHorizontal && v < 0) {
    return {
      offsetX: fontSize + fontSize * 0.5,
      offsetY: fontSize - fontSize * 1.3,
    };
  }

  // Caso padrão
  return { offsetX: 0, offsetY: 0 };
}
