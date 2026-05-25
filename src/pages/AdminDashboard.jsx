import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('charla') // 'charla' | 'auditorias'
  const [charlaRegistros, setCharlaRegistros] = useState([])
  const [auditorias, setAuditorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [copySuccess, setCopySuccess] = useState(null)

  // Acceso simple por PIN guardado en variable o local (por defecto usaremos un PIN básico 2026 o similar)
  const REQUIRED_PIN = import.meta.env.VITE_ADMIN_PIN || '2026'

  const handleLogin = (e) => {
    e.preventDefault()
    if (pin === REQUIRED_PIN) {
      setIsAuthenticated(true)
      setErrorMsg('')
      fetchData()
    } else {
      setErrorMsg('PIN incorrecto. Acceso denegado.')
    }
  }

  const fetchData = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      if (!supabase) {
        throw new Error('Supabase no está configurado.')
      }

      // 1. Cargar registros de la charla del 29
      const { data: charlaData, error: charlaErr } = await supabase
        .from('charla_registros')
        .select('*')
        .order('created_at', { ascending: false })

      if (charlaErr) console.warn('Error cargando inscriptos (puede que la tabla no exista aún):', charlaErr.message)
      else setCharlaRegistros(charlaData || [])

      // 2. Cargar auditorías de Nivel 2
      const { data: auditData, error: auditErr } = await supabase
        .from('nivel2_diagnostico')
        .select('*')
        .order('created_at', { ascending: false })

      if (auditErr) console.warn('Error cargando auditorías:', auditErr.message)
      else setAuditorias(auditData || [])

    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  // Copia el JSON estructurado al portapapeles en formato legible para la IA
  const handleCopyForIA = (audit, index) => {
    const data = audit.form_data || audit
    const formattedText = `
=== AUDITORÍA DE DESPEGUE DE ${data.nombre?.toUpperCase() || 'EMPRENDEDOR'} ===
- Ubicación: ${data.ubicacion || 'No especificada'}
- Situación Laboral: ${data.situacionLaboral || 'No especificada'}
- Horas disponibles semanales: ${data.horasDisponibles || 'No especificada'} hs
- Equipo o Solo: ${data.equipoOSolo || 'No especificado'}

- Qué vende: ${data.idea || 'No especificado'}
- Estado actual: ${data.estadoActual || 'No especificado'}
- Diferencial: ${data.diferencial || 'No especificado'}
- Cliente ideal: ${data.clienteIdeal || 'No especificado'}
- Competencia: ${data.competencia || 'No especificada'}

- Canales de venta: ${Array.isArray(data.canalesVenta) ? data.canalesVenta.join(', ') : 'Ninguno'}
- Cómo consigue clientes: ${data.comoConsigueClientes || 'No especificado'}
- Presencia online: ${data.presenciaOnline || 'No especificada'}

- Precio actual por producto: $${data.precioActual || '0'}
- Costo unitario variable: $${data.costoUnitario || '0'}
- Ventas mensuales promedio (unidades): ${data.ventasMensualesUnidades || '0'}
- Gastos fijos del negocio por mes: $${data.gastosFijos || '0'}
- Meta de ingreso neto mensual: $${data.metaIngreso || '0'}
- Presupuesto de inversión: ${data.presupuestoInversion || 'No especificado'}
- Nivel de urgencia: ${data.nivelUrgencia || 'No especificado'}

- Historial de proyectos: ${data.historialProyectos || 'No especificado'}
- Cuello de botella principal: ${data.cuelloBotella || 'No especificado'}
===================================================
Por favor, analiza estos datos y genera una hoja de ruta clínica de 90 días, paso a paso, con enfoque de rescate financiero.
    `.trim()

    navigator.clipboard.writeText(formattedText).then(() => {
      setCopySuccess(index)
      setTimeout(() => setCopySuccess(null), 2500)
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 1.5rem 10rem' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ marginBottom: '0.75rem' }}>Panel de Control</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: '1.5rem' }}>
            Ingresá el PIN de Supervisor para acceder a las tablas de control y auditorías.
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="PIN de acceso"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(2,6,23,0.7)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: 'var(--text)',
                fontFamily: 'inherit',
                fontSize: '1.1rem',
                textAlign: 'center',
                letterSpacing: '4px',
                marginBottom: '1rem',
                boxSizing: 'border-box'
              }}
              required
            />
            {errorMsg && <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginBottom: '1rem' }}>{errorMsg}</p>}
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
              Entrar al Panel
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-light)' }}>
            Consola de Administración
          </div>
          <h1 style={{ fontSize: '2rem', marginTop: '0.25rem', marginBottom: '0' }}>Supervisor: Jesus Battiato</h1>
        </div>
        <button className="btn-outline" onClick={fetchData} style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
          🔄 Actualizar Datos
        </button>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1px', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('charla')}
          style={{
            background: activeTab === 'charla' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'charla' ? '2px solid var(--accent-light)' : '2px solid transparent',
            color: activeTab === 'charla' ? 'var(--text)' : 'var(--text-muted)',
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 700,
            transition: 'all 0.2s',
            fontFamily: 'inherit'
          }}
        >
          🎙️ Charla Abierta (Inscriptos)
        </button>
        <button
          onClick={() => setActiveTab('auditorias')}
          style={{
            background: activeTab === 'auditorias' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'auditorias' ? '2px solid var(--accent-light)' : '2px solid transparent',
            color: activeTab === 'auditorias' ? 'var(--text)' : 'var(--text-muted)',
            padding: '0.75rem 1.25rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 700,
            transition: 'all 0.2s',
            fontFamily: 'inherit'
          }}
        >
          📋 Auditorías de Despegue (Nivel 2)
        </button>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent)' }}>Cargando datos en tiempo real...</div>}
      
      {errorMsg && (
        <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', padding: '1rem', borderRadius: '8px', color: 'var(--red)', marginBottom: '1.5rem' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* ── TAB 1: CHARLA REGISTROS ── */}
      {!loading && activeTab === 'charla' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>
              Total de inscriptos para el taller del Viernes 29: <strong>{charlaRegistros.length}</strong>
            </span>
          </div>
          
          <div style={{ overflowX: 'auto', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '14px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1rem' }}>Nombre</th>
                  <th style={{ padding: '1rem' }}>WhatsApp</th>
                  <th style={{ padding: '1rem' }}>Rubro</th>
                  <th style={{ padding: '1rem' }}>Pregunta / Duda</th>
                  <th style={{ padding: '1rem' }}>Registro</th>
                </tr>
              </thead>
              <tbody>
                {charlaRegistros.map((reg) => (
                  <tr key={reg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#f1f5f9' }}>{reg.nombre}</td>
                    <td style={{ padding: '1rem' }}>
                      <a href={`https://wa.me/${reg.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 600 }}>
                        📱 {reg.whatsapp}
                      </a>
                    </td>
                    <td style={{ padding: '1rem' }}><span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-light)', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>{reg.rubro}</span></td>
                    <td style={{ padding: '1rem', color: 'var(--text-soft)', fontStyle: 'italic', maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {reg.pregunta || '—'}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {reg.created_at ? new Date(reg.created_at).toLocaleDateString('es-AR') : '—'}
                    </td>
                  </tr>
                ))}
                {charlaRegistros.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Todavía no se registró nadie. ¡Compartí el link para empezar!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: AUDITORIAS NIVEL 2 ── */}
      {!loading && activeTab === 'auditorias' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>
              Planes de Trabajo solicitados: <strong>{auditorias.length}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {auditorias.map((audit, idx) => {
              const data = audit.form_data || audit
              return (
                <div key={audit.id} className="card" style={{ border: '1px solid var(--border)', padding: '1.5rem', background: 'var(--card-bg)' }}>
                  
                  {/* Header de tarjeta */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem', color: '#f1f5f9' }}>{data.nombre || 'Emprendedor'}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                        📍 {data.ubicacion || 'Sin ubicación'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        onClick={() => handleCopyForIA(audit, idx)}
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', background: copySuccess === idx ? 'var(--green)' : 'var(--accent)' }}
                      >
                        {copySuccess === idx ? '✓ Copiado para Chat' : '📋 Copiar para IA'}
                      </button>
                    </div>
                  </div>

                  {/* Cuerpo resumido */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Idea / Negocio</span>
                      <p style={{ margin: '0.2rem 0 0 0', color: '#cbd5e1' }}>{data.idea || '—'}</p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Canales</span>
                      <p style={{ margin: '0.2rem 0 0 0', color: '#cbd5e1' }}>
                        {Array.isArray(data.canalesVenta) ? data.canalesVenta.join(', ') : '—'}
                      </p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Urgencia / Bloqueo</span>
                      <p style={{ margin: '0.2rem 0 0 0', color: '#fecaca', fontWeight: 600 }}>{data.cuelloBotella || '—'}</p>
                    </div>
                  </div>

                  {/* Fila secundaria de números */}
                  <div style={{
                    marginTop: '1rem',
                    background: 'rgba(0,0,0,0.15)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    fontSize: '0.82rem',
                    border: '1px solid rgba(255,255,255,0.03)'
                  }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Precio:</span> <strong>${data.precioActual || '0'}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Costo unitario:</span> <strong>${data.costoUnitario || '0'}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Gastos fijos:</span> <strong>${data.gastosFijos || '0'}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Meta ingreso:</span> <strong style={{ color: 'var(--green)' }}>${data.metaIngreso || '0'}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Horas disp.:</span> <strong>{data.horasDisponibles || '0'}h/sem</strong></div>
                  </div>

                </div>
              )
            })}
            {auditorias.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--card-bg)', border: '1px dashed var(--border)', borderRadius: '14px' }}>
                Aún no hay auditorías enviadas.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
