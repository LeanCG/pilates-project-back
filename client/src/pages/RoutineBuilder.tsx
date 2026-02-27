import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useApi } from '../hooks/useApi';
import { api } from '../api/axios';

interface Exercise {
    id: number;
    descripcion: string;
}

interface ExerciseRow {
    ejercicio_id: number;
    ejercicio: string;
    series: number;
    repeticiones: number;
}

interface RoutineDetail {
    id?: number;
    rutina: string;
    exercises: ExerciseRow[];
}

interface Props {
    mode: 'create' | 'edit';
}

export const RoutineBuilder: React.FC<Props> = ({ mode }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // async-parallel: fetch exercises catalog in parallel with routine data
    const { data: exercisesCatalog } = useApi<Exercise[]>('/api/exercise');
    const { data: existingRoutine, loading } = useApi<RoutineDetail>(
        mode === 'edit' && id ? `/api/routine/${id}` : '__skip__'
    );

    const [routineName, setRoutineName] = useState('');
    const [rows, setRows] = useState<ExerciseRow[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && existingRoutine) {
            setRoutineName(existingRoutine.rutina);
            setRows(existingRoutine.exercises || []);
        }
    }, [existingRoutine, mode]);

    const addRow = useCallback(() => {
        setRows(prev => [...prev, { ejercicio_id: 0, ejercicio: '', series: 3, repeticiones: 12 }]);
    }, []);

    const removeRow = useCallback((index: number) => {
        setRows(prev => prev.filter((_, i) => i !== index));
    }, []);

    const updateRow = useCallback((index: number, field: keyof ExerciseRow, value: string | number) => {
        setRows(prev => {
            const next = [...prev];
            if (field === 'ejercicio_id') {
                const ex = exercisesCatalog?.find(e => e.id === Number(value));
                next[index] = { ...next[index], ejercicio_id: Number(value), ejercicio: ex?.descripcion || '' };
            } else {
                next[index] = { ...next[index], [field]: value };
            }
            return next;
        });
    }, [exercisesCatalog]);

    const handleSave = async () => {
        if (!routineName.trim()) { alert('El nombre es obligatorio'); return; }
        if (rows.length === 0) { alert('Agrega al menos un ejercicio'); return; }
        setSaving(true);
        try {
            const payload = { rutina: routineName, exercises: rows };
            if (mode === 'edit' && id) {
                await api.put(`/api/routine/${id}`, payload);
            } else {
                await api.post('/api/routine', payload);
            }
            navigate('/routines');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    if (loading && mode === 'edit') return (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Cargando rutina...</div>
    );

    return (
        <div className="flex flex-col gap-6">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{mode === 'edit' ? 'Editar Rutina' : 'Nueva Rutina'}</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Definí el nombre y los ejercicios</p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/routines')}>Volver</button>
            </header>

            <GlassCard>
                {/* Routine name */}
                <div className="form-group" style={{ maxWidth: '480px' }}>
                    <label htmlFor="routineName">Nombre de la Rutina</label>
                    <input
                        id="routineName"
                        type="text"
                        value={routineName}
                        onChange={e => setRoutineName(e.target.value)}
                        placeholder="Ej: Pilates Mat Intermedio"
                    />
                </div>

                <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--primary)', fontWeight: 600 }}>
                    Ejercicios
                </h3>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                                {['Ejercicio', 'Series', 'Repeticiones', ''].map(h => (
                                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                        Agrega ejercicios usando el botón de abajo
                                    </td>
                                </tr>
                            )}
                            {rows.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <select
                                            value={row.ejercicio_id}
                                            onChange={e => updateRow(i, 'ejercicio_id', e.target.value)}
                                            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.8rem', width: '100%' }}
                                        >
                                            <option value={0}>Seleccionar...</option>
                                            {exercisesCatalog?.map(ex => (
                                                <option key={ex.id} value={ex.id}>{ex.descripcion}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <input
                                            type="number"
                                            min={1}
                                            value={row.series}
                                            onChange={e => updateRow(i, 'series', Number(e.target.value))}
                                            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.8rem', width: '70px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <input
                                            type="number"
                                            min={1}
                                            value={row.repeticiones}
                                            onChange={e => updateRow(i, 'repeticiones', Number(e.target.value))}
                                            style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.8rem', width: '80px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <button
                                            onClick={() => removeRow(i)}
                                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--error)' }}
                                            title="Quitar ejercicio"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.2rem' }}>
                    <button className="btn btn-secondary" onClick={addRow} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Plus size={16} /> Agregar Ejercicio
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Rutina'}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};
