import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import CustomNavbar from './components/Navbar'
import HomePage from './pages/HomePage'
import PvlcPatientsPage from './pages/PvlcPatientsPage'
import PvlcPatientPage from './pages/PvlcPatientPage'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const App: React.FC = () => {
	return (
		// ИСПРАВЛЕНИЕ: Всегда используем HashRouter для Tauri production
		<Router>
			<div className='App'>
				<CustomNavbar />
				<main>
					<Container fluid>
						<Routes>
							<Route path='/pvlc_home_page' element={<HomePage />} />
							<Route path='/pvlc_patients' element={<PvlcPatientsPage />} />
							<Route path='/pvlc_patient/:id' element={<PvlcPatientPage />} />
							<Route path='/' element={<HomePage />} />
							<Route path='*' element={<HomePage />} />
						</Routes>
					</Container>
				</main>
			</div>
		</Router>
	)
}

export default App
