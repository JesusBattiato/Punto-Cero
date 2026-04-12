import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Nivel1() {
  const [data, setData] = useState({
    p_venta: 10000,
    c_variable: 4000,
    g_fijos: 50000,
    h_libres: 10,
    t_unidad: 2,
    email: ''
  })

  const [results, setResults] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const calculate = () => {
    const p_venta = parseFloat(data.p_venta) || 0
    const c_variable = parseFloat(data.c_variable) || 0
    const g_fijos = parseFloat(data.g_fijos) || 0
    const h_libres = parseFloat(data.h_libres) || 0
    const t_unidad = parseFloat(data.t_unidad) || 0

    const margen = p_venta - c_variable
    const hd_mensual = h_libres * 4 // 4 weeks

    let statusType = 'green'
    let title = '¡Negocio Viable!'
    let desc = 'Tu punto de equilibrio es bajo y los márgenes fenomenales.'
    let equilibrio = 'Imposible'
    let hn_mensual = 'Imposible'

    if (p_venta <= 0) return

    if (margen <= 0) {
      statusType = 'red'
      title = 'Crónica de un Colapso'
      desc = 'Tus costos superan tus ingresos. No es negocio.'
    } else {
      equilibrio = Math.ceil(g_fijos / margen)
      hn_mensual = Math.ceil(equilibrio * t_unidad)

      if (hn_mensual > hd_mensual) {
        statusType = 'red'
        title = 'Límite Físico Superado'
        desc = `Necesitas trabajar ${hn_mensual}hs pero solo tienes ${hd_mensual}hs.`
      } else if ((hn_mensual / hd_mensual) > 0.7 || (margen / p_venta) < 0.3) {
        statusType = 'yellow'
        title = 'Pasatiempo Caro'
        desc = 'Vas a trabajar como esclavo solo para cubrir costos.'
      }
    }

    setResults({ margen, hd_mensual, equilibrio, hn_mensual, statusType, title, desc })
  }

  useEffect(() => {
    calculate()
  }, [data.p_venta, data.c_variable, data.g_fijos, data.h_libres, data.t_unidad])

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!data.email) {
      alert("Necesitas ingresar tu email para continuar.")
      return
    }

    if (supabase) {
      setIsSubmitting(true)
      try {
        const { error } = await supabase
          .from('nivel1_maquina')
          .insert([
            { email: data.email, raw_data: data, results: results }
          ])
        if (error) console.error("Error saving lead:", error)
      } catch (err) {
        console.error("Fetch error:", err)
      }
      setIsSubmitting(false)
    }
    setSubmitted(true)
  }

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--text-primary)' }}>La Máquina de la Verdad</h1>
        <p>Baño de realidad matemática. No te mientas a ti mismo.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem' }}>
        
        {/* INPUTS */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Tus Números Crudos</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Precio de Venta ($ ARS)</label>
            <input type="number" name="p_venta" value={data.p_venta} onChange={handleChange} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Costo Variable ($ ARS) por unidad</label>
            <input type="number" name="c_variable" value={data.c_variable} onChange={handleChange} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Gastos Fijos Mensuales ($ ARS)</label>
            <input type="number" name="g_fijos" value={data.g_fijos} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Hs Libres/Semana</label>
              <input type="number" name="h_libres" value={data.h_libres} onChange={handleChange} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Mano de obra (Hs)</label>
              <input type="number" name="t_unidad" value={data.t_unidad} step="0.5" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {results && (
            <>
              <div style={{ 
                width: '60px', height: '60px', borderRadius: '50%', marginBottom: '1rem',
                backgroundColor: results.statusType === 'green' ? 'var(--success)' : results.statusType === 'red' ? 'var(--danger)' : 'var(--warning)',
                boxShadow: `0 0 20px ${results.statusType === 'green' ? 'var(--success)' : results.statusType === 'red' ? 'var(--danger)' : 'var(--warning)'}`
              }}></div>
              
              <h2 style={{ 
                color: results.statusType === 'green' ? 'var(--success)' : results.statusType === 'red' ? 'var(--danger)' : 'var(--warning)',
                marginBottom: '1rem'
              }}>
                {results.title}
              </h2>
              <p style={{ marginBottom: '2rem' }}>{results.desc}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', marginBottom: '2rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <small style={{ color: 'var(--text-secondary)' }}>Ganancia Neta</small>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>${results.margen.toFixed(2)}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <small style={{ color: 'var(--text-secondary)' }}>Eq. Ventas/Mes</small>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{results.equilibrio}</div>
                </div>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Si quieres que revisemos este caso manualmente, deja tu correo:</p>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="tu@email.com" 
                    value={data.email} 
                    onChange={handleChange} 
                    style={{ marginBottom: '1rem' }}
                    required
                  />
                  <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Pedir Diagnóstico Rápido'}
                  </button>
                </form>
              ) : (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', width: '100%' }}>
                  <strong>¡Enviado a nuestro sistema!</strong><br />Analizaremos tus números y te contactaremos.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
