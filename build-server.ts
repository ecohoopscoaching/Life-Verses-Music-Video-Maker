import { build } from 'esbuild';

build({
  entryPoints: ['server.ts'],
  outfile: 'dist/server.cjs',
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  external: ['express', 'vite', 'fluent-ffmpeg', '@ffmpeg-installer/ffmpeg', 'multer'],
}).catch(() => process.exit(1));
