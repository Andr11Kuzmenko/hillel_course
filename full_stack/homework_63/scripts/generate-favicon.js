/**
 * Генерує public/favicon.ico (16x16, 32 bpp) без сторонніх бібліотек.
 * Формат ICO: ICONDIR + ICONDIRENTRY + BITMAPINFOHEADER + пікселі (BGRA, знизу вгору) + AND-маска.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIZE = 16;

// Малюємо піктограму: синє коло з білою літерою "E"
const letterE = [
  '..........',
  '.#######..',
  '.##.......',
  '.##.......',
  '.######...',
  '.##.......',
  '.##.......',
  '.#######..',
];

const pixel = (x, y) => {
  const cx = 7.5;
  const cy = 7.5;
  const dist = Math.hypot(x - cx, y - cy);
  if (dist > 7.8) return [0, 0, 0, 0]; // прозорий фон

  const ly = y - 4;
  const lx = x - 4;
  if (ly >= 0 && ly < letterE.length && lx >= 0 && lx < letterE[0].length && letterE[ly][lx] === '#') {
    return [255, 255, 255, 255];
  }
  // Градієнт від світло-синього до темно-синього
  const t = y / (SIZE - 1);
  return [Math.round(40 - 20 * t), Math.round(140 - 60 * t), Math.round(230 - 60 * t), 255];
};

const xorSize = SIZE * SIZE * 4;
const andRowBytes = Math.ceil(SIZE / 32) * 4;
const andSize = andRowBytes * SIZE;
const bmpSize = 40 + xorSize + andSize;

const buf = Buffer.alloc(6 + 16 + bmpSize);
let o = 0;

// ICONDIR
buf.writeUInt16LE(0, o); o += 2; // reserved
buf.writeUInt16LE(1, o); o += 2; // type: 1 = icon
buf.writeUInt16LE(1, o); o += 2; // count

// ICONDIRENTRY
buf.writeUInt8(SIZE, o++); // width
buf.writeUInt8(SIZE, o++); // height
buf.writeUInt8(0, o++); // colors in palette
buf.writeUInt8(0, o++); // reserved
buf.writeUInt16LE(1, o); o += 2; // color planes
buf.writeUInt16LE(32, o); o += 2; // bits per pixel
buf.writeUInt32LE(bmpSize, o); o += 4; // image size
buf.writeUInt32LE(22, o); o += 4; // offset

// BITMAPINFOHEADER
buf.writeUInt32LE(40, o); o += 4;
buf.writeInt32LE(SIZE, o); o += 4;
buf.writeInt32LE(SIZE * 2, o); o += 4; // висота подвоєна (XOR + AND)
buf.writeUInt16LE(1, o); o += 2;
buf.writeUInt16LE(32, o); o += 2;
buf.writeUInt32LE(0, o); o += 4; // BI_RGB
buf.writeUInt32LE(xorSize + andSize, o); o += 4;
o += 16; // resolution + palette fields = 0

// Пікселі знизу вгору у форматі BGRA
for (let y = SIZE - 1; y >= 0; y--) {
  for (let x = 0; x < SIZE; x++) {
    const [r, g, b, a] = pixel(x, y);
    buf.writeUInt8(b, o++);
    buf.writeUInt8(g, o++);
    buf.writeUInt8(r, o++);
    buf.writeUInt8(a, o++);
  }
}
// AND-маска — нулі (прозорість задає альфа-канал)

const outDir = path.join(__dirname, '..', 'public');
mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, 'favicon.ico'), buf);
console.log(`favicon.ico generated (${buf.length} bytes)`);
