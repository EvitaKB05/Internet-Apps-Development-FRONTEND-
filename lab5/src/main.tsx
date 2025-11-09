import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store' // ИЗМЕНЕНИЕ: правильный импорт
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
)
