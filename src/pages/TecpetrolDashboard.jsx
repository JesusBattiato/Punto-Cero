import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Settings, 
  Clock,
  ChevronRight,
  ClipboardList,
  Plus,
  ArrowLeft,
  Filter
} from 'lucide-react';

const TecpetrolDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [punchList, setPunchList] = useState([]);
  const [compressionData, setCompressionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // 1. Obtener Objetivos
    const { data: objData } = await supabase
      .from('tecpetrol_objetivos')
      .select('*')
      .order('numero', { ascending: true });
    
    // 2. Obtener Punch List completa
    const { data: punchData } = await supabase
      .from('tecpetrol_punchlist')
      .select('*')
      .order('id', { ascending: true });

    if (objData) setObjectives(objData);
    if (punchData) setPunchList(punchData);

    // 3. Obtener Compresión
    const { data: compData } = await supabase
      .from('tecpetrol_compression')
      .select('*')
      .order('fecha', { ascending: false });
    if (compData) setCompressionData(compData);

    // 4. Obtener OPEX
    const { data: opexDataRaw } = await supabase
      .from('tecpetrol_opex')
      .select('*')
      .order('mes', { ascending: false });
    if (opexDataRaw) setOpexData(opexDataRaw);

    setLoading(false);
  };

  const [opexData, setOpexData] = useState([]);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('tecpetrol_punchlist')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) fetchData();
  };

  const handleObjClick = (obj) => {
    setSelectedObjective(obj);
    setActiveTab('obj_detail');
  };

  const goBack = () => {
    setSelectedObjective(null);
    setActiveTab('overview');
  };

  return (
    <div className="industrial-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Activity size={24} color="#3b82f6" />
          <span>RAMOS CONTROL</span>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
            <BarChart3 size={18} /> General
          </button>
          <button className={activeTab === 'punchlist' ? 'active' : ''} onClick={() => setActiveTab('punchlist')}>
            <ClipboardList size={18} /> Punch List
          </button>
          <button className={activeTab === 'compression' ? 'active' : ''} onClick={() => setActiveTab('compression')}>
            <Zap size={18} /> Compresión
          </button>
          <button className={activeTab === 'opex' ? 'active' : ''} onClick={() => setActiveTab('opex')}>
            <ShieldCheck size={18} /> OPEX / Químicos
          </button>
        </nav>
      </aside>

      <main className="content">
        <header className="content-header">
          <div>
            <h1>{activeTab === 'obj_detail' ? selectedObjective?.titulo : 
                 activeTab === 'opex' ? 'Control de Costos (OPEX)' :
                 activeTab === 'compression' ? 'Telemetría de Compresión' : 
                 'Dashboard Operativo'}</h1>
            <p className="text-secondary">Supervisor: Jesus Battiato | Ramos V3</p>
          </div>
          <div className="header-stats">
            <div className="card-mini">
              <span className="label">Eficiencia Global</span>
              <span className="value">94.2%</span>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="loader">Cargando base de datos...</div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="grid-container fade-in">
                {objectives.map((obj) => (
                  <div key={obj.id} className="obj-card" onClick={() => handleObjClick(obj)}>
                    <div className="obj-header">
                      <h3>{obj.titulo}</h3>
                      <span className="badge" style={{ backgroundColor: `${obj.color || '#3b82f6'}22`, color: obj.color || '#3b82f6' }}>{obj.peso}%</span>
                    </div>
                    <div className="obj-body">
                      <div className="score-ring">
                        <span className="score-val">{obj.nota_proyectada}</span>
                        <span className="score-total">/ 5</span>
                      </div>
                      <div className="status-info">
                        <p className="status-text">{obj.estado}</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${(obj.nota_proyectada/5)*100}%`, backgroundColor: obj.color || '#3b82f6' }}></div>
                        </div>
                      </div>
                      <ChevronRight size={16} className="arrow-icon" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'obj_detail' && (
              <div className="detail-view fade-in">
                <button className="btn-back" onClick={goBack}><ArrowLeft size={16} /> Volver</button>
                <div className="detail-card">
                  <div className="detail-header">
                    <div className="badge-lg" style={{ color: selectedObjective.color }}>Objetivo {selectedObjective.numero}</div>
                    <span className="nota-big">{selectedObjective.nota_proyectada} <small>/ 5</small></span>
                  </div>
                  <div className="detail-body">
                    <p><strong>Criterio para el 5:</strong> {selectedObjective.numero === 6 || selectedObjective.numero === 7 ? 'Objetivo completado satisfactoriamente.' : 'Cumplimiento total de cronograma y ahorros proyectados.'}</p>
                    <div className="action-items">
                      <h4>Tareas Pendientes / Notas:</h4>
                      <ul>
                        {selectedObjective.numero === 6 ? <li>Queda pendiente el cierre del Punch List operacional.</li> : 
                         selectedObjective.numero === 7 ? <li>Tie-in finalizado. Compresor en servicio.</li> :
                         <li>Seguimiento diario de KPIs en dashboard.</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'punchlist' && (
              <div className="table-container fade-in">
                <div className="table-actions">
                   <div className="filters">
                      <Filter size={16} /> <span>Filtrar</span>
                   </div>
                   <button className="btn-primary"><Plus size={16} /> Agregar Ítem</button>
                </div>
                <table className="industrial-table">
                  <thead>
                    <tr>
                      <th>Sector</th>
                      <th>Ítem / Acción</th>
                      <th>RFSU</th>
                      <th>Status Actual</th>
                      <th>Cambiar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {punchList.map((item) => (
                      <tr key={item.id}>
                        <td>{item.sector}</td>
                        <td>
                          <div className="item-name">{item.item}</div>
                          <div className="item-action">{item.accion}</div>
                        </td>
                        <td>{item.es_rfsu ? <span className="rfsu-tag">SI</span> : <span className="no-tag">No</span>}</td>
                        <td>
                          <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                        </td>
                        <td>
                          <select 
                            className="status-select" 
                            value={item.status} 
                            onChange={(e) => updateStatus(item.id, e.target.value)}
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Ejecutado">Habilitado</option>
                            <option value="HOLD">En Pausa</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'compression' && (
              <div className="table-container fade-in">
                <table className="industrial-table">
                  <thead>
                    <tr>
                      <th>TAG</th>
                      <th>Fecha</th>
                      <th>Horas Marcha</th>
                      <th>Disponibilidad</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compressionData.map((comp) => (
                      <tr key={comp.id}>
                        <td><div className="item-name">{comp.tag}</div></td>
                        <td>{comp.fecha}</td>
                        <td>{comp.horas_marcha} hs</td>
                        <td>
                           <div className="progress-bar" style={{ width: '80px' }}>
                              <div className="progress-fill" style={{ width: `${(comp.horas_marcha/24)*100}%`, backgroundColor: '#10b981' }}></div>
                           </div>
                        </td>
                        <td><span className={`status-badge ${comp.estado === 'E/S' ? 'ejecutado' : 'hold'}`}>{comp.estado}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'opex' && (
              <div className="table-container fade-in">
                 <table className="industrial-table">
                  <thead>
                    <tr>
                      <th>Categoría</th>
                      <th>Mes</th>
                      <th>Presupuesto (BG)</th>
                      <th>Real</th>
                      <th>Desvío</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opexData.map((item) => (
                      <tr key={item.id}>
                        <td><div className="item-name">{item.categoria}</div></td>
                        <td>{item.mes}</td>
                        <td>USD {item.presupuesto_bg}</td>
                        <td>USD {item.gasto_real}</td>
                        <td>
                           <span style={{ color: item.gasto_real > item.presupuesto_bg ? '#ef4444' : '#10b981' }}>
                              {item.presupuesto_bg > 0 ? (((item.gasto_real - item.presupuesto_bg) / item.presupuesto_bg) * 100).toFixed(1) : 0}%
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .industrial-dashboard { display: flex; min-height: 100vh; background: #07090c; color: #e2e8f0; font-family: 'Inter', sans-serif; }
        .sidebar { width: 220px; background: #0c0f16; border-right: 1px solid #1e293b; padding: 1.5rem; }
        .sidebar-header { display: flex; align-items: center; gap: 0.75rem; font-weight: 800; color: #3b82f6; margin-bottom: 2rem; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 0.4rem; }
        .sidebar-nav button { display: flex; align-items: center; gap: 0.75rem; background: transparent; border: none; color: #64748b; padding: 0.7rem; border-radius: 8px; cursor: pointer; transition: 0.2s; text-align: left; font-weight: 500;}
        .sidebar-nav button:hover, .sidebar-nav button.active { background: #1e293b; color: #3b82f6; }
        
        .content { flex: 1; padding: 2rem; overflow-y: auto; }
        .content-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        h1 { font-size: 1.6rem; font-weight: 800; margin: 0; }
        .text-secondary { color: #64748b; font-size: 0.9rem; }
        
        .card-mini { background: #0c0f16; padding: 0.8rem 1.2rem; border-radius: 10px; border: 1px solid #1e293b; }
        .card-mini .label { display: block; font-size: 0.65rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .card-mini .value { font-size: 1.4rem; font-weight: 800; color: #10b981; }

        .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
        .obj-card { background: #0c0f16; padding: 1.2rem; border-radius: 12px; border: 1px solid #1e293b; cursor: pointer; transition: 0.2s; position: relative; }
        .obj-card:hover { border-color: #3b82f6; transform: scale(1.02); }
        .obj-header { display: flex; justify-content: space-between; margin-bottom: 1.2rem; }
        .obj-header h3 { font-size: 1rem; margin: 0; font-weight: 700; color: #f1f5f9; }
        .badge { font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700; }

        .obj-body { display: flex; align-items: center; gap: 1rem; }
        .score-ring { width: 50px; text-align: center; }
        .score-val { font-size: 1.5rem; font-weight: 800; display: block; }
        .score-total { font-size: 0.7rem; color: #64748b; }
        .status-info { flex: 1; }
        .status-text { font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.4rem; }
        .progress-bar { height: 4px; background: #1e293b; border-radius: 2px; }
        .progress-fill { height: 100%; border-radius: 2px; }
        .arrow-icon { color: #334155; }

        .table-container { background: #0c0f16; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; }
        .table-actions { padding: 1rem; display: flex; justify-content: space-between; background: #0f172a; }
        .filters { display: flex; align-items: center; gap: 0.5rem; color: #64748b; font-size: 0.8rem; }
        .industrial-table { width: 100%; border-collapse: collapse; }
        .industrial-table th { background: #1e293b55; color: #64748b; font-size: 0.75rem; text-transform: uppercase; padding: 0.8rem 1rem; text-align: left; }
        .industrial-table td { padding: 0.8rem 1rem; border-bottom: 1px solid #1e293b; font-size: 0.85rem; }
        .item-name { font-weight: 700; color: #f1f5f9; }
        .item-action { font-size: 0.75rem; color: #64748b; margin-top: 2px; }
        
        .rfsu-tag { background: #ef444422; color: #f87171; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.7rem; font-weight: 800; }
        .no-tag { color: #475569; font-size: 0.7rem; }

        .status-badge { padding: 0.2rem 0.5rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
        .status-badge.pendiente { background: #7f1d1d; color: #fecaca; }
        .status-badge.ejecutado { background: #064e3b; color: #d1fae5; }
        .status-badge.hold { background: #78350f; color: #fef3c7; }

        .status-select { background: #020617; color: #fff; border: 1px solid #334155; padding: 0.3rem; border-radius: 4px; font-size: 0.75rem; }
        .btn-primary { background: #3b82f6; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
        .btn-back { background: transparent; border: none; color: #3b82f6; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin-bottom: 1rem; font-weight: 600; }
        
        .detail-card { background: #0c0f16; border: 1px solid #3b82f6; border-radius: 12px; padding: 2rem; }
        .detail-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 1rem; margin-bottom: 1.5rem; }
        .badge-lg { font-size: 1.2rem; font-weight: 800; }
        .nota-big { font-size: 2.5rem; font-weight: 900; color: #fff; }
        .nota-big small { font-size: 1rem; color: #64748b; }
        
        .action-items h4 { color: #3b82f6; margin-top: 2rem; }
        .action-items ul { list-style: none; padding: 0; }
        .action-items li { padding: 0.5rem 0; border-bottom: 1px solid #1e293b; color: #94a3b8; display: flex; align-items: center; gap: 0.5rem; }
        .action-items li::before { content: '→'; color: #3b82f6; }

        .loader { display: flex; justify-content: center; padding: 4rem; color: #3b82f6; font-weight: 700; }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default TecpetrolDashboard;
