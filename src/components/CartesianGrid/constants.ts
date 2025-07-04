// Constantes de Limite para Elementos Renderizados
export const gridLimits = {
  MAX_LINES: 3000, // Limite total para linhas
  MAX_TEXTS: 2000, // Limite total para textos e seus fundos
  MAX_MICRO_LINES: 100, // Limite específico para microlinhas
  MAX_MICRO_TEXTS: Math.floor(100 * 0.0833), // Limite para microtextos (aprox. 8.33% das microlinhas)
  MAX_DETAIL_ELEMENTS: 100 + Math.floor(100 * 0.0833) * 2, // Limite combinado para todos os elementos de detalhe
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
