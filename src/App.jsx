import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Nivel1 from './pages/Nivel1'
import Nivel2 from './pages/Nivel2'
import Capacitaciones from './pages/Capacitaciones'
import TecpetrolDashboard from './pages/TecpetrolDashboard'

function App() {
  return (
    <>
      <div className="container">
        <header className="topbar">
          <Link to="/" className="brand">Punto <span>Cero</span></Link>
          <nav className="nav-links">
            <Link to="/diagnostico-gratis">Calculadora financiera</Link>
            <Link to="/auditoria-vip">Generar Plan de Trabajo</Link>
            <Link to="/capacitaciones" style={{ color: '#7c3aed', fontWeight: 700 }}>Capacitaciones</Link>
          </nav>
        </header>
      </div>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnostico-gratis" element={<Nivel1 />} />
          <Route path="/auditoria-vip" element={<Nivel2 />} />
          <Route path="/capacitaciones" element={<Capacitaciones />} />
          <Route path="/admin/ramos" element={<TecpetrolDashboard />} />
        </Routes>
      </main>
    </>
  )
}

export default App
