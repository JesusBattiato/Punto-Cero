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
  ClipboardList
} from 'lucide-react';

const TecpetrolDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Mock data para previsualización inmediata
  const objectives = [
    { id: 1, title: 'Compresión', weight: 10, score: 3.5, status: 'En curso', color: '#3b82f6' },
    { id: 2, title: 'Medición / LACT', weight: 15, score: 3.0, status: 'Prev. Auditoría', color: '#6366f1' },
    { id: 3, title: 'Químicos / OPEX', weight: 15, score: 3.2, status: 'Analizando BG', color: '#10b981' },
    { id: 4, title: 'Mejora Continua', weight: 15, score: 3.0, status: 'Buscando Desvíos', color: '#f59e0b' },
    { id: 5, title: 'Paro de Planta', weight: 10, score: 4.2, status: 'Cierre Punch List', color: '#ef4444' },
    { id: 6, title: 'Planta Aminas', weight: 10, score: 3.8, status: 'PEM Inicial', color: '#8b5cf6' },
    { id: 7, title: 'Proyecto R1003', weight: 10, score: 5.0, status: 'CUMPLIDO', color: '#22c55e' },
    { id: 8, title: 'Seguridad SAS', weight: 15, score: 3.5, status: '100% Proactividad', color: '#06b6d4' },
  ];

  const punchItems = [
    { id: 1, sector: 'Facilities', item: 'Tinglado Amina', status: 'HOLD', rfsu: 'NO' },
    { id: 2, sector: 'I&C', item: 'Recalibración PSH', status: 'Ejecutado', rfsu: 'SI' },
    { id: 3, sector: 'GEIN', item: 'Hazop V-102', status: 'Pendiente', rfsu: 'NO' },
  ];

  return (
    <div className="industrial-dashboard">
      {/* Sidebar / Nav */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Activity size={24} color="#3b82f6" />
          <span>RAMOS CONTROL</span>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'overview' ? 'active' : ''} 
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={18} /> General
          </button>
          <button 
            className={activeTab === 'punchlist' ? 'active' : ''} 
            onClick={() => setActiveTab('punchlist')}
          >
            <ClipboardList size={18} /> Punch List
          </button>
          <button 
            className={activeTab === 'compression' ? 'active' : ''} 
            onClick={() => setActiveTab('compression')}
          >
            <Zap size={18} /> Compresión
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content">
        <header className="content-header">
          <div>
            <h1>Dashboard Objetivos 2026</h1>
            <p className="text-secondary">Supervisor: Jesus Battiato | Planta de Aminas - Ramos</p>
          </div>
          <div className="header-stats">
            <div className="card-mini">
              <span className="label">Nota Proyectada</span>
              <span className="value">3.62</span>
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="grid-container">
            {objectives.map((obj) => (
              <div key={obj.id} className="obj-card" style={{ borderLeft: `4px solid ${obj.color}` }}>
                <div className="obj-header">
                  <h3>{obj.title}</h3>
                  <span className="badge" style={{ backgroundColor: `${obj.color}22`, color: obj.color }}>{obj.weight}%</span>
                </div>
                <div className="obj-body">
                  <div className="score-ring">
                    <span className="score-val">{obj.score}</span>
                    <span className="score-total">/ 5</span>
                  </div>
                  <div className="status-info">
                    <p className="status-text">{obj.status}</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(obj.score/5)*100}%`, backgroundColor: obj.color }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'punchlist' && (
          <div className="table-container fade-in">
            <div className="table-header">
              <h2>Seguimiento de Punch List (Mayo/Junio)</h2>
              <button className="btn-primary">+ Nuevo Item</button>
            </div>
            <table className="industrial-table">
              <thead>
                <tr>
                  <th>Sector</th>
                  <th>Ítem / Tarea</th>
                  <th>Importancia RFSU</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {punchItems.map((item) => (
                  <tr key={item.id}>
                    <td className="font-bold">{item.sector}</td>
                    <td>{item.item}</td>
                    <td>
                      <span className={`tag ${item.rfsu === 'SI' ? 'tag-red' : 'tag-gray'}`}>
                        {item.rfsu === 'SI' ? 'CRÍTICO' : 'Normal'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td><ChevronRight size={16} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .industrial-dashboard {
          display: flex;
          min-height: 100vh;
          background: #0a0c10;
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
        }

        .sidebar {
          width: 240px;
          background: #11141b;
          border-right: 1px solid #1e293b;
          padding: 1.5rem;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 800;
          font-size: 1.1rem;
          color: #3b82f6;
          margin-bottom: 2rem;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar-nav button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .sidebar-nav button:hover, .sidebar-nav button.active {
          background: #1e293b;
          color: #3b82f6;
        }

        .content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        h1 { font-size: 1.8rem; margin: 0; font-weight: 800; }
        .text-secondary { color: #94a3b8; margin-top: 0.25rem; }

        .card-mini {
          background: #11141b;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          border: 1px solid #1e293b;
          text-align: right;
        }

        .card-mini .label { display: block; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; }
        .card-mini .value { font-size: 1.5rem; font-weight: 800; color: #3b82f6; }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .obj-card {
          background: #11141b;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #1e293b;
          transition: transform 0.2s;
        }

        .obj-card:hover { transform: translateY(-4px); border-color: #3b82f6; }

        .obj-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .obj-header h3 { margin: 0; font-size: 1.1rem; }
        .badge { padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }

        .obj-body { display: flex; align-items: center; gap: 1.5rem; }
        .score-ring { text-align: center; }
        .score-val { font-size: 1.8rem; font-weight: 800; display: block; line-height: 1; }
        .score-total { font-size: 0.8rem; color: #94a3b8; }

        .status-info { flex: 1; }
        .status-text { font-size: 0.85rem; margin-bottom: 0.5rem; color: #94a3b8; }

        .progress-bar { height: 6px; background: #1e293b; border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; transition: width 0.5s ease-out; }

        .table-container {
          background: #11141b;
          border-radius: 16px;
          border: 1px solid #1e293b;
          overflow: hidden;
        }

        .table-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #1e293b;
        }

        .industrial-table { width: 100%; border-collapse: collapse; }
        .industrial-table th {
          background: #0a0c10;
          text-align: left;
          padding: 1rem 1.5rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          color: #64748b;
        }

        .industrial-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #1e293b;
          font-size: 0.9rem;
        }

        .status-pill {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status-pill.ejecutado { background: #064e3b; color: #34d399; }
        .status-pill.pendiente { background: #450a0a; color: #f87171; }
        .status-pill.hold { background: #451a03; color: #fbbf24; }

        .tag { padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.7rem; }
        .tag-red { background: #ef444422; color: #ef4444; border: 1px solid #ef444444; }
        .tag-gray { color: #64748b; }

        .btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default TecpetrolDashboard;
