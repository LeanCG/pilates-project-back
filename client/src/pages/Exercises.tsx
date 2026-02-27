import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useApi } from '../hooks/useApi';
import { api } from '../api/axios';

interface Exercise {
    id: number;
    descripcion: string;
}

// rerender-memo: memoized row
const ExerciseRow = React.memo(({ ex, onDelete }: { ex: Exercise; onDelete: (id: number) => void }) => {
    const navigate = useNavigate();
    return (
        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
            <td style={{ padding: '1rem 1.2rem', fontWeight: 500 }}>{ex.descripcion}</td>
            <td style={{ padding: '1rem 1.2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.82rem' }}
                        onClick={() => navigate(`/exercises/${ex.id}/edit`)}
                        title="Editar"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        className="btn"
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.82rem', background: 'rgba(255,77,77,0.12)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)' }}
                        onClick={() => onDelete(ex.id)}
                        title="Eliminar"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );
});
ExerciseRow.displayName = 'ExerciseRow';

export const Exercises: React.FC = () => {
    const [search, setSearch] = useState('');
    const { data, loading, error, refetch } = useApi<Exercise[]>('/api/exercise');

    // rerender-derived-state-no-effect: computed during render, not in effect
    const filtered = useMemo(() => {
        if (!data) return [];
        const q = search.toLowerCase();
        return data.filter(e => e.descripcion.toLowerCase().includes(q));
    }, [data, search]);

    const handleDelete = useCallback(async (id: number) => {
        if (!confirm('¿Eliminar este ejercicio?')) return;
        try {
            await api.delete(`/api/exercise/${id}`);
            refetch();
        } catch {
            alert('Error al eliminar el ejercicio');
        }
    }, [refetch]);

    return (
        <div className="flex flex-col gap-6">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Ejercicios</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Catálogo de ejercicios disponibles</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary" onClick={refetch} style={{ padding: '0.5rem 0.8rem' }}>
                        <RefreshCw size={16} />
                    </button>
                    <Link to="/exercises/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Plus size={16} /> Nuevo Ejercicio
                    </Link>
                </div>
            </header>

            <GlassCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', border: '1px solid var(--glass-border)' }}>
                    <Search size={16} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Buscar ejercicio..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%' }}
                    />
                </div>

                {loading && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Cargando ejercicios...</div>}
                {error && <div style={{ padding: '1rem', background: 'rgba(255,77,77,0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', color: 'var(--error)' }}>{error}</div>}

                {!loading && !error && (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                                        {['Descripción', 'Acciones'].map(h => (
                                            <th key={h} style={{ padding: '0.75rem 1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan={2} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                            {search ? 'Sin resultados.' : 'No hay ejercicios. ¡Crea el primero!'}
                                        </td></tr>
                                    ) : (
                                        filtered.map(ex => <ExerciseRow key={ex.id} ex={ex} onDelete={handleDelete} />)
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                            {filtered.length} ejercicio{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                        </p>
                    </>
                )}
            </GlassCard>
        </div>
    );
};
