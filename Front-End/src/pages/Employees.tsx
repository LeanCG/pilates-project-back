import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { employeesApi } from '../api/axios';
import { GlassCard } from '../components/GlassCard';

interface Employee {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  cargo: string;
  especialidad?: string;
  estado_id: number;
}

export const Employees: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useApi<Employee[]>('/employees');

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Dar de baja este empleado?')) return;
    try {
      await employeesApi.remove(id);
      refetch();
    } catch {
      window.alert('No se pudo dar de baja el empleado');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Empleados</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gestión del staff del estudio</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={refetch}><RefreshCw size={16} /></button>
          <Link className="btn btn-primary" to="/employees/new"><Plus size={16} /> Nuevo</Link>
        </div>
      </header>

      <GlassCard>
        {loading && <p>Cargando empleados...</p>}
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}

        {!loading && !error && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Nombre</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>DNI</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Cargo</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Estado</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(data || []).map((employee) => (
                  <tr key={employee.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '0.8rem' }}>{employee.apellido}, {employee.nombre}</td>
                    <td style={{ padding: '0.8rem' }}>{employee.dni}</td>
                    <td style={{ padding: '0.8rem' }}>{employee.cargo}</td>
                    <td style={{ padding: '0.8rem' }}>{employee.estado_id === 1 ? 'Activo' : 'Inactivo'}</td>
                    <td style={{ padding: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" onClick={() => navigate(`/employees/${employee.id}/edit`)}><Pencil size={14} /></button>
                      <button className="btn" style={{ background: 'rgba(255,77,77,0.12)', color: 'var(--error)' }} onClick={() => handleDelete(employee.id)}><Trash2 size={14} /></button>
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
