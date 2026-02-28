import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { useApi } from '../hooks/useApi';
import { api } from '../api/axios';

interface Client {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    email?: string;
    estado: number;
    tipo_persona?: string;
}

const ClientRow = React.memo(({ client, onDelete }: { client: Client; onDelete: (id: number) => void }) => {
    const navigate = useNavigate();
    return (
        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
            <td style={{ padding: '1rem 1.2rem', fontWeight: 500 }}>{client.apellido}, {client.nombre}</td>
            <td style={{ padding: '1rem 1.2rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{client.dni}</td>
            <td style={{ padding: '1rem 1.2rem' }}><StatusBadge active={client.estado === 1} /></td>
            <td style={{ padding: '1rem 1.2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.82rem' }} onClick={() => navigate(`/clients/${client.id}`)} title="Ver detalle"><Eye size={14} /></button>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.82rem' }} onClick={() => navigate(`/clients/${client.id}/edit`)} title="Editar"><Pencil size={14} /></button>
                    <button className="btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.82rem', background: 'rgba(255,77,77,0.12)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)' }} onClick={() => onDelete(client.id)} title="Eliminar"><Trash2 size={14} /></button>
                </div>
            </td>
        </tr>
    );
});
ClientRow.displayName = 'ClientRow';

/**
 * Clients page component.
 * Displays a filterable table of all studio clients with actions to view, edit, or delete.
 * Uses memoized rows for optimized rendering of the table list.
 */
export const Clients: React.FC = () => {
    const [search, setSearch] = useState('');
    const { data, loading, error, refetch } = useApi<Client[]>('/users/list');

    const filtered = useMemo(() => {
        if (!data) return [];
        const q = search.toLowerCase();
        return data.filter(c =>
            `${c.nombre} ${c.apellido}`.toLowerCase().includes(q) ||
            c.dni?.toLowerCase().includes(q)
        );
    }, [data, search]);

    const handleDelete = useCallback(async (id: number) => {
        if (!confirm('¿Dar de baja este cliente?')) return;
        try {
            await api.delete(`/users/delete/${id}`);
            refetch();
        } catch {
            alert('Error al eliminar');
        }
    }, [refetch]);

    return (
        <div className="flex flex-col gap-6">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Clientes</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Gestión de socios de la academia</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary" onClick={refetch} style={{ padding: '0.5rem 0.8rem' }}><RefreshCw size={16} /></button>
                    <Link to="/clients/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Plus size={16} /> Nuevo Cliente
                    </Link>
                </div>
            </header>

            <GlassCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', border: '1px solid var(--glass-border)' }}>
                    <Search size={16} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o DNI..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%' }}
                    />
                </div>

                {loading && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Cargando clientes...</div>}
                {error && <div style={{ padding: '1rem', background: 'rgba(255,77,77,0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', color: 'var(--error)' }}>{error}</div>}

                {!loading && !error && (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                                        {['Nombre', 'DNI', 'Estado', 'Acciones'].map(h => (
                                            <th key={h} style={{ padding: '0.75rem 1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                            {search ? 'Sin resultados.' : 'No hay clientes registrados.'}
                                        </td></tr>
                                    ) : (
                                        filtered.map(c => <ClientRow key={c.id} client={c} onDelete={handleDelete} />)
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                            {filtered.length} cliente{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                        </p>
                    </>
                )}
            </GlassCard>
        </div>
    );
};
