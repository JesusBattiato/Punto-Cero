import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('charla') // 'charla' | 'auditorias'
  const [charlaRegistros, setCharlaRegistros] = useState([])
  const [charlas, setCharlas] = useState([])
  const [auditorias, setAuditorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [copySuccess, setCopySuccess] = useState(null)

  // Filtro de registros por charla
  const [selectedCharla, setSelectedCharla] = useState('all')

  // Formulario de edición/creación de charlas
  const [showCharlaForm, setShowCharlaForm] = useState(false)
  const [charlaSaving, setCharlaSaving] = useState(false)
  const [charlaForm, setCharlaForm] = useState({
    id: null,
    titulo: '',
    fecha_descripcion: '',
    fecha_identificador: '',
    lugar: '',
    direccion: '',
    detalle_direccion: '',
    descripcion: '',
    activa: true
  })

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

      // 1. Cargar registros de charlas
      const { data: charlaData, error: charlaErr } = await supabase
        .from('charla_registros')
        .select('*')
        .order('created_at', { ascending: false })

      if (charlaErr) console.warn('Error cargando inscriptos (puede que la tabla no exista aún):', charlaErr.message)
      else setCharlaRegistros(charlaData || [])

      // 2. Cargar todas las charlas creadas
      const { data: charlasData, error: charlasErr } = await supabase
        .from('charlas')
        .select('*')
        .order('created_at', { ascending: false })

      if (charlasErr) console.warn('Error cargando charlas (puede que la tabla no exista aún):', charlasErr.message)
      else setCharlas(charlasData || [])

      // 3. Cargar auditorías de Nivel 2
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

  // CRUD Charlas
  const handleSaveCharla = async (e) => {
    e.preventDefault()
    setCharlaSaving(true)
    setErrorMsg('')
    try {
      if (!supabase) throw new Error('Supabase no está configurado.')

      const payload = {
        titulo: charlaForm.titulo,
        fecha_descripcion: charlaForm.fecha_descripcion,
        fecha_identificador: charlaForm.fecha_identificador,
        lugar: charlaForm.lugar,
        direccion: charlaForm.direccion,
        detalle_direccion: charlaForm.detalle_direccion || null,
        descripcion: charlaForm.descripcion || null,
        activa: charlaForm.activa
      }

      let savedId = charlaForm.id

      if (charlaForm.id) {
        // Editar
        const { error } = await supabase
          .from('charlas')
          .update(payload)
          .eq('id', charlaForm.id)

        if (error) throw error
      } else {
        // Insertar
        const { data, error } = await supabase
          .from('charlas')
          .insert([payload])
          .select()

        if (error) throw error
        if (data && data.length > 0) savedId = data[0].id
      }

      // Si activamos esta charla, desactivar automáticamente las demás
      if (charlaForm.activa) {
        const { data: activeList } = await supabase
          .from('charlas')
          .select('id')
          .eq('activa', true)

        if (activeList) {
          const idsToDeactivate = activeList
            .map(c => c.id)
            .filter(id => id !== savedId)

          if (idsToDeactivate.length > 0) {
            await supabase
              .from('charlas')
              .update({ activa: false })
              .in('id', idsToDeactivate)
          }
        }
      }

      // Reiniciar formulario
      setCharlaForm({
        id: null,
        titulo: '',
        fecha_descripcion: '',
        fecha_identificador: '',
        lugar: '',
        direccion: '',
        detalle_direccion: '',
        descripcion: '',
        activa: true
      })
      setShowCharlaForm(false)
      fetchData()
    } catch (err) {
      console.error('Error guardando charla:', err)
      setErrorMsg('Error al guardar la charla: ' + err.message)
    } finally {
      setCharlaSaving(false)
    }
  }

  const handleToggleActiveCharla = async (charlaId, currentStatus) => {
    setErrorMsg('')
    try {
      if (!supabase) throw new Error('Supabase no está configurado.')

      const newStatus = !currentStatus

      if (newStatus) {
        // Deactiva todas las demás primero
        const { error: deacErr } = await supabase
          .from('charlas')
          .update({ activa: false })
          .eq('activa', true)
        
        if (deacErr) throw deacErr
      }

      const { error } = await supabase
        .from('charlas')
        .update({ activa: newStatus })
        .eq('id', charlaId)

      if (error) throw error
      fetchData()
    } catch (err) {
      console.error('Error cambiando estado de charla:', err)
      setErrorMsg('Error al cambiar el estado: ' + err.message)
    }
  }

  const handleDeleteCharla = async (charlaId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta charla? Esto no borrará a los inscriptos de la base de datos, pero ya no estarán asociados a este taller.')) return
    setErrorMsg('')
    try {
      if (!supabase) throw new Error('Supabase no está configurado.')

      const { error } = await supabase
        .from('charlas')
        .delete()
        .eq('id', charlaId)

      if (error) throw error
      fetchData()
    } catch (err) {
      console.error('Error al eliminar charla:', err)
      setErrorMsg('Error al eliminar charla: ' + err.message)
    }
  }

  // Filtrado de inscriptos en memoria para visualización y exportación
  const filteredRegistros = charlaRegistros.filter(reg => {
    if (selectedCharla === 'all') return true
    if (selectedCharla === 'legacy') return !reg.charla_id

    // Buscar los detalles de la charla seleccionada
    const talk = charlas.find(c => c.id === selectedCharla)
    if (!talk) return false

    return reg.charla_id === talk.id || reg.fecha_charla === talk.fecha_identificador
  })

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

  const exportCharlaToCSV = () => {
    if (filteredRegistros.length === 0) return
    const headers = ['Nombre', 'WhatsApp', 'Rubro', 'Pregunta', 'Taller / Charla', 'Fecha Registro']
    const csvRows = [
      headers.join(','),
      ...filteredRegistros.map(reg => {
        // Encontrar charla asociada
        const talk = charlas.find(c => c.id === reg.charla_id || c.fecha_identificador === reg.fecha_charla)
        const charlaName = talk ? talk.titulo : (reg.fecha_charla || 'Histórica')
        return [
          `"${(reg.nombre || '').replace(/"/g, '""')}"`,
          `"${(reg.whatsapp || '').replace(/"/g, '""')}"`,
          `"${(reg.rubro || '').replace(/"/g, '""')}"`,
          `"${(reg.pregunta || '').replace(/"/g, '""')}"`,
          `"${charlaName.replace(/"/g, '""')}"`,
          `"${reg.created_at ? new Date(reg.created_at).toLocaleDateString('es-AR') : ''}"`
        ].join(',')
      })
    ]
    const csvContent = '\uFEFF' + csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    
    let suffix = 'todas'
    if (selectedCharla === 'legacy') suffix = 'historicas'
    else if (selectedCharla !== 'all') {
      const activeTalk = charlas.find(c => c.id === selectedCharla)
      suffix = activeTalk ? activeTalk.fecha_identificador : 'charla'
    }

    link.setAttribute('download', `inscriptos_${suffix}_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportAuditoriasToCSV = () => {
    if (auditorias.length === 0) return
    const headers = [
      'Nombre', 'Ubicación', 'Situación Laboral', 'Horas Semanales', 'Equipo o Solo',
      'Qué vende', 'Estado actual', 'Diferencial', 'Cliente ideal', 'Competencia',
      'Canales', 'Cómo consigue clientes', 'Presencia online', 'Precio actual',
      'Costo unitario', 'Ventas mensuales', 'Gastos fijos', 'Meta ingreso',
      'Presupuesto inversión', 'Urgencia', 'Historial', 'Cuello de botella', 'Fecha Registro'
    ]
    const csvRows = [
      headers.join(','),
      ...auditorias.map(audit => {
        const data = audit.form_data || audit
        return [
          `"${(data.nombre || '').replace(/"/g, '""')}"`,
          `"${(data.ubicacion || '').replace(/"/g, '""')}"`,
          `"${(data.situacionLaboral || '').replace(/"/g, '""')}"`,
          `"${data.horasDisponibles || '0'}"`,
          `"${(data.equipoOSolo || '').replace(/"/g, '""')}"`,
          `"${(data.idea || '').replace(/"/g, '""')}"`,
          `"${(data.estadoActual || '').replace(/"/g, '""')}"`,
          `"${(data.diferencial || '').replace(/"/g, '""')}"`,
          `"${(data.clienteIdeal || '').replace(/"/g, '""')}"`,
          `"${(data.competencia || '').replace(/"/g, '""')}"`,
          `"${(Array.isArray(data.canalesVenta) ? data.canalesVenta.join('; ') : '').replace(/"/g, '""')}"`,
          `"${(data.comoConsigueClientes || '').replace(/"/g, '""')}"`,
          `"${(data.presenciaOnline || '').replace(/"/g, '""')}"`,
          `"${data.precioActual || '0'}"`,
          `"${data.costoUnitario || '0'}"`,
          `"${data.ventasMensualesUnidades || '0'}"`,
          `"${data.gastosFijos || '0'}"`,
          `"${data.metaIngreso || '0'}"`,
          `"${(data.presupuestoInversion || '').replace(/"/g, '""')}"`,
          `"${(data.nivelUrgencia || '').replace(/"/g, '""')}"`,
          `"${(data.historialProyectos || '').replace(/"/g, '""')}"`,
          `"${(data.cuelloBotella || '').replace(/"/g, '""')}"`,
          `"${audit.created_at ? new Date(audit.created_at).toLocaleDateString('es-AR') : ''}"`
        ].join(',')
      })
    ]
    const csvContent = '\uFEFF' + csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `auditorias_nivel2_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 1.5rem 10rem' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ marginBottom: '0.75rem' }}>Panel de Control</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: '1.5rem' }}>
            Ingresa el PIN de Supervisor para acceder a las tablas de control y auditorías.
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
          🎙️ Gestión de Charlas e Inscriptos
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

      {/* ── TAB 1: GESTIÓN DE CHARLAS E INSCRIPTOS ── */}
      {!loading && activeTab === 'charla' && (
        <div>
          
          {/* SECTOR DE PROGRAMACIÓN DE CHARLAS */}
          <div className="card" style={{ marginBottom: '2.5rem', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', marginBottom: '0.25rem' }}>🗓️ Programar Charlas y Talleres</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', margin: 0 }}>
                  Crea nuevas charlas para habilitar el formulario de registro y el cartel de aviso en el inicio.
                </p>
              </div>
              {!showCharlaForm && (
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setCharlaForm({
                      id: null,
                      titulo: '',
                      fecha_descripcion: '',
                      fecha_identificador: new Date().toISOString().split('T')[0], // Sugerencia de fecha de hoy
                      lugar: '',
                      direccion: '',
                      detalle_direccion: '',
                      descripcion: '',
                      activa: true
                    })
                    setShowCharlaForm(true)
                  }}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  ➕ Programar Charla
                </button>
              )}
            </div>

            {/* Formulario Crear/Editar */}
            {showCharlaForm && (
              <form onSubmit={handleSaveCharla} style={{ background: 'rgba(2, 6, 23, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-mid)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h4 style={{ color: 'var(--accent-light)', fontSize: '1rem', marginBottom: '0.5rem', marginTop: 0 }}>
                  {charlaForm.id ? '✏️ Editar Charla' : '✨ Programar Nueva Charla'}
                </h4>
                
                <div className="responsive-grid-small">
                  <div>
                    <label style={{ fontSize: '0.8rem' }}>Título de la Charla / Taller</label>
                    <input 
                      type="text" 
                      placeholder="Ej: ¿Cuánto Vale Tu Hora?" 
                      value={charlaForm.titulo} 
                      onChange={e => setCharlaForm(p => ({ ...p, titulo: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem' }}>Identificador de Fecha (ID único para registros)</label>
                    <span className="help-text">Formato AAAA-MM-DD para agrupar registros. Ej: 2026-06-12</span>
                    <input 
                      type="text" 
                      placeholder="Ej: 2026-06-12" 
                      value={charlaForm.fecha_identificador} 
                      onChange={e => setCharlaForm(p => ({ ...p, fecha_identificador: e.target.value }))} 
                      required 
                    />
                  </div>
                </div>

                <div className="responsive-grid-small">
                  <div>
                    <label style={{ fontSize: '0.8rem' }}>Fecha y Hora para el público (texto descriptivo)</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Viernes 12 de Junio · 20:00 hs" 
                      value={charlaForm.fecha_descripcion} 
                      onChange={e => setCharlaForm(p => ({ ...p, fecha_descripcion: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem' }}>Lugar / Establecimiento</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Fundación Tendiendo Lazos" 
                      value={charlaForm.lugar} 
                      onChange={e => setCharlaForm(p => ({ ...p, lugar: e.target.value }))} 
                      required 
                    />
                  </div>
                </div>

                <div className="responsive-grid-small">
                  <div>
                    <label style={{ fontSize: '0.8rem' }}>Dirección física</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Pasaje Ituzaingó 280" 
                      value={charlaForm.direccion} 
                      onChange={e => setCharlaForm(p => ({ ...p, direccion: e.target.value }))} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem' }}>Aclaración de Dirección (Opcional)</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Entre Bolivia y Warnes" 
                      value={charlaForm.detalle_direccion} 
                      onChange={e => setCharlaForm(p => ({ ...p, detalle_direccion: e.target.value }))} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem' }}>Descripción / Propuesta del Taller</label>
                  <textarea 
                    placeholder="Ej: Un encuentro práctico y honesto para desarmar los números de tu negocio..." 
                    value={charlaForm.descripcion} 
                    onChange={e => setCharlaForm(p => ({ ...p, descripcion: e.target.value }))} 
                    style={{ minHeight: '60px' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="activa" 
                    checked={charlaForm.activa} 
                    onChange={e => setCharlaForm(p => ({ ...p, activa: e.target.checked }))}
                    style={{ width: 'auto', cursor: 'pointer' }}
                  />
                  <label htmlFor="activa" style={{ margin: 0, cursor: 'pointer' }}>Activar charla (desactivará las demás automáticamente y la publicará en la web)</label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn-primary" disabled={charlaSaving} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    {charlaSaving ? 'Guardando...' : '💾 Guardar Charla'}
                  </button>
                  <button type="button" className="btn-outline" onClick={() => setShowCharlaForm(false)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {/* Listado de Charlas Programadas */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '0.8rem' }}>Título</th>
                    <th style={{ padding: '0.8rem' }}>Fecha (Público)</th>
                    <th style={{ padding: '0.8rem' }}>ID Registros</th>
                    <th style={{ padding: '0.8rem' }}>Lugar y Dirección</th>
                    <th style={{ padding: '0.8rem', textAlign: 'center' }}>Estado</th>
                    <th style={{ padding: '0.8rem', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {charlas.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>{c.titulo}</td>
                      <td style={{ padding: '0.8rem' }}>{c.fecha_descripcion}</td>
                      <td style={{ padding: '0.8rem', fontFamily: 'monospace', color: 'var(--accent-light)' }}>{c.fecha_identificador}</td>
                      <td style={{ padding: '0.8rem' }}>
                        <div>{c.lugar}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.direccion} {c.detalle_direccion ? `(${c.detalle_direccion})` : ''}</div>
                      </td>
                      <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                        <span className={`status-badge ${c.activa ? 'green' : 'red'}`} style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}>
                          {c.activa ? 'Activa (Pública)' : 'Inactiva'}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button 
                            className="btn-outline" 
                            onClick={() => handleToggleActiveCharla(c.id, c.activa)} 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', minHeight: 'auto', borderRadius: '4px' }}
                          >
                            {c.activa ? '🛑 Desactivar' : '🟢 Activar'}
                          </button>
                          <button 
                            className="btn-outline" 
                            onClick={() => {
                              setCharlaForm(c)
                              setShowCharlaForm(true)
                            }} 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', minHeight: 'auto', borderRadius: '4px' }}
                          >
                            ✏️ Editar
                          </button>
                          <button 
                            className="btn-outline" 
                            onClick={() => handleDeleteCharla(c.id)} 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', minHeight: 'auto', borderRadius: '4px', color: 'var(--red)', borderColor: 'rgba(244,63,94,0.2)' }}
                          >
                            🗑️ Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {charlas.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No hay charlas programadas por el momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECCIÓN DE LISTADO DE REGISTROS DE INSCRIPTOS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                Filtrar Inscriptos por Charla:
              </span>
              <select
                value={selectedCharla}
                onChange={e => setSelectedCharla(e.target.value)}
                style={{ width: '220px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                <option value="all">Ver Todos ({charlaRegistros.length})</option>
                {charlas.map(c => {
                  const count = charlaRegistros.filter(reg => reg.charla_id === c.id || reg.fecha_charla === c.fecha_identificador).length
                  return (
                    <option key={c.id} value={c.id}>
                      {c.titulo} ({c.fecha_identificador}) [{count}]
                    </option>
                  )
                })}
                <option value="legacy">Registros Históricos/Sin ID [{charlaRegistros.filter(r => !r.charla_id).length}]</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                Inscriptos filtrados: <strong>{filteredRegistros.length}</strong>
              </span>
              {filteredRegistros.length > 0 && (
                <button className="btn-outline" onClick={exportCharlaToCSV} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                  📥 Descargar CSV Filtrado
                </button>
              )}
            </div>
          </div>
          
          <div style={{ overflowX: 'auto', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: '14px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1rem' }}>Nombre</th>
                  <th style={{ padding: '1rem' }}>WhatsApp</th>
                  <th style={{ padding: '1rem' }}>Rubro</th>
                  <th style={{ padding: '1rem' }}>Taller / Charla</th>
                  <th style={{ padding: '1rem' }}>Pregunta / Duda</th>
                  <th style={{ padding: '1rem' }}>Registro</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistros.map((reg) => {
                  const talk = charlas.find(c => c.id === reg.charla_id || c.fecha_identificador === reg.fecha_charla)
                  const charlaTitle = talk ? talk.titulo : (reg.fecha_charla || 'Histórica')
                  return (
                    <tr key={reg.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#f1f5f9' }}>{reg.nombre}</td>
                      <td style={{ padding: '1rem' }}>
                        <a href={`https://wa.me/${reg.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 600 }}>
                          📱 {reg.whatsapp}
                        </a>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-light)', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {reg.rubro}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-soft)', fontSize: '0.85rem' }}>
                        {charlaTitle}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-soft)', fontStyle: 'italic', maxWidth: '260px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {reg.pregunta || '—'}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {reg.created_at ? new Date(reg.created_at).toLocaleDateString('es-AR') : '—'}
                      </td>
                    </tr>
                  )
                })}
                {filteredRegistros.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No se encontraron registros para el filtro seleccionado.
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>
              Planes de Trabajo solicitados: <strong>{auditorias.length}</strong>
            </span>
            {auditorias.length > 0 && (
              <button className="btn-outline" onClick={exportAuditoriasToCSV} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                📥 Descargar CSV
              </button>
            )}
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
