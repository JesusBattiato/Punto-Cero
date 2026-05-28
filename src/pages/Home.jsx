import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const TOOLS = [
  {
    icon: '🧮',
    name: 'Simulador de Viabilidad Financiera',
    desc: 'Ingresás tus números y obtenés un diagnóstico objetivo de tu rentabilidad y tiempo. Semáforo rojo, amarillo o verde según tus márgenes reales.',
    tag: 'Diagnóstico',
    tagColor: 'rgba(99,102,241,0.15)',
    tagBorder: 'rgba(99,102,241,0.3)',
    tagText: '#818cf8',
    url: '/capacitaciones/cuanto-vale-tu-hora/simulador-de-viabilidad.html',
    accent: 'rgba(99,102,241,0.2)',
    accentBorder: 'rgba(99,102,241,0.4)',
  },
  {
    icon: '🎯',
    name: 'El Precio Justo',
    desc: 'Al revés de la anterior: no evalúa tu precio actual, te dice cuánto tenés que cobrar para que tu hora valga lo que merece.',
    tag: 'Calculadora',
    tagColor: 'rgba(16,185,129,0.12)',
    tagBorder: 'rgba(16,185,129,0.3)',
    tagText: '#34d399',
    url: '/capacitaciones/cuanto-vale-tu-hora/precio-justo.html',
    accent: 'rgba(16,185,129,0.15)',
    accentBorder: 'rgba(16,185,129,0.35)',
  },
]

export default function Home() {
  const [toolsOpen, setToolsOpen] = useState(false)

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>

      {/* ── Event Banner ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '16px',
        padding: '1rem 1.5rem',
        maxWidth: '720px',
        margin: '0 auto 2.5rem auto',
        textAlign: 'left',
        flexWrap: 'wrap',
        boxShadow: '0 10px 30px -10px rgba(99,102,241,0.2)'
      }}>
        <div style={{ fontSize: '1.75rem', animation: 'pulse-dot 2.5s infinite' }}>🎙️</div>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-light)', marginBottom: '0.2rem' }}>
            Charla Taller Presencial · Entrada Libre
          </div>
          <strong style={{ fontSize: '0.98rem', color: '#f1f5f9', display: 'block', marginBottom: '0.15rem' }}>
            ¿Cuánto Vale Tu Hora?
          </strong>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-soft)', display: 'block' }}>
            Viernes 29 de Mayo a las 20hs · Fundación Tendiendo Lazos (Pje. Ituzaingó 280)
          </span>
        </div>
        <Link to="/charla" className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', textDecoration: 'none' }}>
          Reservar Lugar gratis →
        </Link>
      </div>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="section-badge">Sistema Operativo para Emprendedores</div>
        <h1 style={{ marginBottom: '1.25rem' }}>
          Dejá de sobrevivir.<br />
          <span style={{ color: 'var(--accent-light)' }}>Empezá a construir.</span>
        </h1>
        <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem auto', fontSize: '1.05rem', lineHeight: '1.8' }}>
          Acompañamos a emprendedores a ordenar sus números, descubrir cuánto vale su hora
          y construir un modelo que funcione sin quemarlos.
        </p>
        <div className="action-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/diagnostico-gratis" className="btn-primary">Calculadora Financiera</Link>
          <Link to="/auditoria-vip" className="btn-outline">Generar Plan de Trabajo</Link>
        </div>
      </div>

      {/* ── Feature cards ── */}
      <div className="responsive-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', marginBottom: '1.1rem'
          }}>💰</div>
          <h3 style={{ color: 'var(--accent-light)', marginBottom: '0.75rem' }}>Sinceridad Numérica</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Entendemos lo difícil que es manejar un negocio a ciegas. Te ayudamos a ver tus números
            con claridad para que tomes decisiones desde la tranquilidad, no desde el estrés.
          </p>
        </div>

        <div className="card">
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', marginBottom: '1.1rem'
          }}>🗺️</div>
          <h3 style={{ color: 'var(--green)', marginBottom: '0.75rem' }}>Plan de Acción</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Al analizar tu situación, creamos una hoja de ruta adaptada a los cuellos de botella
            reales de tu proyecto. Pasos claros y accionables para avanzar seguro.
          </p>
        </div>

        <Link to="/capacitaciones" style={{ textDecoration: 'none' }}>
          <div
            className="card"
            style={{ height: '100%', cursor: 'pointer', borderColor: 'rgba(139,92,246,0.25)', transition: 'border-color 0.25s, transform 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#a78bfa', marginBottom: '0.75rem' }}>
              Centro de Recursos
            </div>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', marginBottom: '1.1rem'
            }}>📚</div>
            <h3 style={{ color: '#c4b5fd', marginBottom: '0.75rem' }}>Capacitaciones</h3>
            <p style={{ fontSize: '0.9rem' }}>
              Cartillas, presentaciones y calculadoras de los talleres activos.
              Material listo para proyectar o compartir.
            </p>
            <div style={{ marginTop: '1.25rem', fontSize: '0.82rem', fontWeight: 700, color: '#a78bfa' }}>
              Ver materiales →
            </div>
          </div>
        </Link>
      </div>

      {/* ── Tools accordion ── */}
      <div style={{ marginBottom: '3.5rem' }}>
        <button
          onClick={() => setToolsOpen(o => !o)}
          style={{
            width: '100%',
            background: toolsOpen
              ? 'rgba(99,102,241,0.08)'
              : 'rgba(15,23,42,0.7)',
            border: `1px solid ${toolsOpen ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
            borderRadius: toolsOpen ? '20px 20px 0 0' : '20px',
            padding: '1.1rem 1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.3s',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🛠️</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: toolsOpen ? 'var(--accent-light)' : 'var(--text)', fontFamily: 'inherit' }}>
                Herramientas gratuitas
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'inherit' }}>
                2 calculadoras listas para usar — sin registro
              </div>
            </div>
          </div>
          <span style={{
            color: 'var(--text-muted)',
            fontSize: '1rem',
            transform: toolsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
            display: 'inline-block',
            lineHeight: 1,
          }}>▾</span>
        </button>

        {/* Expandible */}
        <div style={{
          maxHeight: toolsOpen ? '600px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <div style={{
            background: 'rgba(10,18,35,0.85)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderTop: 'none',
            borderRadius: '0 0 20px 20px',
            padding: '1.25rem 1.5rem 1.5rem',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}>
            {TOOLS.map(tool => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1.1rem 1.25rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: `1px solid ${tool.accentBorder}`,
                  borderRadius: '14px',
                  textDecoration: 'none',
                  transition: 'background 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = tool.accent
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.3)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span style={{
                  fontSize: '1.75rem',
                  lineHeight: 1,
                  flexShrink: 0,
                  marginTop: '2px',
                }}>{tool.icon}</span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>{tool.name}</span>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px',
                      textTransform: 'uppercase', padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      background: tool.tagColor,
                      border: `1px solid ${tool.tagBorder}`,
                      color: tool.tagText,
                    }}>{tool.tag}</span>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-soft)', lineHeight: 1.6, margin: 0 }}>
                    {tool.desc}
                  </p>
                </div>

                <span style={{ color: 'var(--text-muted)', fontSize: '1rem', flexShrink: 0, alignSelf: 'center' }}>↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom callout ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '20px',
        padding: '2.5rem',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-soft)', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
          <em>"No queremos que estés remando solo a oscuras.<br />
          Construimos junto a vos."</em>
        </p>
        <Link to="/auditoria-vip" className="btn-primary">
          Empezar ahora →
        </Link>
      </div>

    </div>
  )
}
