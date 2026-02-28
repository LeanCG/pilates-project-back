import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useApi } from '../hooks/useApi';
import { api } from '../api/axios';

interface Exercise {
    id: number;
    descripcion: string;
}

interface Props {
    mode: 'create' | 'edit';
}

export const ExerciseForm: React.FC<Props> = ({ mode }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [descripcion, setDescripcion] = useState('');
    const [saving, setSaving] = useState(false);

    const { data } = useApi<Exercise>(
        mode === 'edit' && id ? `/exercise/${id}` : '__skip__'
    );

    useEffect(() => {
        if (data) setDescripcion(data.descripcion);
    }, [data]);

    const handleSave = async () => {
        if (!descripcion.trim()) { alert('La descripción es obligatoria'); return; }
        setSaving(true);
        try {
            if (mode === 'edit' && id) {
                await api.put(`/exercise/${id}`, { descripcion });
            } else {
                await api.post('/exercise', { descripcion });
            }
            navigate('/exercises');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{mode === 'edit' ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Manage exercise catalog</p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/exercises')}>Volver</button>
            </header>

            <GlassCard style={{ maxWidth: '520px' }}>
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción del Ejercicio</label>
                    <input
                        id="descripcion"
                        type="text"
                        value={descripcion}
                        onChange={e => setDescripcion(e.target.value)}
                        placeholder="Ej: Plancha lateral con elevación de pierna"
                        onKeyDown={e => e.key === 'Enter' && handleSave()}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};
