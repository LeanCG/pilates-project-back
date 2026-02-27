import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GlassCard } from './GlassCard';

const clientSchema = z.object({
    nombre: z.string().min(2, 'Obligatorio'),
    apellido: z.string().min(2, 'Obligatorio'),
    dni: z.string().min(7, 'DNI inválido'),
    cuil: z.string().min(10, 'CUIL inválido'),
    direccion: z.string().min(4, 'Obligatorio'),
    municipio_id: z.number().int(),
    tipo_persona_id: z.number().int(),

    username: z.string().min(4, 'Debe tener al menos 4 caracteres'),
    password: z.string().min(6, 'Debe tener al menos 6 caracteres'),
    rol_id: z.number().int(),

    fecha_turno: z.string(),
    hora: z.string(),
    tipo_pilates_id: z.number().int(),
    dias_turno_id: z.number().int(),

    precio: z.number().min(1, 'Debe ser mayor a 0'),
    descuento: z.number().min(0).max(100),
    cantidad: z.number().int().min(1),
    numero_factura: z.string().optional(),
    sub_total: z.number().optional()
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
    onSubmit: (data: ClientFormData) => Promise<void>;
}

/**
 * ClientForm component.
 * A comprehensive form for creating or editing studio clients.
 * Uses react-hook-form and zod for validation.
 * Includes sections for personal data, credentials, and subscription/billing totals.
 * 
 * @param props - Component props including the onSubmit handler.
 */
export const ClientForm: React.FC<ClientFormProps> = ({ onSubmit }) => {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            municipio_id: 1,
            tipo_persona_id: 1,
            rol_id: 2,
            tipo_pilates_id: 1,
            dias_turno_id: 1,
            precio: 15000,
            descuento: 0,
            cantidad: 1,
            fecha_turno: new Date().toISOString().split('T')[0],
            hora: '08:00'
        }
    });

    const precio = watch('precio');
    const descuento = watch('descuento');
    const cantidad = watch('cantidad');

    const totalCalculado = React.useMemo(() => {
        const base = precio * cantidad;
        return base - (base * (descuento / 100));
    }, [precio, descuento, cantidad]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Sección 1: Datos Personales */}
                <GlassCard>
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-4">Datos Personales</h3>
                    <div className="flex flex-col gap-4">
                        <div className="form-group mb-0">
                            <label>Nombre</label>
                            <input {...register('nombre')} className={errors.nombre ? 'input-error' : ''} />
                            {errors.nombre && <span className="error-text">{errors.nombre.message}</span>}
                        </div>
                        <div className="form-group mb-0">
                            <label>Apellido</label>
                            <input {...register('apellido')} className={errors.apellido ? 'input-error' : ''} />
                            {errors.apellido && <span className="error-text">{errors.apellido.message}</span>}
                        </div>
                        <div className="form-group mb-0">
                            <label>DNI</label>
                            <input {...register('dni')} className={errors.dni ? 'input-error' : ''} />
                            {errors.dni && <span className="error-text">{errors.dni.message}</span>}
                        </div>
                        <div className="form-group mb-0">
                            <label>CUIL</label>
                            <input {...register('cuil')} className={errors.cuil ? 'input-error' : ''} />
                            {errors.cuil && <span className="error-text">{errors.cuil.message}</span>}
                        </div>
                        <div className="form-group mb-0">
                            <label>Dirección</label>
                            <input {...register('direccion')} className={errors.direccion ? 'input-error' : ''} />
                            {errors.direccion && <span className="error-text">{errors.direccion.message}</span>}
                        </div>
                    </div>
                </GlassCard>

                {/* Sección 2: Credenciales */}
                <GlassCard>
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-4">Credenciales</h3>
                    <div className="flex flex-col gap-4">
                        <div className="form-group mb-0">
                            <label>Usuario</label>
                            <input {...register('username')} className={errors.username ? 'input-error' : ''} />
                            {errors.username && <span className="error-text">{errors.username.message}</span>}
                        </div>
                        <div className="form-group mb-0">
                            <label>Contraseña</label>
                            <input type="password" {...register('password')} className={errors.password ? 'input-error' : ''} />
                            {errors.password && <span className="error-text">{errors.password.message}</span>}
                        </div>
                        <div className="form-group mb-0 mt-4 border-t border-[var(--glass-border)] pt-4">
                            <h4 className="text-md font-medium text-[var(--text-secondary)] mb-2">Turno Asignado</h4>
                            <label>Fecha</label>
                            <input type="date" {...register('fecha_turno')} className={errors.fecha_turno ? 'input-error' : ''} />

                            <label className="mt-2">Hora</label>
                            <input type="time" {...register('hora')} className={errors.hora ? 'input-error' : ''} />
                        </div>
                    </div>
                </GlassCard>

                {/* Sección 3: Suscripción / Factura */}
                <GlassCard>
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-4">Suscripción & Factura</h3>
                    <div className="flex flex-col gap-4">
                        <div className="form-group mb-0">
                            <label htmlFor="precio">Precio Base Mensual ($)</label>
                            <input id="precio" type="number" {...register('precio', { valueAsNumber: true })} className={errors.precio ? 'input-error' : ''} />
                        </div>
                        <div className="form-group mb-0">
                            <label htmlFor="descuento">Descuento (%)</label>
                            <input id="descuento" type="number" {...register('descuento', { valueAsNumber: true })} className={errors.descuento ? 'input-error' : ''} />
                            {errors.descuento && <span className="error-text">{errors.descuento.message}</span>}
                        </div>
                        <div className="form-group mb-0">
                            <label htmlFor="cantidad">Meses (Cantidad)</label>
                            <input id="cantidad" type="number" {...register('cantidad', { valueAsNumber: true })} className={errors.cantidad ? 'input-error' : ''} />
                        </div>

                        <div className="mt-4 p-4 rounded-lg bg-[rgba(157,78,221,0.1)] border border-[var(--primary)]">
                            <p className="text-sm text-[var(--text-secondary)]">Total a abonar</p>
                            <p className="text-3xl font-bold text-white mt-1">${totalCalculado.toLocaleString()}</p>
                        </div>
                    </div>
                </GlassCard>

            </div>

            <div className="flex justify-end mt-4">
                <button
                    type="submit"
                    className="btn btn-primary px-8 py-3 text-lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
                </button>
            </div>
        </form>
    );
};
