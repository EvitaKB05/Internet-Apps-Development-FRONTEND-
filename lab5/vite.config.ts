import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			devOptions: {
				enabled: false,
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2}'],
				maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
			},
			manifest: {
				name: 'Лёгкая Жизнь - Расчет ДЖЕЛ',
				short_name: 'Лёгкая Жизнь',
				description:
					'Система для расчета должной жизненной емкости легких (ДЖЕЛ)',
				theme_color: '#00a6ca',
				background_color: '#f8f9fa',
				display: 'standalone',
				orientation: 'portrait',
				start_url: '.',
				scope: '.',
				icons: [
					{
						src: './lung-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
				categories: ['medical', 'health', 'productivity'],
				lang: 'ru-RU',
				dir: 'ltr',
			},
		}),
	],
	server: {
		port: 3000,
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
			},
		},
	},
	// ИСПРАВЛЕНИЕ: Всегда используем относительные пути для Tauri
	base: './',
	build: {
		assetsDir: 'assets',
		// ИСПРАВЛЕНИЕ: Отключаем хеши в именах файлов для Tauri
		rollupOptions: {
			output: {
				assetFileNames: 'assets/[name].[ext]',
			},
		},
	},
})
