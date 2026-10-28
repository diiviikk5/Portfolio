// divik — a tiny pixel Divik in a lime hoodie who walks on headings.
// Call registerDivik(Piixpal) once Piixpal has loaded, then use <piix-pal pal="divik">.
const head = [
  '...kkkkkk...',
  '..khhhhhhk..',
  '.khhhhhhhhk.',
  '.khhsssshhk.',
];
const face = [
  '.kskksskksk.',
  '.kssssssssk.',
  '.ksssSSsssk.',
  '...kssssk...',
];
const blink = [
  '.kssssssssk.',
  '.kskksskksk.',
  '.ksssSSsssk.',
  '...kssssk...',
];
const body = [
  '..kllllllk..',
  '.kllLllLllk.',
  '.ksllllllsk.',
  '..kppppppk..',
];
const stand = ['..kpk..kpk..', '..kkk..kkk..'];
const stepA = ['.kpk....kpk.', '.kkk....kkk.'];
const stepB = ['...kpkkpk...', '...kkkkkk...'];
const tuft = ['...kkkkkkk..', ...head.slice(1)];

export const DIVIK_FRAMES = {
  idle: [
    [...head, ...face, ...body, ...stand],
    [...head, ...blink, ...body, ...stand],
    [...tuft, ...face, ...body, ...stand],
  ],
  walk: [
    [...head, ...face, ...body, ...stepA],
    [...tuft, ...face, ...body, ...stepB],
  ],
};

export function registerDivik(Piixpal) {
  if (!Piixpal || registerDivik.done) return;
  registerDivik.done = true;
  Piixpal.sprite('divik', {
    w: 12, h: 14, scale: 3,
    does: 'crawl',
    palette: { k: '#17121f', h: '#2b2233', s: '#f6cfae', S: '#d9917a', l: '#c6f432', L: '#93c21a', p: '#3b3f58' },
    frames: DIVIK_FRAMES,
    fps: { idle: 3, walk: 8 },
  });
}
