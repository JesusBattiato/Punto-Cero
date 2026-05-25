import React, { useState, useRef, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Nivel1 from './pages/Nivel1'
import Nivel2 from './pages/Nivel2'
import Capacitaciones from './pages/Capacitaciones'
import TecpetrolDashboard from './pages/TecpetrolDashboard'
import Charla from './pages/Charla'

const TOOL_ITEMS = [
  {
    icon: '🧮',
    label: 'Máquina de la Verdad',
    desc: '¿Tu precio es viable?',
    href: '/capacitaciones/cuanto-vale-tu-hora/maquina-de-la-verdad.html',
  },
  {
    icon: '🎯',
    label: 'El Precio Justo',
    desc: '¿Cuánto deberías cobrar?',
    href: '/capacitaciones/cuanto-vale-tu-hora/precio-justo.html',
  },
]

function ToolsDropdown({ isActive }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on click outside
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.88rem',
          fontWeight: open || isActive ? 700 : 500,
          color: open || isActive ? 'var(--accent-light)' : 'var(--text-muted)',
          padding: '0.4rem 0.85rem',
          borderRadius: '8px',
          background: open ? 'rgba(99,102,241,0.1)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          transition: 'color 0.2s, background 0.2s',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.color = 'var(--text)' }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.color = isActive ? 'var(--accent-light)' : 'var(--text-muted)' }}
      >
        Herramientas
        <span style={{
          fontSize: '0.55rem',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s',
          display: 'inline-block',
          opacity: 0.7,
        }}>▼</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '260px',
          background: 'rgba(10, 16, 30, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: '14px',
          padding: '0.5rem',
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.7)',
          zIndex: 100,
          animation: 'dropIn 0.18s ease',
        }}>
          {/* Little arrow */}
          <div style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '10px',
            height: '10px',
            background: 'rgba(10,16,30,0.97)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderBottom: 'none',
            borderRight: 'none',
            rotate: '45deg',
          }} />

          {TOOL_ITEMS.map(tool => (
            <a
              key={tool.href}
              href={tool.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 0.9rem',
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'background 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}>{tool.icon}</span>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{tool.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{tool.desc}</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0 }}>↗</span>
            </a>
          ))}

          <div style={{
            borderTop: '1px solid var(--border)',
            marginTop: '0.25rem',
            paddingTop: '0.4rem',
          }}>
            <Link
              to="/capacitaciones"
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '0.6rem 0.9rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.78rem',
                color: 'var(--accent-light)',
                fontWeight: 600,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Ver todos los materiales →
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}

function App() {
  const location = useLocation()
  const toolPaths = ['/diagnostico-gratis']
  const isToolActive = toolPaths.includes(location.pathname)

  return (
    <>
      <div className="container" style={{ position: 'relative', zIndex: 200 }}>
        <header className="topbar">
          <Link to="/" className="brand">
            Punto <span>Cero</span>
          </Link>
          <nav className="nav-links">
            <Link to="/charla" style={{ color: 'var(--accent-light)', fontWeight: 700 }} className={location.pathname === '/charla' ? 'active' : ''}>
              Charla Abierta 🎙️
            </Link>
            <ToolsDropdown isActive={isToolActive} />
            <Link to="/auditoria-vip" className={location.pathname === '/auditoria-vip' ? 'active' : ''}>
              Plan de Trabajo
            </Link>
            <Link to="/capacitaciones" className={location.pathname === '/capacitaciones' ? 'active' : ''}>
              Capacitaciones
            </Link>
          </nav>
        </header>
      </div>

      <main>
        <Routes>
          <Route path="/"                   element={<Home />} />
          <Route path="/diagnostico-gratis" element={<Nivel1 />} />
          <Route path="/auditoria-vip"      element={<Nivel2 />} />
          <Route path="/capacitaciones"     element={<Capacitaciones />} />
          <Route path="/charla"             element={<Charla />} />
          <Route path="/admin/ramos"        element={<TecpetrolDashboard />} />
        </Routes>
      </main>
    </>
  )
}

export default App
