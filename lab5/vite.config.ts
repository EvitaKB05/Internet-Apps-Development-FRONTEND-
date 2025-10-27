import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			// ИСПРАВЛЕНИЕ: Упрощаем proxy, так как теперь используем прямые endpoints
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				// Убираем rewrite, так как endpoints теперь совпадают
			},
		},
	},
})
