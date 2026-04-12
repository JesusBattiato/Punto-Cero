import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>El Sistema Operativo de tu Agencia</h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 3rem auto', lineHeight: '1.8' }}>
        Acompañamos a emprendedores a ordenar sus números, superar el miedo a vender y construir sistemas que funcionen. No estás solo, construimos junto a vos.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/diagnostico-gratis" className="btn-outline">
          Calculadora financiera
        </Link>
        <Link to="/auditoria-vip" className="btn-primary">
          Generar Plan de Trabajo
        </Link>
      </div>

      <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left' }}>
        <div className="card">
          <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Sinceridad Numérica</h3>
          <p>
            Entendemos lo difícil que es manejar un negocio a ciegas. Te ayudamos a ver tus números con claridad para que tomes decisiones desde la tranquilidad, no desde el estrés.
          </p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Plan de Acción</h3>
          <p>
            Al analizar tu situación, creamos una hoja de ruta adaptada exclusivamente a los cuellos de botella reales de tu proyecto. Pasos claros y accionables para avanzar seguro.
          </p>
        </div>
      </div>
    </div>
  )
}
