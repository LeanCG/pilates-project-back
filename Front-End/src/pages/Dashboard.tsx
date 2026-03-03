import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Users, DollarSign, Calendar, Dumbbell, TrendingUp, Sun, Sunset, Moon } from 'lucide-react';
import { useApi } from '../hooks/useApi';

/**
 * Dashboard page component.
 * Displays a video hero, key studio metrics (user counts, income),
 * and dynamic attendance cards by shift.
 */
export const Dashboard: React.FC = () => {
    // async-parallel: all three fetches kick off simultaneously
    const { data: dashData } = useApi<any>('/dashboard');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ── Hero: Pilates Welcome Video ── */}
            <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: '340px', maxHeight: '420px' }}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                >
                    <source src="/videos/pilates_welcome.mp4" type="video/mp4" />
                </video>
                {/* Gradient overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(13,0,26,0.35) 0%, rgba(13,0,26,0.85) 100%)',
                }} />
                {/* Text on top of video */}
                <div style={{
                    position: 'absolute', bottom: '2.5rem', left: '2.5rem', right: '2.5rem',
                    zIndex: 2,
                }}>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '0.6rem' }}>
                        ¡Bienvenida, Profe!
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '520px' }}>
                        Tu espacio de pilates donde se encuentran la flexibilidad y la diversión.
                    </p>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                <GlassCard>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(157,78,221,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Calendar size={22} color="var(--primary)" />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0 }}>Turnos Asignados</p>
                            <p style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>
                                {dashData?.turnos ?? '—'}
                            </p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(80,200,120,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DollarSign size={22} color="var(--success)" />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0 }}>Ingresos Mes</p>
                            <p style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--success)' }}>
                                ${dashData?.ingresos?.toLocaleString() ?? '—'}
                            </p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(100,149,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={22} color="var(--accent)" />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0 }}>Clientes Activos</p>
                            <p style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--accent)' }}>
                                {dashData?.clientes ?? '—'}
                            </p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(255,165,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Dumbbell size={22} color="#ffa500" />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0 }}>Rutinas Activas</p>
                            <p style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>
                                {dashData?.rutinas ?? '—'}
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* ── Asistencias por turno ── */}
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '0.5rem' }}>
                <TrendingUp size={20} style={{ verticalAlign: 'text-bottom', marginRight: '0.5rem', color: 'var(--primary)' }} />
                Asistencias por Turno
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
                {[
                    { label: 'Turno Mañana', icon: <Sun size={28} color="#ffa500" />, key: 'manana', gradient: 'linear-gradient(135deg, rgba(255,165,0,0.06), rgba(255,165,0,0.18))' },
                    { label: 'Turno Tarde', icon: <Sunset size={28} color="#e06c9f" />, key: 'tarde', gradient: 'linear-gradient(135deg, rgba(224,108,159,0.06), rgba(224,108,159,0.18))' },
                    { label: 'Turno Noche', icon: <Moon size={28} color="#6495ed" />, key: 'noche', gradient: 'linear-gradient(135deg, rgba(100,149,237,0.06), rgba(100,149,237,0.18))' },
                ].map(t => (
                    <GlassCard key={t.key} style={{ background: t.gradient }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                            {t.icon}
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{t.label}</h3>
                        </div>
                        <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                            {dashData?.[t.key] ?? '—'}
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>alumnos hoy</p>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};
