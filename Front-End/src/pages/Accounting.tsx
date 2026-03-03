import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, RefreshCw, TrendingUp, TrendingDown, ArrowLeftRight, Calendar } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useApi } from '../hooks/useApi';

interface Movement {
    id: number;
    descripcion: string;
    fecha: string;
    ingreso: number;
    egreso: number;
}

/**
 * Accounting page component.
 * Displays studio cash flow, including income and expenses.
 * Allows filtering by date range and description search.
 */
export const Accounting: React.FC = () => {
    const [search, setSearch] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const { data, loading, error, refetch } = useApi<Movement[]>('/accounting/balance');

    const filtered = useMemo(() => {
        if (!data) return [];
        let results = data;
        if (search) {
            const q = search.toLowerCase();
            results = results.filter(m => m.descripcion?.toLowerCase().includes(q));
        }
        if (dateFrom) results = results.filter(m => m.fecha >= dateFrom);
        if (dateTo) results = results.filter(m => m.fecha <= dateTo);
        return results;
    }, [data, search, dateFrom, dateTo]);

    const totals = useMemo(() => {
        const ingresos = filtered.reduce((s, m) => s + (m.ingreso || 0), 0);
        const egresos = filtered.reduce((s, m) => s + (m.egreso || 0), 0);
        return { ingresos, egresos, balance: ingresos - egresos };
    }, [filtered]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Movimientos de Caja</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Flujo de caja y facturación</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary" onClick={refetch} style={{ padding: '0.5rem 0.8rem' }}><RefreshCw size={16} /></button>
                    <Link to="/accounting/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Plus size={16} /> Nuevo Movimiento
                    </Link>
                </div>
            </header>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <GlassCard>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <TrendingUp size={22} color="var(--success)" />
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>Total Ingresos</p>
                            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--success)', margin: 0 }}>${totals.ingresos.toLocaleString()}</p>
                        </div>
                    </div>
                </GlassCard>
                <GlassCard>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <TrendingDown size={22} color="var(--error)" />
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>Total Egresos</p>
                            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--error)', margin: 0 }}>${totals.egresos.toLocaleString()}</p>
                        </div>
                    </div>
                </GlassCard>
                <GlassCard>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <ArrowLeftRight size={22} color="var(--primary)" />
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>Balance</p>
                            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: totals.balance >= 0 ? 'var(--success)' : 'var(--error)', margin: 0 }}>
                                ${totals.balance.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <GlassCard>
                {/* Filters */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', border: '1px solid var(--glass-border)', flex: 1, minWidth: '200px' }}>
                        <Search size={16} style={{ color: 'var(--text-secondary)' }} />
                        <input type="text" placeholder="Buscar descripción..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.6rem', color: 'var(--text-primary)' }} />
                        <span style={{ color: 'var(--text-muted)' }}>a</span>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.6rem', color: 'var(--text-primary)' }} />
                    </div>
                </div>

                {loading && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Cargando movimientos...</div>}
                {error && <div style={{ padding: '1rem', background: 'rgba(255,77,77,0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', color: 'var(--error)' }}>{error}</div>}

                {!loading && !error && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                                    {['Descripción', 'Fecha', 'Ingreso', 'Egreso'].map(h => (
                                        <th key={h} style={{ padding: '0.75rem 1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Sin movimientos en este rango.</td></tr>
                                ) : (
                                    filtered.map(m => (
                                        <tr key={m.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '0.9rem 1.2rem', fontWeight: 500 }}>{m.descripcion}</td>
                                            <td style={{ padding: '0.9rem 1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{m.fecha?.split('T')[0]}</td>
                                            <td style={{ padding: '0.9rem 1.2rem', color: m.ingreso ? 'var(--success)' : 'var(--text-muted)', fontWeight: m.ingreso ? 600 : 400 }}>
                                                {m.ingreso ? `$${m.ingreso.toLocaleString()}` : '—'}
                                            </td>
                                            <td style={{ padding: '0.9rem 1.2rem', color: m.egreso ? 'var(--error)' : 'var(--text-muted)', fontWeight: m.egreso ? 600 : 400 }}>
                                                {m.egreso ? `$${m.egreso.toLocaleString()}` : '—'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};
