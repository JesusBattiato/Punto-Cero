import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Nivel1() {
  const [inputs, setInputs] = useState({
    p_venta: 10000,
    c_variable: 4000,
    g_fijos: 50000,
    h_libres: 10,
    t_unidad: 2
  });

  const [cvItems, setCvItems] = useState([{ id: 1, name: '', val: '' }]);
  const [gfItems, setGfItems] = useState([{ id: 1, name: '', val: '' }]);

  const [results, setResults] = useState(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    calculate();
  }, [inputs]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleSubCChange = (type, index, field, value) => {
    if (type === 'cv') {
      const newItems = [...cvItems];
      newItems[index][field] = value;
      setCvItems(newItems);
      const sum = newItems.reduce((acc, obj) => acc + (parseFloat(obj.val) || 0), 0);
      setInputs(prev => ({ ...prev, c_variable: sum }));
    } else {
      const newItems = [...gfItems];
      newItems[index][field] = value;
      setGfItems(newItems);
      const sum = newItems.reduce((acc, obj) => acc + (parseFloat(obj.val) || 0), 0);
      setInputs(prev => ({ ...prev, g_fijos: sum }));
    }
  };

  const addItem = (type) => {
    if (type === 'cv') {
      setCvItems([...cvItems, { id: Date.now(), name: '', val: '' }]);
    } else {
      setGfItems([...gfItems, { id: Date.now(), name: '', val: '' }]);
    }
  };

  const calculate = () => {
    const { p_venta, c_variable, g_fijos, h_libres, t_unidad } = inputs;
    const margen = p_venta - c_variable;
    const hd_mensual = h_libres * 4;

    let statusType = '';
    let title = 'Procesando...';
    let desc = 'Modificá los datos para ver tu diagnóstico.';
    let equilibrio = 0;
    let hn_mensual = 0;

    if (p_venta > 0) {
      if (margen <= 0) {
        statusType = 'red';
        title = 'Crónica de un Colapso';
        desc = 'Tus costos son mayores o iguales al precio de venta. Ni vendiendo un millón de unidades te vas a volver rico, solo vas a perder plata más rápido.';
      } else {
        equilibrio = g_fijos / margen;
        hn_mensual = equilibrio * t_unidad;

        if (hn_mensual > hd_mensual) {
          statusType = 'red';
          title = 'Límite Físico Superado';
          desc = `Necesitás trabajar ${Math.ceil(hn_mensual)} horas al mes solo para salir hecho, pero solo tenés ${hd_mensual} horas libres. El día solo tiene 24hs. Dejá de mentirte. O bajás tus costos fijos, o subís el precio drásticamente.`;
        } else if ((hn_mensual / hd_mensual) > 0.7 || (margen / p_venta) < 0.3) {
          statusType = 'yellow';
          title = 'Pasatiempo Caro';
          desc = 'Vas a trabajar como esclavo solo para llegar al punto de equilibrio. El negocio existe matemáticamente, pero tu margen es muy bajo. Estás regalando tus horas.';
        } else {
          statusType = 'green';
          title = '¡Negocio Viable!';
          desc = 'Felicidades. Tu punto de equilibrio es bajo y los márgenes son fenomenales. Tenés tiempo físico de sobra para escalar esto hacia ganancias reales.';
        }
      }
    }

    setResults({
      margen, hd_mensual,
      equilibrio: margen <= 0 ? 'Imposible' : Math.ceil(equilibrio) + " uni/mes",
      hn_mensual: margen <= 0 ? 'Imposible' : Math.ceil(hn_mensual) + " hs/mes",
      statusType, title, desc
    });
  };

  const submitDiagnosis = async (e) => {
    e.preventDefault();
    if (!email) return alert("Por favor ingresa tu email");
    
    setIsSubmitting(true);
    if (supabase) {
      const { error } = await supabase.from('nivel1_maquina').insert([{ email, raw_data: inputs, results }]);
      if (error) console.error(error);
    }
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      color: '#f8fafc',
      display: 'flex', justifyContent: 'center', padding: '1.5rem', marginBottom: '5rem'
    }}>
      <div className="responsive-grid" style={{
        background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px',
        padding: '2.5rem', maxWidth: '900px', width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        
        <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.5rem 0', textAlign: 'center', background: '-webkit-linear-gradient(#f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Calculadora Financiera
          </h1>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '1.5rem', margin: 0 }}>Baño de realidad matemática. No te mientas a ti mismo.</p>
        </div>

        {/* INPUTS COL */}
        <div>
          <div style={{ background: 'rgba(0, 0, 0, 0.15)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: '#e2e8f0' }}>Precio de Venta ($ ARS)</label>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>El precio final que paga el cliente.</span>
            <input type="number" name="p_venta" value={inputs.p_venta} onChange={handleChange} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f8fafc', fontSize: '1.1rem', fontWeight: 600, boxSizing: 'border-box' }} />
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.15)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: '#e2e8f0' }}>Costo Variable ($ ARS) por unidad</label>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>El costo temporal y material directo de lograr 1 venta.</span>
            <input type="number" name="c_variable" value={inputs.c_variable} onChange={handleChange} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f8fafc', fontSize: '1.1rem', fontWeight: 600, boxSizing: 'border-box' }} />
            
            <details style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
              <summary style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 500, padding: '0.5rem 0' }}>Calculadora Detallada (Materiales)</summary>
              <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 0 }}>Ej: 100 de Madera, 50 de Cera</p>
                {cvItems.map((item, idx) => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input type="text" placeholder="Ej: Material 1" value={item.name} onChange={(e) => handleSubCChange('cv', idx, 'name', e.target.value)} style={{ fontSize: '0.85rem', padding: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff' }} />
                    <input type="number" placeholder="$" value={item.val} onChange={(e) => handleSubCChange('cv', idx, 'val', e.target.value)} style={{ fontSize: '0.85rem', padding: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff' }} />
                  </div>
                ))}
                <button onClick={() => addItem('cv')} style={{ background: 'transparent', color: '#94a3b8', border: '1px dashed rgba(255,255,255,0.1)', padding: '0.5rem', width: '100%', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>+ Agregar Ítem</button>
              </div>
            </details>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.15)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: '#e2e8f0' }}>Gastos Fijos Mensuales ($ ARS)</label>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>Lo que pagás siempre, vendas 0 o vendas 1000.</span>
            <input type="number" name="g_fijos" value={inputs.g_fijos} onChange={handleChange} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f8fafc', fontSize: '1.1rem', fontWeight: 600, boxSizing: 'border-box' }} />
            
            <details style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
              <summary style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 500, padding: '0.5rem 0' }}>Calculadora Detallada (Gastos Fijos)</summary>
              <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 0 }}>Ej: 15.000 Internet, 5.000 Monotributo</p>
                {gfItems.map((item, idx) => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input type="text" placeholder="Ej: Internet" value={item.name} onChange={(e) => handleSubCChange('gf', idx, 'name', e.target.value)} style={{ fontSize: '0.85rem', padding: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff' }} />
                    <input type="number" placeholder="$" value={item.val} onChange={(e) => handleSubCChange('gf', idx, 'val', e.target.value)} style={{ fontSize: '0.85rem', padding: '0.5rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff' }} />
                  </div>
                ))}
                <button onClick={() => addItem('gf')} style={{ background: 'transparent', color: '#94a3b8', border: '1px dashed rgba(255,255,255,0.1)', padding: '0.5rem', width: '100%', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>+ Agregar Ítem</button>
              </div>
            </details>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.15)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: '#e2e8f0' }}>Tus Horas Libres Semanales (Físicas)</label>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>¿Cuánto podés evitar tu trabajo actual y la vida familiar?</span>
            <input type="number" name="h_libres" value={inputs.h_libres} onChange={handleChange} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f8fafc', fontSize: '1.1rem', fontWeight: 600, boxSizing: 'border-box' }} />
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.15)', padding: '1.25rem', borderRadius: '12px', margin: 0, border: '1px solid rgba(255,255,255,0.05)' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: '#e2e8f0' }}>Tiempo por Unidad/Servicio (en Horas)</label>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>Tiempo real de fabricación o duración del servicio.</span>
            <input type="number" name="t_unidad" value={inputs.t_unidad} step="0.5" onChange={handleChange} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f8fafc', fontSize: '1.1rem', fontWeight: 600, boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* RESULTS COL */}
        {results && (
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            textAlign: 'center', padding: '2rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.4s ease'
          }}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%', marginBottom: '1.5rem',
              background: results.statusType === 'green' ? '#22c55e' : results.statusType === 'yellow' ? '#eab308' : results.statusType === 'red' ? '#ef4444' : '#334155',
              boxShadow: results.statusType === 'green' ? '0 0 35px #22c55e, inset 0 0 10px rgba(255,255,255,0.5)' :
                         results.statusType === 'yellow' ? '0 0 35px #eab308, inset 0 0 10px rgba(255,255,255,0.5)' :
                         results.statusType === 'red' ? '0 0 35px #ef4444, inset 0 0 10px rgba(255,255,255,0.5)' : 'inset 0 0 20px rgba(0,0,0,0.5)',
              transition: 'all 0.5s ease'
            }}></div>
            
            <div style={{
              fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', transition: 'color 0.3s',
              color: results.statusType === 'green' ? '#22c55e' : results.statusType === 'yellow' ? '#eab308' : results.statusType === 'red' ? '#ef4444' : '#fff'
            }}>
              {results.title}
            </div>
            
            <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '2rem' }}>
              {results.desc}
            </div>
            
            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', textAlign: 'left', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.85rem', borderRadius: '8px', borderLeft: `3px solid ${results.statusType === 'green' ? '#22c55e' : results.statusType === 'yellow' ? '#eab308' : results.statusType === 'red' ? '#ef4444' : 'transparent'}` }}>
                <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Margen de Ganancia Neto</span>
                <span style={{ fontWeight: 600, fontSize: '1.2rem' }}>$ {results.margen.toFixed(2)}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.85rem', borderRadius: '8px', borderLeft: `3px solid ${results.statusType === 'green' ? '#22c55e' : results.statusType === 'yellow' ? '#eab308' : results.statusType === 'red' ? '#ef4444' : 'transparent'}` }}>
                <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Punto Equilibrio (Ventas/mes)</span>
                <span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{results.equilibrio}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.85rem', borderRadius: '8px', borderLeft: `3px solid ${results.statusType === 'green' ? '#22c55e' : results.statusType === 'yellow' ? '#eab308' : results.statusType === 'red' ? '#ef4444' : 'transparent'}` }}>
                <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Tiempo Requerido por mes</span>
                <span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{results.hn_mensual}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.85rem', borderRadius: '8px', borderLeft: `3px solid ${results.statusType === 'green' ? '#22c55e' : results.statusType === 'yellow' ? '#eab308' : results.statusType === 'red' ? '#ef4444' : 'transparent'}` }}>
                <span style={{ color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Tu Tiempo Físico Real/mes</span>
                <span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{results.hd_mensual} hs</span>
              </div>
            </div>

            {results.statusType && !submitted && (
              <form onSubmit={submitDiagnosis} style={{ width: '100%' }}>
                <input 
                  type="email" 
                  placeholder="Tu correo para guardar diagnóstico" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', marginBottom: '1rem', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f8fafc', boxSizing: 'border-box' }}
                />
                <button type="submit" disabled={isSubmitting} style={{
                  background: results.statusType === 'green' ? 'linear-gradient(135deg, #16a34a, #22c55e)' : 
                              results.statusType === 'yellow' ? 'linear-gradient(135deg, #ca8a04, #eab308)' : 
                              'linear-gradient(135deg, #dc2626, #ef4444)',
                  color: 'white', border: 'none', padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: 600,
                  borderRadius: '12px', cursor: 'pointer', width: '100%',
                  boxShadow: `0 10px 25px -5px rgba(${results.statusType === 'green' ? '34,197,94' : results.statusType === 'yellow' ? '234,179,8' : '239,68,68'}, 0.5)`
                }}>
                  {isSubmitting ? 'Procesando...' : 
                   results.statusType === 'green' ? 'Quiero sistematizar mi lanzamiento 🚀' : 
                   results.statusType === 'yellow' ? 'Quiero aumentar mis márgenes 📈' : 
                   'Ayudame a arreglar esto urgente 🛑'}
                </button>
              </form>
            )}

            {submitted && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '8px', width: '100%', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <strong>Tus datos fueron recibidos.</strong><br/>Nos conectaremos contigo a la brevedad.
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
