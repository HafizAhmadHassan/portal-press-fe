// utils/letter-colors.ts

/**
 * Mappa colori per ogni lettera dell'alfabeto
 * Colori abbastanza scuri per garantire leggibilità del testo bianco
 */
export const LETTER_COLORS: Record<string, string> = {
  A: '#EF4444', // Red-500
  B: '#F97316', // Orange-500
  C: '#F59E0B', // Amber-500
  D: '#EAB308', // Yellow-500
  E: '#84CC16', // Lime-500
  F: '#22C55E', // Green-500
  G: '#10B981', // Emerald-500
  H: '#14B8A6', // Teal-500
  I: '#06B6D4', // Cyan-500
  J: '#0EA5E9', // Sky-500
  K: '#3B82F6', // Blue-500
  L: '#6366F1', // Indigo-500
  M: '#8B5CF6', // Violet-500
  N: '#A855F7', // Purple-500
  O: '#C026D3', // Fuchsia-500
  P: '#EC4899', // Pink-500
  Q: '#F43F5E', // Rose-500
  R: '#DC2626', // Red-600
  S: '#EA580C', // Orange-600
  T: '#D97706', // Amber-600
  U: '#CA8A04', // Yellow-600
  V: '#65A30D', // Lime-600
  W: '#16A34A', // Green-600
  X: '#059669', // Emerald-600
  Y: '#0D9488', // Teal-600
  Z: '#0891B2', // Cyan-600
};

/**
 * Ottiene il colore associato a una lettera specifica
 * @param letter - La lettera per cui ottenere il colore
 * @returns Il codice colore esadecimale
 */
export function getColorFromLetter(letter: string): string {
  const upperLetter = letter.toUpperCase();
  return LETTER_COLORS[upperLetter] || '#6B7280'; // Fallback grigio
}

/**
 * Genera un colore HSL basato sulla lettera usando una formula matematica
 * @param letter - La lettera per cui generare il colore
 * @returns Stringa HSL color
 */
export function getColorFromLetterMath(letter: string): string {
  const charCode = letter.toUpperCase().charCodeAt(0);
  const hue = ((charCode - 65) * 13.8) % 360; // Distribuisce uniformemente su 360°
  return `hsl(${hue}, 65%, 45%)`; // Saturazione e luminosità fisse per consistenza
}

/**
 * Ottiene un gradiente CSS basato sulla lettera
 * @param letter - La lettera per cui ottenere il gradiente
 * @returns Stringa CSS linear-gradient
 */
export function getGradientFromLetter(letter: string): string {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // A
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // B
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // C
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // D
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // E
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // F
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', // G
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // H
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', // I
    'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)', // J
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // K
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // L
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // M
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // N
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // O
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // P
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', // Q
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // R
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', // S
    'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)', // T
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // U
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // V
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // W
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // X
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Y
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Z
  ];

  const index = (letter.toUpperCase().charCodeAt(0) - 65) % gradients.length;
  return gradients[Math.max(0, index)] || gradients[0];
}

/**
 * Ottiene il colore di sfondo e il colore del testo ottimale per una lettera
 * @param letter - La lettera per cui ottenere i colori
 * @returns Oggetto con backgroundColor e textColor
 */
export function getAvatarColors(letter: string): {
  backgroundColor: string;
  textColor: string;
} {
  const backgroundColor = getColorFromLetter(letter);

  // Calcola se il colore è chiaro o scuro per determinare il colore del testo
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return {
    backgroundColor,
    textColor: brightness > 128 ? '#000000' : '#FFFFFF',
  };
}

/**
 * Genera una palette di colori pastello per avatar
 * @param letter - La lettera per cui generare il colore
 * @returns Colore pastello
 */
export function getPastelColorFromLetter(letter: string): string {
  const charCode = letter.toUpperCase().charCodeAt(0);
  const hue = ((charCode - 65) * 13.8) % 360;
  return `hsl(${hue}, 70%, 80%)`; // Colori pastello (alta luminosità)
}

/**
 * Ottiene colori Material Design per avatar
 * @param letter - La lettera per cui ottenere il colore
 * @returns Colore Material Design
 */
export function getMaterialColorFromLetter(letter: string): string {
  const materialColors = [
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#FFEB3B',
    '#FFC107',
    '#FF9800',
    '#FF5722',
    '#795548',
    '#9E9E9E',
    '#607D8B',
    '#FF1744',
    '#F50057',
    '#D500F9',
    '#651FFF',
    '#3D5AFE',
    '#2979FF',
  ];

  const index =
    (letter.toUpperCase().charCodeAt(0) - 65) % materialColors.length;
  return materialColors[Math.max(0, index)] || materialColors[0];
}

/**
 * Utility per creare avatar HTML completo
 * @param name - Nome della persona
 * @param size - Dimensione dell'avatar in px (default: 32)
 * @param colorMode - Modalità colore ('default' | 'gradient' | 'pastel' | 'material')
 * @returns HTML string per l'avatar
 */
export function createAvatarHtml(
  name: string,
  size: number = 32,
  colorMode: 'default' | 'gradient' | 'pastel' | 'material' = 'default',
): string {
  const firstLetter = (name || 'U')[0].toUpperCase();
  let backgroundColor: string;

  switch (colorMode) {
    case 'gradient':
      backgroundColor = getGradientFromLetter(firstLetter);
      break;
    case 'pastel':
      backgroundColor = getPastelColorFromLetter(firstLetter);
      break;
    case 'material':
      backgroundColor = getMaterialColorFromLetter(firstLetter);
      break;
    default:
      backgroundColor = getColorFromLetter(firstLetter);
  }

  const isGradient = backgroundColor.includes('gradient');
  const backgroundStyle = isGradient
    ? `background: ${backgroundColor}`
    : `background-color: ${backgroundColor}`;

  return `
    <div style="
      width: ${size}px; 
      height: ${size}px; 
      border-radius: 50%; 
      ${backgroundStyle}; 
      color: white; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-weight: 600;
      font-size: ${Math.round(size * 0.4)}px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
      user-select: none;
    ">
      ${firstLetter}
    </div>
  `;
}
