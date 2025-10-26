import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import CustomNavbar from './components/Navbar'
import HomePage from './pages/HomePage'
import FormulasPage from './pages/FormulasPage'
import FormulaDetailPage from './pages/FormulaDetailPage'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const App: React.FC = () => {
	return (
		<Router>
			<div className='App'>
				<CustomNavbar />
				<main>
					<Container fluid>
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/formulas' element={<FormulasPage />} />
							<Route path='/formulas/:id' element={<FormulaDetailPage />} />
						</Routes>
					</Container>
				</main>
			</div>
		</Router>
	)
}

export default App
