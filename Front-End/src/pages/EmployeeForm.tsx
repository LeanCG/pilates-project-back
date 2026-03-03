import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeesApi } from '../api/axios';
import { GlassCard } from '../components/GlassCard';

const schema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  apellido: z.string().min(2, 'Apellido requerido'),
  dni: z.string().min(7, 'DNI inválido'),
  cuil: z.string().optional(),
  direccion: z.string().optional(),
  municipio_id: z.coerce.number().default(1),
  cargo: z.string().min(2, 'Cargo requerido'),
  especialidad: z.string().optional(),
  fecha_contratacion: z.string().min(1, 'Fecha requerida'),
});

type FormData = z.infer<typeof schema>;

export const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { municipio_id: 1, fecha_contratacion: new Date().toISOString().slice(0, 10) },
  });

  useEffect(() => {
    if (!isEdit) return;
    employeesApi.getById(Number(id)).then((res) => {
      const employee = res.data;
      reset({
        nombre: employee.nombre,
        apellido: employee.apellido,
        dni: employee.dni,
        cuil: employee.cuil || '',
        direccion: employee.direccion || '',
        municipio_id: employee.municipio_id || 1,
        cargo: employee.cargo,
        especialidad: employee.especialidad || '',
        fecha_contratacion: employee.fecha_contratacion?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      });
    });
  }, [id, isEdit, reset]);

  const onSubmit = async (values: FormData) => {
    if (isEdit) {
      await employeesApi.update(Number(id), values);
    } else {
      await employeesApi.create(values);
    }
    navigate('/employees');
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{isEdit ? 'Editar empleado' : 'Nuevo empleado'}</h1>
      <GlassCard>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div className="form-group"><label>Nombre</label><input {...register('nombre')} />{errors.nombre && <span className="error-text">{errors.nombre.message}</span>}</div>
          <div className="form-group"><label>Apellido</label><input {...register('apellido')} />{errors.apellido && <span className="error-text">{errors.apellido.message}</span>}</div>
          <div className="form-group"><label>DNI</label><input {...register('dni')} />{errors.dni && <span className="error-text">{errors.dni.message}</span>}</div>
          <div className="form-group"><label>CUIL</label><input {...register('cuil')} /></div>
          <div className="form-group"><label>Cargo</label><input {...register('cargo')} />{errors.cargo && <span className="error-text">{errors.cargo.message}</span>}</div>
          <div className="form-group"><label>Especialidad</label><input {...register('especialidad')} /></div>
          <div className="form-group"><label>Dirección</label><input {...register('direccion')} /></div>
          <div className="form-group"><label>Municipio ID</label><input type="number" {...register('municipio_id')} /></div>
          <div className="form-group"><label>Fecha contratación</label><input type="date" {...register('fecha_contratacion')} />{errors.fecha_contratacion && <span className="error-text">{errors.fecha_contratacion.message}</span>}</div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/employees')}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
