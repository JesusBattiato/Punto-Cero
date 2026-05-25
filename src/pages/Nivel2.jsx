import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

// ── Field styles using design system ─────────────────────────────────────────
const S = {
  field: { marginBottom: '1.6rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: '#cbd5e1' },
  hint:  { fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block', lineHeight: 1.5 },
  input: {
    width: '100%', backgroundColor: 'rgba(2,6,23,0.7)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--text)',
    fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: 500, boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  textarea: {
    width: '100%', backgroundColor: 'rgba(2,6,23,0.7)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--text)',
    fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: 500, boxSizing: 'border-box',
    minHeight: '90px', resize: 'vertical', lineHeight: 1.6,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
}

function Field({ number, label, hint, children }) {
  return (
    <div style={S.field}>
      <label style={S.label}>{number && <span style={{ color: 'var(--accent-light)', marginRight: '0.4rem' }}>{number}.</span>}{label}</label>
      {hint && <span style={S.hint}>{hint}</span>}
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div className="section-divider" style={{ margin: '2.5rem 0 1.75rem 0' }}>
      {children}
    </div>
  )
}

export default function Nivel2() {
  const [formData, setFormData] = useState({
    // Sobre vos
    nombre: '', ubicacion: '', situacionLaboral: '', horasDisponibles: '', equipoOSolo: '',
    // El negocio
    idea: '', estadoActual: '', diferencial: '', clienteIdeal: '', competencia: '',
    // Canales
    canalesVenta: [], comoConsigueClientes: '',
    presenciaOnline: '',
    // Números reales
    precioActual: '', costoUnitario: '', ventasMensualesUnidades: '', gastosFijos: '',
    presupuestoInversion: '', metaIngreso: '', nivelUrgencia: '',
    // Bloqueos
    historialProyectos: '', cuelloBotella: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const toggleCanal = (canal) => {
    setFormData(prev => {
      const arr = prev.canalesVenta
      return {
        ...prev,
        canalesVenta: arr.includes(canal) ? arr.filter(c => c !== canal) : [...arr, canal]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (supabase) {
      const { error } = await supabase
        .from('nivel2_diagnostico')
        .insert([{ form_data: formData, price_quoted: 0 }])
      if (error) {
        console.error('Error saving:', error)
        alert('Error de base de datos: ' + error.message)
      }
    } else {
      alert('Sin conexión a la base de datos. Verificá las variables de entorno.')
    }
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '5rem', paddingBottom: '10rem' }}>
        <div className="card" style={{ maxWidth: '580px', margin: '0 auto', padding: '3.5rem 2.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ marginBottom: '1rem' }}>¡Información recibida!</h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
            Nuestra inteligencia de datos ya tiene todo lo que necesita.
            Vamos a procesar tu situación y generaremos tu Plan de Trabajo personalizado.
            Te contactaremos a la brevedad.
          </p>
        </div>
      </div>
    )
  }

  const canales = ['Instagram / TikTok', 'WhatsApp', 'Ferias / Mercados', 'Local físico', 'MercadoLibre / Marketplace', 'Boca a boca', 'Página web', 'Email / Newsletter']

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 1.5rem 6rem' }}>
      <div className="card" style={{ maxWidth: '720px', width: '100%', padding: '2.5rem 2.5rem 3rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1.75rem', marginBottom: '0.5rem' }}>
          <div className="section-badge" style={{ marginBottom: '1rem' }}>Plan de Trabajo</div>
          <h2 style={{ marginBottom: '0.75rem' }}>Auditoría de Despegue</h2>
          <p style={{ fontSize: '0.88rem', maxWidth: '500px', margin: '0 auto', lineHeight: '1.7' }}>
            Respondé con honestidad brutal. Cuanto más preciso seas, más concreto y accionable será tu plan.
            No hay respuestas incorrectas — hay respuestas honestas.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── SECCIÓN 1: SOBRE VOS ── */}
          <SectionTitle>👤 Sobre vos</SectionTitle>

          <div className="responsive-grid-small">
            <Field number="1" label="Nombre y Apellido">
              <input type="text" name="nombre" required placeholder="Ej: María González" onChange={set} style={S.input} />
            </Field>
            <Field number="2" label="Ciudad / País">
              <input type="text" name="ubicacion" required placeholder="Ej: Tartagal, Salta" onChange={set} style={S.input} />
            </Field>
          </div>

          <div className="responsive-grid-small">
            <Field number="3" label="Situación laboral actual">
              <select name="situacionLaboral" required onChange={set} style={S.input}>
                <option value="" disabled defaultValue="">Seleccioná...</option>
                <option value="empleado">En relación de dependencia</option>
                <option value="autonomo">Profesional independiente</option>
                <option value="desempleado">Sin trabajo formal actualmente</option>
                <option value="dedicacion">Dedicado 100% al emprendimiento</option>
              </select>
            </Field>
            <Field number="4" label="Horas semanales disponibles"
              hint="Sé honesto. ¿Cuántas horas reales podés sentarte a trabajar en esto?">
              <input type="number" name="horasDisponibles" required placeholder="Ej: 10" min="1" onChange={set} style={S.input} />
            </Field>
          </div>

          <Field number="5" label="¿Trabajás solo/a o tenés ayuda?"
            hint="Esto define cuánto podés delegar y cómo escalar.">
            <select name="equipoOSolo" required onChange={set} style={S.input}>
              <option value="" disabled defaultValue="">Seleccioná...</option>
              <option value="solo">Solo/a, hago todo yo</option>
              <option value="familiar">Con ayuda familiar informal</option>
              <option value="socio">Tengo un socio o socia</option>
              <option value="equipo_chico">Equipo pequeño (1-3 personas)</option>
              <option value="equipo_mediano">Equipo mediano (4+ personas)</option>
            </select>
          </Field>

          {/* ── SECCIÓN 2: EL NEGOCIO ── */}
          <SectionTitle>🏪 El negocio</SectionTitle>

          <Field number="6" label="¿Qué vendés? Resumilo en 2 renglones."
            hint="Sin palabras poéticas. Producto o servicio concreto.">
            <textarea name="idea" required placeholder="Ej: Fabrico y vendo velas aromáticas artesanales. También hago talleres de aromaterapia en grupos." onChange={set} style={S.textarea} />
          </Field>

          <div className="responsive-grid-small">
            <Field number="7" label="Estado actual del proyecto">
              <select name="estadoActual" required onChange={set} style={S.input}>
                <option value="" disabled defaultValue="">¿Dónde estás hoy?</option>
                <option value="idea">Solo tengo la idea</option>
                <option value="armado">Armado pero sin lanzar</option>
                <option value="ventas_bajas">Ventas esporádicas</option>
                <option value="estancado">Vendiendo pero estancado</option>
                <option value="creciendo">Creciendo y necesito orden</option>
              </select>
            </Field>
            <Field number="8" label="Nivel de urgencia">
              <select name="nivelUrgencia" required onChange={set} style={S.input}>
                <option value="" disabled defaultValue="">Nivel de urgencia</option>
                <option value="inmediata">Crítica — necesito cambios en 2 meses</option>
                <option value="media">Moderada — tengo margen de 6-12 meses</option>
                <option value="baja">Baja — exploro para el futuro</option>
              </select>
            </Field>
          </div>

          <Field number="9" label="¿Por qué te comprarían a vos y no a otro?"
            hint="Tu diferencial real. No el que querés tener — el que tenés hoy.">
            <textarea name="diferencial" required placeholder="Ej: Uso ingredientes naturales certificados y entrego en 24hs con packaging personalizado." onChange={set} style={S.textarea} />
          </Field>

          <Field number="10" label="¿Quién es tu cliente ideal hoy?"
            hint="Descripción concreta: edad, situación, dónde vive, qué le duele.">
            <textarea name="clienteIdeal" required placeholder="Ej: Mujeres de 30-45 años, zona urbana, con interés en bienestar. Buscan regalos originales y tienen presupuesto medio-alto." onChange={set} style={S.textarea} />
          </Field>

          <Field number="11" label="¿Conocés tu competencia?"
            hint="Describila brevemente. No necesitamos links — necesitamos tu análisis.">
            <textarea name="competencia" placeholder="Ej: Hay 3-4 productoras locales en Instagram. Cobran menos que yo pero no tienen diferenciación de producto. También compito con marcas de Buenos Aires con mejor presencia online." onChange={set} style={S.textarea} />
          </Field>

          {/* ── SECCIÓN 3: CANALES ── */}
          <SectionTitle>📣 Canales y clientes</SectionTitle>

          <Field number="12" label="¿Dónde vendés actualmente? (Seleccioná todos los que apliquen)">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
              {canales.map(c => {
                const active = formData.canalesVenta.includes(c)
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCanal(c)}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: '999px',
                      border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                      background: active ? 'rgba(99,102,241,0.15)' : 'rgba(0,0,0,0.2)',
                      color: active ? 'var(--accent-light)' : 'var(--text-soft)',
                      fontSize: '0.8rem',
                      fontWeight: active ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: 'inherit',
                    }}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field number="13" label="¿Cómo conseguís clientes hoy?"
            hint="Sé específico: ¿vienen solos, los buscás, publicás, pedís referidos?">
            <textarea name="comoConsigueClientes" required placeholder="Ej: El 80% viene por recomendación de clientes anteriores. Publico 2 veces por semana en Instagram pero no sé si funciona. Nunca hice publicidad paga." onChange={set} style={S.textarea} />
          </Field>

          <Field number="14" label="¿Tenés presencia online? Describila."
            hint="Instagram, web, catálogo digital, reseñas, seguidores aproximados — lo que haya.">
            <textarea name="presenciaOnline" placeholder="Ej: Instagram con 800 seguidores, baja interacción. No tengo web. Sí tengo perfil de MercadoLibre pero casi no lo uso." onChange={set} style={S.textarea} />
          </Field>

          {/* ── SECCIÓN 4: NÚMEROS REALES ── */}
          <SectionTitle>💰 Los números reales</SectionTitle>

          <div style={{
            background: 'rgba(99,102,241,0.05)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.82rem',
            color: 'var(--accent-light)',
            lineHeight: 1.6
          }}>
            💡 Esta sección es la más importante. Sin números reales, cualquier plan es puro deseo. Si no los tenés exactos, aproximá honestamente.
          </div>

          <div className="responsive-grid-small">
            <Field number="15" label="¿Cuánto cobrás por producto o servicio?"
              hint="Precio promedio de venta al cliente.">
              <input type="number" name="precioActual" placeholder="$ ARS" min="0" onChange={set} style={S.input} />
            </Field>
            <Field number="16" label="¿Cuánto te cuesta producir uno?"
              hint="Materiales + insumos directos. No incluyas tu tiempo todavía.">
              <input type="number" name="costoUnitario" placeholder="$ ARS" min="0" onChange={set} style={S.input} />
            </Field>
          </div>

          <div className="responsive-grid-small">
            <Field number="17" label="¿Cuántas unidades / servicios vendés por mes hoy?"
              hint="Promedio real de los últimos 3 meses.">
              <input type="number" name="ventasMensualesUnidades" placeholder="Ej: 20" min="0" onChange={set} style={S.input} />
            </Field>
            <Field number="18" label="Gastos fijos mensuales del emprendimiento"
              hint="Monotributo, internet, alquiler, herramientas. Solo del negocio.">
              <input type="number" name="gastosFijos" placeholder="$ ARS" min="0" onChange={set} style={S.input} />
            </Field>
          </div>

          <div className="responsive-grid-small">
            <Field number="19" label="Meta de ingreso neto mensual a 6 meses"
              hint="Lo que querés llevarte limpio al bolsillo.">
              <input type="number" name="metaIngreso" required placeholder="$ ARS" min="0" onChange={set} style={S.input} />
            </Field>
            <Field number="20" label="Presupuesto disponible para invertir"
              hint="Para publicidad, herramientas, capacitación, etc.">
              <select name="presupuestoInversion" required onChange={set} style={S.input}>
                <option value="" disabled defaultValue="">Seleccioná...</option>
                <option value="zero">$0 — solo con lo que tengo</option>
                <option value="bajo">Menos de $50.000 ARS</option>
                <option value="medio">$50.000 – $300.000 ARS</option>
                <option value="alto">Más de $300.000 ARS</option>
              </select>
            </Field>
          </div>

          {/* ── SECCIÓN 5: BLOQUEOS ── */}
          <SectionTitle>🧱 Historia y bloqueos</SectionTitle>

          <Field number="21" label="¿Intentaste emprender antes? ¿Qué pasó?"
            hint="No tenés que impresionar a nadie. El historial define el patrón.">
            <textarea name="historialProyectos" required placeholder="Ej: Tuve una tienda de ropa en 2022 pero la cerré porque no podía costear el alquiler. También intenté dar clases de inglés pero no conseguí alumnos suficientes." onChange={set} style={S.textarea} />
          </Field>

          <Field number="22" label="¿Cuál es el obstáculo más grande hoy?"
            hint="Un único cuello de botella. El que si lo resolvieras, todo cambiaría.">
            <textarea name="cuelloBotella" required placeholder="Ej: No sé cómo fijar precios sin perder clientes. Cada vez que subo el precio alguien me dice que es caro y lo bajo. Termino trabajando más por lo mismo." onChange={set} style={S.textarea} />
          </Field>

          {/* Submit */}
          <div style={{ marginTop: '2.5rem' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}
            >
              {isSubmitting ? 'Procesando tu auditoría...' : 'Generar mi Plan de Trabajo →'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tus respuestas se procesan con IA. Te contactamos en menos de 48 horas.
            </p>
          </div>

        </form>
      </div>
    </div>
  )
}
