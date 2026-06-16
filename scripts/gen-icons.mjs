import sharp from 'sharp'
import { mkdirSync } from 'fs'

mkdirSync('public', { recursive: true })

// 모두의 마린 앱 아이콘 — 네이비 배경 + 흰 'M' 모노그램 + 블루 웨이브
const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0b1d2e"/>
  <text x="256" y="300" font-family="Arial, sans-serif" font-size="300" font-weight="900"
        fill="#ffffff" text-anchor="middle">M</text>
  <path d="M104 372 q38 -34 76 0 t76 0 t76 0 t76 0" stroke="#2f7fff"
        stroke-width="22" fill="none" stroke-linecap="round"/>
</svg>`

const buf = Buffer.from(svg)

const targets = [
  { file: 'public/pwa-192.png', size: 192 },
  { file: 'public/pwa-512.png', size: 512 },
  { file: 'public/apple-touch-icon.png', size: 180 },
  { file: 'public/favicon.png', size: 64 },
]

for (const { file, size } of targets) {
  await sharp(buf).resize(size, size).png().toFile(file)
  console.log('wrote', file)
}
