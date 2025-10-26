import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			'/api/pvlc_patients': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				rewrite: path =>
					path.replace(/^\/api\/pvlc_patients/, '/api/pvlc-med-formulas'),
			},
			'/api/pvlc_patient': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				rewrite: path =>
					path.replace(
						/^\/api\/pvlc_patient\/(.*)/,
						'/api/pvlc-med-formulas/$1'
					),
			},
		},
	},
})
