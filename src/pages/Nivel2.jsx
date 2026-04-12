import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Nivel2() {
  const [formData, setFormData] = useState({
    nombre: '', edad: '', ubicacion: '', situacionLaboral: '', horasDisponibles: '',
    idea: '', estadoActual: '', diferencial: '', clienteIdeal: '',
    competenciaUrls: '', presupuestoInicial: '', nivelUrgencia: '',
    metaIngreso: '', historialClinico: '', cuelloBotella: ''
  })
  
  const [arsPrice, setArsPrice] = useState(7999)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Dynamic dollar
    fetch('https://dolarapi.com/v1/dolares/blue')
      .then(res => res.json())
      .then(data => {
        if(data.venta) {
          const calc = Math.round((8 * data.venta) / 100) * 100 - 1
          setArsPrice(calc < 7999 ? 7999 : calc)
        }
      })
      .catch(() => setArsPrice(7999))
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (supabase) {
      const { error } = await supabase
        .from('nivel2_diagnostico')
        .insert([{ form_data: formData, price_quoted: arsPrice }])
      
      if (error) console.error("Error saving VIP lead:", error)
    }
    
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <h2 style={{ color: 'var(--success)' }}>Su información está ahora en nuestro sistema central.</h2>
        <p>Procesaremos la inteligencia en las próximas 48 horas. Esté atento a su correo o WhatsApp.</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingBottom: '5rem', maxWidth: '800px' }}>
      <div className="card">
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Generador de Plan de Trabajo VIP</h2>
          <p>Procesamiento automatizado por inteligencia de datos.</p>
          <div style={{ display: 'inline-block', background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', padding: '0.5rem 1rem', borderRadius: '20px', marginTop: '1rem', border: '1px solid rgba(59,130,246,0.3)', fontWeight: 'bold' }}>
            Costo de validación del sistema: $ {arsPrice} ARS
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <h3 style={{ borderBottom: '1px solid rgba(59,130,246,0.2)', paddingBottom: '0.5rem', color: '#fff' }}>1. Variables Base</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label>Nombre y Apellido</label>
              <input type="text" name="nombre" required onChange={handleChange} />
            </div>
            <div>
              <label>Edad</label>
              <input type="number" name="edad" required onChange={handleChange} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label>Ubicación (Ciudad, País)</label>
              <input type="text" name="ubicacion" required onChange={handleChange} />
            </div>
            <div>
              <label>Horas Disponibles / Semana</label>
              <input type="number" name="horasDisponibles" required onChange={handleChange} />
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid rgba(59,130,246,0.2)', paddingBottom: '0.5rem', color: '#fff', marginTop: '1rem' }}>2. El Negocio Crudo</h3>
          
          <div>
            <label>Idea Central (2 renglones)</label>
            <textarea name="idea" required onChange={handleChange} style={{ minHeight: '60px' }}></textarea>
          </div>
          <div>
            <label>Estado Actual</label>
            <textarea name="estadoActual" required onChange={handleChange} placeholder="Ej: Vendo algo, estancado..."></textarea>
          </div>
          <div>
            <label>Diferencial / Ego (¿Por qué elegirte?)</label>
            <textarea name="diferencial" required onChange={handleChange}></textarea>
          </div>
          <div>
            <label>Cliente Ideal / Links de Competencia</label>
            <textarea name="competenciaUrls" onChange={handleChange}></textarea>
          </div>

          <h3 style={{ borderBottom: '1px solid rgba(59,130,246,0.2)', paddingBottom: '0.5rem', color: '#fff', marginTop: '1rem' }}>3. Fricción y Finanzas</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label>Presupuesto Liquido Actual (USD)</label>
              <input type="text" name="presupuestoInicial" required onChange={handleChange} />
            </div>
            <div>
              <label>Meta de Ingreso a 6 meses ($ARS netos)</label>
              <input type="number" name="metaIngreso" required onChange={handleChange} />
            </div>
          </div>
          
          <div>
             <label>Nivel de Urgencia (¿Vida o Muerte?)</label>
             <input type="text" name="nivelUrgencia" required onChange={handleChange} />
          </div>

          <div>
             <label>Historial de Fracasos Previos</label>
             <textarea name="historialClinico" required onChange={handleChange}></textarea>
          </div>

          <div>
             <label style={{ color: 'var(--danger)' }}>Cuello de Botella Final (¿Qué te paraliza?)</label>
             <textarea name="cuelloBotella" required onChange={handleChange}></textarea>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '1.2rem', padding: '1.2rem', marginTop: '1rem' }} disabled={isSubmitting}>
             {isSubmitting ? 'Transmitiendo a JARVIS...' : `Abonar $${arsPrice} y Auditar`}
          </button>

        </form>
      </div>
    </div>
  )
}
