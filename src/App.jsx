import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Nivel1 from './pages/Nivel1'
import Nivel2 from './pages/Nivel2'

function App() {
  return (
    <>
      <div className="container">
        <header className="topbar">
          <Link to="/" className="brand">Punto <span>Cero</span></Link>
          <nav className="nav-links">
            <Link to="/diagnostico-gratis">Máquina de la Verdad</Link>
            <Link to="/auditoria-vip">Auditoría Premium</Link>
          </nav>
        </header>
      </div>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnostico-gratis" element={<Nivel1 />} />
          <Route path="/auditoria-vip" element={<Nivel2 />} />
        </Routes>
      </main>
    </>
  )
}

export default App
