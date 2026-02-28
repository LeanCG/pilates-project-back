import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useApi } from '../hooks/useApi';
import { api } from '../api/axios';

interface Routine {
    id: number;
    rutina: string;
    exercises?: Exercise[];
}

interface Exercise {
    id: number;
    ejercicio: string;
    series: number;
    repeticiones: number;
}

// rerender-memo: memoized row to avoid re-renders when sibling rows change
const RoutineRow = React.memo(({ routine, onDelete }: { routine: Routine; onDelete: (id: number) => void }) => {
    const navigate = useNavigate();
    return (
        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
            <td style={{ padding: '1rem 1.2rem', fontWeight: 500 }}>{routine.rutina}</td>
            <td style={{ padding: '1rem 1.2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.82rem' }}
                        onClick={() => navigate(`/routines/${routine.id}`)}
                        title="Ver detalle"
                    >
                        <Eye size={14} />
                    </button>
                    <button
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.82rem' }}
                        onClick={() => navigate(`/routines/${routine.id}/edit`)}
                        title="Editar"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        className="btn"
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.82rem', background: 'rgba(255,77,77,0.12)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)' }}
                        onClick={() => onDelete(routine.id)}
                        title="Eliminar"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );
});
RoutineRow.displayName = 'RoutineRow';

/**
 * Routines page component.
 * Displays a filterable list of all workout routines available in the studio.
 * Supports searching routines by name and provides actions to view, edit, or delete them.
 */
export const Routines: React.FC = () => {
    const [search, setSearch] = useState('');
    const { data, loading, error, refetch } = useApi<Routine[]>('/routine');

    // rerender-derived-state-no-effect: filter during render, not in an effect
    const filtered = useMemo(() => {
        if (!data) return [];
        const q = search.toLowerCase();
        return data.filter(r => r.rutina.toLowerCase().includes(q));
    }, [data, search]);

    const handleDelete = useCallback(async (id: number) => {
        if (!confirm('¿Eliminar esta rutina?')) return;
        try {
            await api.delete(`/routine/${id}`);
            refetch();
        } catch {
            alert('Error al eliminar la rutina');
        }
    }, [refetch]);

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Rutinas</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Gestión de rutinas y ejercicios asignados</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary" onClick={refetch} title="Refrescar" style={{ padding: '0.5rem 0.8rem' }}>
                        <RefreshCw size={16} />
                    </button>
                    <Link to="/routines/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Plus size={16} /> Nueva Rutina
                    </Link>
                </div>
            </header>

            <GlassCard>
                {/* Search bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', border: '1px solid var(--glass-border)' }}>
                    <Search size={16} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Buscar rutina..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%' }}
                    />
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Cargando rutinas...</div>
                )}
                {error && (
                    <div style={{ padding: '1rem', background: 'rgba(255,77,77,0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', color: 'var(--error)' }}>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                                        <th style={{ padding: '0.75rem 1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre</th>
                                        <th style={{ padding: '0.75rem 1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={2} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                                {search ? 'Sin resultados para la búsqueda.' : 'No hay rutinas registradas. ¡Crea la primera!'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map(r => (
                                            <RoutineRow key={r.id} routine={r} onDelete={handleDelete} />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                            {filtered.length} rutina{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
                        </p>
                    </>
                )}
            </GlassCard>
        </div>
    );
};
