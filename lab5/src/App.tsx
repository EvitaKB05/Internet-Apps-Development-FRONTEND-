import React from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	HashRouter,
} from 'react-router-dom'
import { Container } from 'react-bootstrap'
import CustomNavbar from './components/Navbar'
import HomePage from './pages/HomePage'
import PvlcPatientsPage from './pages/PvlcPatientsPage'
import PvlcPatientPage from './pages/PvlcPatientPage'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { getIsTauri } from './target_config'

const App: React.FC = () => {
	const isTauri = getIsTauri()

	// Для Tauri используем HashRouter, для Web - BrowserRouter
	const RouterComponent = isTauri ? HashRouter : Router
	const basename = isTauri ? undefined : '/Internet-Apps-Development-FRONTEND-/'

	return (
		<RouterComponent basename={basename}>
			<div className='App'>
				<CustomNavbar />
				<main>
					<Container fluid>
						<Routes>
							<Route path='/pvlc_home_page' element={<HomePage />} />
							<Route path='/pvlc_patients' element={<PvlcPatientsPage />} />
							<Route path='/pvlc_patient/:id' element={<PvlcPatientPage />} />
							<Route path='/' element={<HomePage />} />
						</Routes>
					</Container>
				</main>
			</div>
		</RouterComponent>
	)
}

export default App
