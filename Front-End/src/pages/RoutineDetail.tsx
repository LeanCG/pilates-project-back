import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Dumbbell } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useApi } from '../hooks/useApi';

interface ExerciseRow {
    ejercicio: string;
    series: number;
    repeticiones: number;
}

interface RoutineData {
    id: number;
    rutina: string;
    exercises: ExerciseRow[];
}

export const RoutineDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, loading, error } = useApi<RoutineData>(`/routine/list/${id}`);

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Cargando rutina...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--error)' }}>{error}</div>;
    if (!data) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                        <Dumbbell size={22} style={{ verticalAlign: 'text-bottom', marginRight: '0.6rem', color: 'var(--primary)' }} />
                        {data.rutina}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Detalle de la rutina y sus ejercicios</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-primary" onClick={() => navigate(`/routines/${id}/edit`)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Pencil size={16} /> Editar
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/routines')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <ArrowLeft size={16} /> Volver
                    </button>
                </div>
            </header>

            <GlassCard>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                                {['Ejercicio', 'Series', 'Repeticiones'].map(h => (
                                    <th key={h} style={{ padding: '0.75rem 1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(!data.exercises || data.exercises.length === 0) ? (
                                <tr><td colSpan={3} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Esta rutina no tiene ejercicios asignados.</td></tr>
                            ) : (
                                data.exercises.map((ex, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '0.9rem 1.2rem', fontWeight: 500 }}>{ex.ejercicio}</td>
                                        <td style={{ padding: '0.9rem 1.2rem' }}>
                                            <span style={{ background: 'rgba(157,78,221,0.12)', color: 'var(--primary)', padding: '3px 12px', borderRadius: '999px', fontWeight: 600, fontSize: '0.85rem' }}>{ex.series}</span>
                                        </td>
                                        <td style={{ padding: '0.9rem 1.2rem' }}>
                                            <span style={{ background: 'rgba(100,149,237,0.12)', color: 'var(--accent)', padding: '3px 12px', borderRadius: '999px', fontWeight: 600, fontSize: '0.85rem' }}>{ex.repeticiones}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {data.exercises && data.exercises.length > 0 && (
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {data.exercises.length} ejercicio{data.exercises.length !== 1 ? 's' : ''} en esta rutina
                    </p>
                )}
            </GlassCard>
        </div>
    );
};
