export const gridLimits = {
  MAX_LINES: 3000,
  MAX_TEXTS: 2000,
  MAX_MICRO_LINES: 100,
  MAX_MICRO_TEXTS: Math.floor(100 * 0.0833), // Limits for microtexts (aprox. 8.33% microlines)
  MAX_DETAIL_ELEMENTS: 100 + Math.floor(100 * 0.0833) * 2, // Combined limit for detail elements (lines + texts)
};

export const gridColors = {
  mainLine: '#000000',
  secondaryLine: '#7A7979',
  intermediateLine: '#7A7979',
  subLine: '#A8A8A8',
  subSubLine: '#79CC79',
  microLine: '#C7F8C7',
  highlightedMicroLine: '#A8A8A8',
};
