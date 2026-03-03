import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeesApi, shiftsApi } from '../api/axios';
import { GlassCard } from '../components/GlassCard';

const schema = z.object({
  fecha: z.string().min(1, 'Fecha requerida'),
  hora: z.string().min(1, 'Hora requerida'),
  instructor_id: z.coerce.number().min(1, 'Instructor requerido'),
  actividad: z.string().min(2, 'Actividad requerida'),
  capacidad: z.coerce.number().min(1).max(50).default(10),
});

type ShiftFormData = z.infer<typeof schema>;

interface Instructor {
  id: number;
  nombre: string;
  apellido: string;
}

export const ShiftForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ShiftFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      fecha: new Date().toISOString().slice(0, 10),
      capacidad: 10,
      actividad: 'Pilates',
    },
  });

  useEffect(() => {
    employeesApi.listInstructors().then((res) => setInstructors(res.data || []));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    shiftsApi.getById(Number(id)).then((res) => {
      const shift = res.data;
      reset({
        fecha: shift.fecha?.slice(0, 10),
        hora: shift.hora?.slice(0, 5),
        instructor_id: shift.instructor_id,
        actividad: shift.actividad,
        capacidad: shift.capacidad,
      });
    });
  }, [id, isEdit, reset]);

  const onSubmit = async (values: ShiftFormData) => {
    if (isEdit) {
      await shiftsApi.update(Number(id), values);
    } else {
      await shiftsApi.create(values);
    }
    navigate('/shifts');
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{isEdit ? 'Editar turno' : 'Nuevo turno'}</h1>
      <GlassCard>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div className="form-group"><label>Fecha</label><input type="date" {...register('fecha')} />{errors.fecha && <span className="error-text">{errors.fecha.message}</span>}</div>
          <div className="form-group"><label>Hora</label><input type="time" {...register('hora')} />{errors.hora && <span className="error-text">{errors.hora.message}</span>}</div>
          <div className="form-group">
            <label>Instructor</label>
            <select {...register('instructor_id')}>
              <option value="">Seleccionar</option>
              {instructors.map((inst) => <option key={inst.id} value={inst.id}>{inst.apellido}, {inst.nombre}</option>)}
            </select>
            {errors.instructor_id && <span className="error-text">{errors.instructor_id.message}</span>}
          </div>
          <div className="form-group"><label>Actividad</label><input {...register('actividad')} />{errors.actividad && <span className="error-text">{errors.actividad.message}</span>}</div>
          <div className="form-group"><label>Capacidad</label><input type="number" {...register('capacidad')} />{errors.capacidad && <span className="error-text">{errors.capacidad.message}</span>}</div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/shifts')}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
