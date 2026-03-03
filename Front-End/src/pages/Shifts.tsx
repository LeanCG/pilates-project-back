import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { shiftsApi } from '../api/axios';
import { GlassCard } from '../components/GlassCard';

interface Shift {
  id: number;
  fecha: string;
  hora: string;
  actividad: string;
  instructor_nombre: string;
  capacidad: number;
  cupo_disponible: number;
}

export const Shifts: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useApi<Shift[]>('/shifts');

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este turno?')) return;
    try {
      await shiftsApi.remove(id);
      refetch();
    } catch (error: any) {
      window.alert(error.response?.data?.message || 'No se pudo eliminar el turno');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Turnos</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gestión de agenda y capacidad</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={refetch}><RefreshCw size={16} /></button>
          <Link className="btn btn-primary" to="/shifts/new"><Plus size={16} /> Nuevo</Link>
        </div>
      </header>

      <GlassCard>
        {loading && <p>Cargando turnos...</p>}
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
        {!loading && !error && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Fecha</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Hora</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Actividad</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Instructor</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Cupos</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(data || []).map((shift) => (
                  <tr key={shift.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '0.8rem' }}>{new Date(shift.fecha).toLocaleDateString()}</td>
                    <td style={{ padding: '0.8rem' }}>{shift.hora?.slice(0, 5)}</td>
                    <td style={{ padding: '0.8rem' }}>{shift.actividad}</td>
                    <td style={{ padding: '0.8rem' }}>{shift.instructor_nombre}</td>
                    <td style={{ padding: '0.8rem' }}>{shift.cupo_disponible}/{shift.capacidad}</td>
                    <td style={{ padding: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" onClick={() => navigate(`/shifts/${shift.id}/edit`)}><Pencil size={14} /></button>
                      <button className="btn" style={{ background: 'rgba(255,77,77,0.12)', color: 'var(--error)' }} onClick={() => handleDelete(shift.id)}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
