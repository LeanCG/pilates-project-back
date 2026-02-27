import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Shield, Calendar, Mail } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { useApi } from '../hooks/useApi';

interface ClientInfo {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    cuil: string;
    username: string;
    tipo_persona?: string;
    direccion?: string;
    municipio?: string;
    departamento?: string;
    provincia?: string;
    pais?: string;
    rol?: string;
    created_at?: string;
    updated_at?: string;
    tipo_estado_id?: number;
}

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem 0', borderBottom: '1px solid var(--glass-border)' }}>
        <span style={{ color: 'var(--primary)', flexShrink: 0 }}>{icon}</span>
        <span style={{ color: 'var(--text-secondary)', minWidth: '120px', fontSize: '0.85rem' }}>{label}</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value || '—'}</span>
    </div>
);

export const ClientDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: user, loading, error } = useApi<ClientInfo>(`/api/users/${id}`);

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Cargando información del cliente...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--error)' }}>{error}</div>;
    if (!user) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{user.apellido}, {user.nombre}</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Ficha personal completa</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary" onClick={() => navigate(`/clients/${id}/edit`)}>Editar</button>
                    <button className="btn btn-secondary" onClick={() => navigate('/clients')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <ArrowLeft size={16} /> Volver
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.2rem' }}>
                <GlassCard>
                    <h3 style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '1rem', fontSize: '1.05rem' }}>
                        <User size={18} style={{ verticalAlign: 'text-bottom', marginRight: '0.5rem' }} />
                        Datos Personales
                    </h3>
                    <InfoRow icon={<User size={15} />} label="Nombre" value={user.nombre} />
                    <InfoRow icon={<User size={15} />} label="Apellido" value={user.apellido} />
                    <InfoRow icon={<Shield size={15} />} label="DNI" value={user.dni} />
                    <InfoRow icon={<Shield size={15} />} label="CUIL" value={user.cuil} />
                    <InfoRow icon={<Mail size={15} />} label="Username" value={user.username} />
                    <InfoRow icon={<User size={15} />} label="Tipo Persona" value={user.tipo_persona} />
                </GlassCard>

                <GlassCard>
                    <h3 style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '1rem', fontSize: '1.05rem' }}>
                        <MapPin size={18} style={{ verticalAlign: 'text-bottom', marginRight: '0.5rem' }} />
                        Ubicación y Estado
                    </h3>
                    <InfoRow icon={<MapPin size={15} />} label="Dirección" value={user.direccion} />
                    <InfoRow icon={<MapPin size={15} />} label="Municipio" value={user.municipio} />
                    <InfoRow icon={<MapPin size={15} />} label="Departamento" value={user.departamento} />
                    <InfoRow icon={<MapPin size={15} />} label="Provincia" value={user.provincia} />
                    <InfoRow icon={<MapPin size={15} />} label="País" value={user.pais} />
                    <InfoRow icon={<Shield size={15} />} label="Rol" value={user.rol} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem 0' }}>
                        <span style={{ color: 'var(--primary)', flexShrink: 0 }}><Calendar size={15} /></span>
                        <span style={{ color: 'var(--text-secondary)', minWidth: '120px', fontSize: '0.85rem' }}>Estado</span>
                        <StatusBadge active={user.tipo_estado_id === 1} />
                    </div>
                </GlassCard>
            </div>

            <GlassCard>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <InfoRow icon={<Calendar size={15} />} label="Fecha Creación" value={user.created_at?.split('T')[0]} />
                    <InfoRow icon={<Calendar size={15} />} label="Última Actualización" value={user.updated_at?.split('T')[0]} />
                </div>
            </GlassCard>
        </div>
    );
};
