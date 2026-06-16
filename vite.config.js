import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 개발 중 캐시 번거로움 회피: 배포된 서비스워커가 스스로 등록 해제 + 캐시 정리.
      // 나중에 PWA를 다시 쓰려면 이 한 줄만 제거(또는 false)하면 됨.
      selfDestroying: true,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: '모두의 마린 — 중고 보트·요트·제트스키 거래',
        short_name: '모두의 마린',
        description: '중고 보트, 요트, 제트스키, 낚시보트, RIB 등 수상레저 탈것을 사고파는 거래 플랫폼',
        lang: 'ko',
        theme_color: '#0b1d2e',
        background_color: '#0b1d2e',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        // 서버리스 API는 서비스워커가 가로채지 않게 한다
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://images.unsplash.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
    }),
  ],
  base: '/',
})
