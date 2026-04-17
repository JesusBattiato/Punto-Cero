import React, { useState } from 'react'

// ── Data de capacitaciones ──────────────────────────────────────────────────
const capacitaciones = [
  {
    id: 'sueldo-fantasma',
    cliente: 'Punto Cero',
    titulo: '¿Cuánto Vale Tu Hora?',
    subtitulo: 'Economía Emprendedora',
    descripcion: 'Taller de educación financiera para emprendedores. Costos fijos, sueldo fantasma y punto de equilibrio.',
    color: '#3b82f6',
    colorLight: 'rgba(59,130,246,0.1)',
    tag: 'Emprendedores',
    recursos: [
      {
        tipo: 'Cartilla',
        icono: '📄',
        titulo: 'Manual Clínico: Economía Emprendedora',
        descripcion: '10 páginas · Teoría + ejercicios prácticos',
        url: '/capacitaciones/sueldo-fantasma/cartilla-economia-emprendedora.html',
      },
      {
        tipo: 'Presentación',
        icono: '🖥️',
        titulo: 'Presentación: ¿Cuánto Vale Tu Hora?',
        descripcion: '9 slides interactivos · Con calculadora embebida',
        url: '/capacitaciones/sueldo-fantasma/presentacion.html',
      },
      {
        tipo: 'Herramienta',
        icono: '🧮',
        titulo: 'Máquina de la Verdad',
        descripcion: 'Calculadora financiera interactiva',
        url: '/capacitaciones/sueldo-fantasma/maquina-de-la-verdad.html',
      },
    ],
  },
  {
    id: 'psicotec',
    cliente: 'Psicotec',
    titulo: 'Inserción Profesional en Salud',
    subtitulo: 'IES Ramón Carrillo · Sede Tartagal',
    descripcion: 'Taller vivencial de empleabilidad para egresados de tecnicaturas sanitarias. Autoconocimiento, marca personal y oratoria.',
    color: '#7c3aed',
    colorLight: 'rgba(124,58,237,0.1)',
    tag: 'Salud · RR.HH.',
    recursos: [
      {
        tipo: 'Cartilla',
        icono: '📄',
        titulo: 'Cartilla: Desarrollo de los 3 Ejes',
        descripcion: '11 páginas · Guía de trabajo completa por eje temático',
        url: '/capacitaciones/psicotec/cartilla-ejes-empleabilidad.html',
      },
      {
        tipo: 'Presentación',
        icono: '🖥️',
        titulo: 'Presentación: Estrategias de Inserción',
        descripcion: '12 slides · Navegación por teclado y scroll',
        url: '/capacitaciones/psicotec/presentacion-empleabilidad.html',
      },
    ],
  },
]

// ── Componente ──────────────────────────────────────────────────────────────
export default function Capacitaciones() {
  const [activo, setActivo] = useState(null)

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>
          Materiales de Capacitación
        </div>
        <h1 style={{ marginBottom: '1rem' }}>Centro de Recursos</h1>
        <p style={{ maxWidth: '600px', fontSize: '1.05rem' }}>
          Acceso directo a las cartillas y presentaciones de todos los talleres activos.
          Materiales listos para proyectar o imprimir.
        </p>
      </div>

      {/* Grid de capacitaciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {capacitaciones.map((cap) => (
          <div
            key={cap.id}
            style={{
              background: 'var(--card-bg)',
              border: `1px solid ${activo === cap.id ? cap.color : 'var(--border-color)'}`,
              borderRadius: '20px',
              overflow: 'hidden',
              transition: 'border-color 0.25s',
            }}
          >
            {/* Cabecera de la capacitación */}
            <button
              onClick={() => setActivo(activo === cap.id ? null : cap.id)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '1.75rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                textAlign: 'left',
              }}
            >
              {/* Dot de color */}
              <div style={{
                width: '14px', height: '14px', borderRadius: '50%',
                background: cap.color, flexShrink: 0,
                boxShadow: `0 0 10px ${cap.color}80`,
              }} />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px',
                    textTransform: 'uppercase', color: cap.color,
                    background: cap.colorLight, padding: '0.25rem 0.75rem', borderRadius: '99px',
                  }}>
                    {cap.tag}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#4b5563', fontWeight: 500 }}>{cap.cliente}</span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
                  {cap.titulo}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{cap.subtitulo}</div>
              </div>

              {/* Contador de recursos + flecha */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <span style={{ fontSize: '0.8rem', color: '#4b5563', fontWeight: 600 }}>
                  {cap.recursos.length} archivos
                </span>
                <span style={{
                  color: cap.color, fontSize: '1.1rem',
                  transform: activo === cap.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s',
                  display: 'inline-block',
                }}>▾</span>
              </div>
            </button>

            {/* Panel de recursos (expandible) */}
            {activo === cap.id && (
              <div style={{
                borderTop: `1px solid ${cap.color}30`,
                padding: '1.5rem 2rem 2rem 2rem',
                background: cap.colorLight,
              }}>
                <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', color: '#94a3b8' }}>
                  {cap.descripcion}
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1rem',
                }}>
                  {cap.recursos.map((rec, i) => (
                    <a
                      key={i}
                      href={rec.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        padding: '1.25rem',
                        background: 'rgba(0,0,0,0.25)',
                        border: `1px solid ${cap.color}30`,
                        borderRadius: '12px',
                        textDecoration: 'none',
                        transition: 'border-color 0.2s, transform 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = cap.color
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = `${cap.color}30`
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{rec.icono}</span>
                      <div>
                        <div style={{
                          fontSize: '0.65rem', fontWeight: 800, letterSpacing: '2px',
                          textTransform: 'uppercase', color: cap.color, marginBottom: '0.3rem',
                        }}>
                          {rec.tipo}
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem' }}>
                          {rec.titulo}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {rec.descripcion}
                        </div>
                      </div>
                      <span style={{ marginLeft: 'auto', color: cap.color, fontSize: '1rem', flexShrink: 0 }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.8rem', color: '#374151' }}>
        Sistemas en Línea · Estrategia Operativa Punto Cero
      </p>
    </div>
  )
}
