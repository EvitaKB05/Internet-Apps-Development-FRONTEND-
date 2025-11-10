import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

// ИСПРАВЛЕНИЕ: Добавляем обработку ошибок
try {
	const root = ReactDOM.createRoot(document.getElementById('root')!)

	root.render(
		<React.StrictMode>
			<Provider store={store}>
				<App />
			</Provider>
		</React.StrictMode>
	)
} catch (error) {
	console.error('Failed to render app:', error)
	// Показываем fallback сообщение
	const root = document.getElementById('root')
	if (root) {
		root.innerHTML = `
			<div style="padding: 20px; text-align: center;">
				<h2>Ошибка загрузки приложения</h2>
				<p>Попробуйте перезапустить приложение</p>
				<pre>${error}</pre>
			</div>
		`
	}
}
