import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { api } from '../api/axios';

/**
 * AccountingForm page component.
 * Provides a form to register new cash flow movements (income/expense).
 * Includes fields for DNI, invoice number, amount, and discount.
 */
export const AccountingForm: React.FC = () => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        fecha: new Date().toISOString().split('T')[0],
        dni: '',
        detalle: '',
        tipo_factura: '1',
        nro_factura: '',
        monto: '',
        descuento: '0',
    });

    const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/api/accounting', {
                ...form,
                monto: Number(form.monto),
                descuento: Number(form.descuento),
                tipo_factura: Number(form.tipo_factura),
            });
            navigate('/accounting');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al registrar movimiento');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Registrar Movimiento de Caja</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Ingresos y egresos</p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/accounting')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ArrowLeft size={16} /> Volver
                </button>
            </header>

            <GlassCard style={{ maxWidth: '580px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="acc-fecha">Fecha</label>
                        <input id="acc-fecha" type="date" value={form.fecha} onChange={e => update('fecha', e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="acc-dni">DNI</label>
                        <input id="acc-dni" type="text" value={form.dni} onChange={e => update('dni', e.target.value)} placeholder="DNI del cliente" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="acc-detalle">Detalle</label>
                        <input id="acc-detalle" type="text" value={form.detalle} onChange={e => update('detalle', e.target.value)} placeholder="Descripción del movimiento" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="acc-tipo">Tipo de Factura</label>
                        <select id="acc-tipo" value={form.tipo_factura} onChange={e => update('tipo_factura', e.target.value)} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', padding: '0.6rem 0.8rem', width: '100%' }}>
                            <option value="1">Compra (Egreso)</option>
                            <option value="3">Venta (Ingreso)</option>
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label htmlFor="acc-nro">Factura N°</label>
                            <input id="acc-nro" type="number" value={form.nro_factura} onChange={e => update('nro_factura', e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label htmlFor="acc-monto">Monto ($)</label>
                            <input id="acc-monto" type="number" value={form.monto} onChange={e => update('monto', e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label htmlFor="acc-desc">Descuento (%)</label>
                            <input id="acc-desc" type="number" value={form.descuento} onChange={e => update('descuento', e.target.value)} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Save size={16} /> {saving ? 'Guardando...' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};
