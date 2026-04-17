import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>El Sistema Operativo de tu Agencia</h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 3rem auto', lineHeight: '1.8' }}>
        Acompañamos a emprendedores a ordenar sus números, superar el miedo a vender y construir sistemas que funcionen. No estás solo, construimos junto a vos.
      </p>
      
      <div className="action-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/diagnostico-gratis" className="btn-outline">
          Calculadora financiera
        </Link>
        <Link to="/auditoria-vip" className="btn-primary">
          Generar Plan de Trabajo
        </Link>
      </div>

      <div className="responsive-grid" style={{ marginTop: '5rem', textAlign: 'left' }}>
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
        <Link to="/capacitaciones" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ borderColor: 'rgba(124,58,237,0.35)', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.75rem' }}>
              Centro de Recursos
            </div>
            <h3 style={{ color: '#a78bfa', marginBottom: '1rem' }}>📚 Capacitaciones</h3>
            <p>
              Accedé a todas las cartillas, presentaciones y herramientas de los talleres activos. Material listo para proyectar o imprimir.
            </p>
            <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', fontWeight: 700, color: '#7c3aed' }}>
              Ver materiales →
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
