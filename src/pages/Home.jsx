import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>El Sistema Operativo de tu Agencia</h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
        Punto Cero audita la rentabilidad real de negocios mediante inteligencia matemática.
        Descubre si tu modelo escala, o si eres esclavo de un pasatiempo caro.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/diagnostico-gratis" className="btn-outline">
          Calculadora Rápida (Gratis)
        </Link>
        <Link to="/auditoria-vip" className="btn-primary">
          Auditoría de 15 Puntos (Premium)
        </Link>
      </div>

      <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left' }}>
        <div className="card">
          <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Sinceridad Numérica</h3>
          <p>
            No somos "coaches mindset". Somos ingenieros de negocios. 
            Te mostramos en verde o en rojo qué tan cerca estás del colapso físico.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Plan de Acción</h3>
          <p>
            Al finalizar la auditoría, nuestro sistema genera una hoja de ruta estricta de 15 páginas adaptada exclusivamente a los cuellos de botella reales de tu proyecto.
          </p>
        </div>
      </div>
    </div>
  )
}
