import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Nivel2() {
  const [formData, setFormData] = useState({
    nombre: '', edad: '', ubicacion: '', situacionLaboral: '', horasDisponibles: '',
    idea: '', estadoActual: '', diferencial: '', clienteIdeal: '',
    competenciaUrls: '', presupuestoInicial: '', nivelUrgencia: '',
    metaIngreso: '', historialClinico: '', cuelloBotella: ''
  });
  
  const [noComp, setNoComp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setNoComp(e.target.checked);
    if (e.target.checked) {
      setFormData(prev => ({ ...prev, competenciaUrls: 'No sé contra quién compito' }));
    } else {
      setFormData(prev => ({ ...prev, competenciaUrls: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (supabase) {
      const { error } = await supabase
        .from('nivel2_diagnostico')
        .insert([{ form_data: formData, price_quoted: 0 }]);
      if (error) console.error("Error saving VIP lead:", error);
    }
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '5rem', paddingBottom: '10rem' }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '4rem 2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>¡Información asegurada!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Nuestra inteligencia de datos ya tiene todo lo que necesita. Generaremos tu Plan de Trabajo y te contactaremos de inmediato. Preparate para la realidad.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem', marginBottom: '5rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: 'rgba(22, 29, 45, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '3rem', maxWidth: '700px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', boxSizing: 'border-box' }}>
        
        <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#3b82f6', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Punto Cero</div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>Generar Plan de Trabajo</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '1rem' }}>Procesaremos detalladamente tus respuestas para entregarte una hoja de ruta estricta adaptada a tus cuellos de botella. Sé brutalmente honesto.</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Seccion 1 */}
          <div style={{ fontSize: '1.2rem', color: '#3b82f6', margin: '2rem 0 1.5rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(59,130,246,0.2)' }}>Sobre Vos</div>
          
          <div className="responsive-grid-small" style={{ marginBottom: '1.8rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>1. Nombre y Apellido</label>
              <input type="text" name="nombre" required placeholder="Ej: Juan Pérez" onChange={handleChange} style={inputStyles} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>2. Edad</label>
              <input type="number" name="edad" required placeholder="Ej: 33" onChange={handleChange} style={inputStyles} />
            </div>
          </div>

          <div className="responsive-grid-small" style={{ marginBottom: '1.8rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>3. Ubicación (Ciudad / País)</label>
              <input type="text" name="ubicacion" required placeholder="Ej: Buenos Aires, Argentina" onChange={handleChange} style={inputStyles} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>4. Situación Laboral Actual</label>
              <select name="situacionLaboral" required onChange={handleChange} style={inputStyles}>
                <option value="" disabled selected>Seleccioná...</option>
                <option value="empleado">Relación de dependencia (Empleado)</option>
                <option value="autonomo">Profesional Independiente</option>
                <option value="desempleado">Sin trabajo formal actualmente</option>
                <option value="dedicacion">Dedicado 100% a este emprendimiento</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>5. Disponibilidad Horaria Semanal</label>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', display: 'block' }}>Siendo brutalmente honesto, ¿cuántas horas vas a sentarte frente a esto?</span>
            <input type="number" name="horasDisponibles" required placeholder="Ej: 10 horas" onChange={handleChange} style={inputStyles} />
          </div>

          {/* Seccion 2 */}
          <div style={{ fontSize: '1.2rem', color: '#3b82f6', margin: '2rem 0 1.5rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(59,130,246,0.2)' }}>El Emprendimiento</div>

          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>6. Resumí la idea o negocio en 2 renglones</label>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', display: 'block' }}>Sin palabras poéticas. Qué vendés.</span>
            <textarea name="idea" required placeholder="Ej: Vendo servicios de poda..." onChange={handleChange} style={{...inputStyles, minHeight: '80px'}}></textarea>
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>7. Estado Actual del Proyecto</label>
            <select name="estadoActual" required onChange={handleChange} style={inputStyles}>
              <option value="" disabled selected>¿Dónde estás parado hoy?</option>
              <option value="idea">Es solo una idea</option>
              <option value="armado">Tengo marca armada pero no lancé</option>
              <option value="ventas_bajas">Ventas esporádicas</option>
              <option value="estancado">Vendiendo pero estancado</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>8. Tu Diferencial Competitivo</label>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', display: 'block' }}>¿Por qué alguien te compraría a vos?</span>
            <textarea name="diferencial" required onChange={handleChange} style={{...inputStyles, minHeight: '80px'}}></textarea>
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>9. Tu Cliente Ideal Promedio</label>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', display: 'block' }}>Quién es hoy tu público real.</span>
            <input type="text" name="clienteIdeal" required placeholder="Ej: Hombres de 40+..." onChange={handleChange} style={inputStyles} />
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>10. Análisis de Competencia Activa</label>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', display: 'block' }}>URLs directas o @usuarios de Instagram.</span>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.08)', opacity: noComp ? 0.3 : 1, pointerEvents: noComp ? 'none' : 'auto' }}>
              <input type="text" placeholder="URL Competidor 1" onChange={(e) => { if(!noComp){ setFormData({...formData, competenciaUrls: e.target.value}) } }} style={{...inputStyles, marginBottom: '0.5rem'}} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.9rem', color: '#cbd5e1', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer' }}>
              <input type="checkbox" onChange={handleCheckbox} style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }} />
              <span>No sé contra quién compito o no tengo links.</span>
            </label>
          </div>

          {/* Seccion 3 */}
          <div style={{ fontSize: '1.2rem', color: '#3b82f6', margin: '2rem 0 1.5rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(59,130,246,0.2)' }}>Fricciones y Finanzas</div>

          <div className="responsive-grid-small" style={{ marginBottom: '1.8rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>11. Presupuesto Actual</label>
              <select name="presupuestoInicial" required onChange={handleChange} style={inputStyles}>
                <option value="" disabled selected>Seleccioná...</option>
                <option value="zero">$0 ARS (Orgánico)</option>
                <option value="low">Menos de $50.000 ARS</option>
                <option value="mid">Entre $50K y $300K ARS</option>
                <option value="high">Más de $500K ARS</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>12. Nivel de Urgencia</label>
              <select name="nivelUrgencia" required onChange={handleChange} style={inputStyles}>
                <option value="" disabled selected>Seleccioná...</option>
                <option value="inmediata">Extrema (2 meses)</option>
                <option value="media">Moderada (1 año)</option>
                <option value="baja">Baja (Futuro)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>13. Meta de Ingreso Neto a 6 Meses</label>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', display: 'block' }}>Lo que querés limpio en bolsillo ($ ARS).</span>
            <input type="number" name="metaIngreso" required placeholder="Ej: 800000" onChange={handleChange} style={inputStyles} />
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>14. Historial Clínico</label>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', display: 'block' }}>¿Cerraste otros proyectos antes?</span>
            <textarea name="historialClinico" required onChange={handleChange} style={{...inputStyles, minHeight: '80px'}}></textarea>
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem' }}>15. El Cuello de Botella Final</label>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', display: 'block' }}>Último escollo u obstáculo emocional/técnico.</span>
            <textarea name="cuelloBotella" required onChange={handleChange} style={{...inputStyles, minHeight: '80px'}}></textarea>
          </div>

          <div style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button type="submit" disabled={isSubmitting} style={{ width: '100%', background: '#3b82f6', color: 'white', fontSize: '1.1rem', fontWeight: 700, padding: '1.2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.3s' }}>
              {isSubmitting ? 'Auditando Datos...' : 'Auditar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

const inputStyles = {
  width: '100%',
  backgroundColor: '#0f172a',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '8px',
  padding: '1rem',
  color: '#f8fafc',
  fontFamily: 'inherit',
  fontSize: '0.95rem',
  boxSizing: 'border-box'
};
