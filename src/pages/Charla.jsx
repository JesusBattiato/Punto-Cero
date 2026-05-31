import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Charla() {
  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '',
    rubro: '',
    pregunta: '',
  })
  const [activeTalk, setActiveTalk] = useState(null)
  const [loadingTalk, setLoadingTalk] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function fetchActiveTalk() {
      if (!supabase) {
        setLoadingTalk(false)
        return
      }
      try {
        const { data, error } = await supabase
          .from('charlas')
          .select('*')
          .eq('activa', true)
          .order('created_at', { ascending: false })
          .limit(1)

        if (error) {
          console.error('Error fetching active talk:', error)
        } else if (data && data.length > 0) {
          setActiveTalk(data[0])
        }
      } catch (err) {
        console.error('Error loading talk details:', err)
      } finally {
        setLoadingTalk(false)
      }
    }
    fetchActiveTalk()
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (supabase && activeTalk) {
      const { error } = await supabase
        .from('charla_registros')
        .insert([{
          nombre: formData.nombre,
          whatsapp: formData.whatsapp,
          rubro: formData.rubro,
          pregunta: formData.pregunta,
          fecha_charla: activeTalk.fecha_identificador,
          charla_id: activeTalk.id
        }])
      
      if (error) {
        console.error('Error saving registration:', error)
        alert('Error al guardar la inscripción: ' + error.message)
      } else {
        setSubmitted(true)
      }
    } else {
      // Fallback
      setSubmitted(true)
    }

    setIsSubmitting(false)
  }

  if (loadingTalk) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--accent-light)', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.2rem', animation: 'spin 1.5s infinite linear' }}>🔄</span> Cargando detalles del taller...
      </div>
    )
  }

  if (!activeTalk) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 1.5rem 10rem' }}>
        <div className="card" style={{ maxWidth: '540px', width: '100%', textAlign: 'center', padding: '3.5rem 2.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🎟️</div>
          <h2 style={{ marginBottom: '1.25rem', color: 'var(--text-muted)' }}>Inscripciones Cerradas</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#cbd5e1', marginBottom: '2rem' }}>
            Por el momento no tenemos talleres o charlas con inscripciones abiertas.
          </p>
          <div style={{
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'var(--text-soft)',
            lineHeight: '1.6'
          }}>
            📢 ¡Te mantendremos al tanto! Estate atento/a a las novedades en la página de inicio o ponte en contacto con nosotros para enterarte de los próximos encuentros prácticos.
          </div>
          <div style={{ marginTop: '2.5rem' }}>
            <Link to="/" className="btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>
              Volver a la Página Principal
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 1.5rem 10rem' }}>
        <div className="card" style={{ maxWidth: '540px', width: '100%', textAlign: 'center', padding: '3.5rem 2.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🎟️</div>
          <h2 style={{ marginBottom: '1rem', color: 'var(--accent-light)' }}>¡Lugar reservado!</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#cbd5e1', marginBottom: '2rem' }}>
            Listo, ya te agendamos para la charla. Nos vemos el <strong>{activeTalk.fecha_descripcion}</strong> en <strong>{activeTalk.lugar}</strong> ({activeTalk.direccion}).
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            textAlign: 'left',
            fontSize: '0.9rem',
            color: 'var(--text-soft)',
            lineHeight: '1.6'
          }}>
            📍 <strong>Ubicación:</strong> {activeTalk.lugar} - {activeTalk.direccion} {activeTalk.detalle_direccion ? `(${activeTalk.detalle_direccion})` : ''}<br />
            ⏰ <strong>Hora:</strong> {activeTalk.fecha_descripcion}<br />
            💡 <strong>Qué traer:</strong> Tu celular con batería para usar las calculadoras interactivas en vivo.
          </div>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/" className="btn-outline" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', textDecoration: 'none' }}>
              Volver a Inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1.5rem 6rem' }}>
      <div className="card" style={{ maxWidth: '640px', width: '100%', padding: '2.5rem' }}>
        
        {/* Badge & Title */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <div className="brand-badge" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '999px',
            padding: '0.35rem 1rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'var(--accent-light)',
            marginBottom: '1rem',
          }}>Taller Presencial Abierto</div>
          
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>
            {activeTalk.titulo}
          </h1>
          
          <p style={{ fontSize: '0.95rem', color: 'var(--text-soft)', lineHeight: '1.7', maxWidth: '500px', margin: '0 auto' }}>
            {activeTalk.descripcion || 'Un encuentro práctico y honesto para desarmar los números de tu negocio y descubrir si estás cobrando lo justo.'}
          </p>
        </div>

        {/* Event Details Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '2rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Cuándo</span>
            <strong style={{ color: '#f1f5f9' }}>{activeTalk.fecha_descripcion}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Dónde</span>
            <strong style={{ color: '#f1f5f9' }}>{activeTalk.lugar}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Dirección</span>
            <strong style={{ color: '#cbd5e1' }}>{activeTalk.direccion}</strong>
            {activeTalk.detalle_direccion && (
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeTalk.detalle_direccion}</span>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>Nombre y Apellido</label>
            <input
              type="text"
              name="nombre"
              required
              placeholder="Ej: María Luz"
              value={formData.nombre}
              onChange={handleChange}
              style={{
                width: '100%', backgroundColor: 'rgba(2,6,23,0.7)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--text)',
                fontFamily: 'inherit', fontSize: '0.95rem', boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>Número de WhatsApp</label>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Para avisarte si hay algún cambio o enviarte los materiales después.</span>
            <input
              type="tel"
              name="whatsapp"
              required
              placeholder="Ej: 3873 123456"
              value={formData.whatsapp}
              onChange={handleChange}
              style={{
                width: '100%', backgroundColor: 'rgba(2,6,23,0.7)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--text)',
                fontFamily: 'inherit', fontSize: '0.95rem', boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>¿De qué es tu emprendimiento?</label>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Nos ayuda a preparar ejemplos reales para la charla.</span>
            <input
              type="text"
              name="rubro"
              required
              placeholder="Ej: Pastelería, costura, consultoría, diseño"
              value={formData.rubro}
              onChange={handleChange}
              style={{
                width: '100%', backgroundColor: 'rgba(2,6,23,0.7)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--text)',
                fontFamily: 'inherit', fontSize: '0.95rem', boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>¿Alguna duda particular sobre costos o precios? (Opcional)</label>
            <textarea
              name="pregunta"
              placeholder="Ej: No sé si contar mi tiempo al armar un pedido o cómo calcular la luz."
              value={formData.pregunta}
              onChange={handleChange}
              style={{
                width: '100%', backgroundColor: 'rgba(2,6,23,0.7)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--text)',
                fontFamily: 'inherit', fontSize: '0.95rem', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box'
              }}
            />
          </div>

          <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', marginTop: '1rem' }}
          >
            {isSubmitting ? 'Reservando...' : 'Reservar mi lugar gratis →'}
          </button>
        </form>

      </div>
    </div>
  )
}
