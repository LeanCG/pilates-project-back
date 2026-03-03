import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GlassCard } from '../components/GlassCard';
import { progressApi } from '../api/axios';
import { useApi } from '../hooks/useApi';

const schema = z.object({
  fecha: z.string().min(1, 'Fecha requerida'),
  peso: z.coerce.number().positive('Peso inválido'),
  observaciones: z.string().optional(),
});

type ProgressForm = z.infer<typeof schema>;

interface ProgressItem {
  id: number;
  fecha: string;
  peso?: number;
  observaciones?: string;
}

export const MyProgress: React.FC = () => {
  const { data, loading, error, refetch } = useApi<ProgressItem[]>('/my-progress');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProgressForm>({
    resolver: zodResolver(schema) as any,
    defaultValues: { fecha: new Date().toISOString().slice(0, 10), peso: 0, observaciones: '' },
  });

  const onSubmit = async (values: ProgressForm) => {
    await progressApi.create(values);
    reset({ fecha: new Date().toISOString().slice(0, 10), peso: 0, observaciones: '' });
    refetch();
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Mi progreso físico</h1>

      <GlassCard>
        <h3>Registrar nuevo progreso</h3>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div className="form-group"><label>Fecha</label><input type="date" {...register('fecha')} />{errors.fecha && <span className="error-text">{errors.fecha.message}</span>}</div>
          <div className="form-group"><label>Peso (kg)</label><input type="number" step="0.1" {...register('peso')} />{errors.peso && <span className="error-text">{errors.peso.message}</span>}</div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>Observaciones</label><textarea rows={3} {...register('observaciones')} /></div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar registro'}</button>
          </div>
        </form>
      </GlassCard>

      <GlassCard>
        <h3>Historial</h3>
        {loading && <p>Cargando progreso...</p>}
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
        {!loading && !error && (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {(data || []).map((item) => (
              <div key={item.id} style={{ border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '0.8rem' }}>
                <strong>{new Date(item.fecha).toLocaleDateString()}</strong>
                <p style={{ margin: 0 }}>Peso: {item.peso ?? '-'} kg</p>
                <p style={{ margin: 0 }}>{item.observaciones || 'Sin observaciones'}</p>
              </div>
            ))}
            {(data || []).length === 0 && <p>Sin registros de progreso.</p>}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
