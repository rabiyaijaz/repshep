import Svg, { Rect } from 'react-native-svg';
import { colors } from '@/theme';

// Deterministic QR-looking pattern for the prototype (not a scannable code).
export function FakeQR({ value, size = 150, color = colors.primary }: { value: string; size?: number; color?: string }) {
  const n = 21;
  const cell = size / n;
  let h = 0;
  for (const c of value) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const finder = (x: number, y: number) => {
    for (const [ox, oy] of [[0, 0], [n - 7, 0], [0, n - 7]] as const) {
      if (x >= ox && x < ox + 7 && y >= oy && y < oy + 7) {
        const dx = x - ox, dy = y - oy;
        return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0;
      }
    }
    return -1;
  };
  const rects = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const f = finder(x, y);
      h = (h * 1103515245 + 12345) >>> 0;
      const on = f === -1 ? (h >>> 16) % 2 === 0 : f === 1;
      if (on) rects.push(<Rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell + 0.3} height={cell + 0.3} fill={color} />);
    }
  return (
    <Svg width={size} height={size}>
      {rects}
    </Svg>
  );
}
