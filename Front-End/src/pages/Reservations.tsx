import React, { useMemo, useState } from 'react';
import { CalendarPlus, CheckCircle2, CircleX, RefreshCw } from 'lucide-react';
import { reservationsApi } from '../api/axios';
import { useApi } from '../hooks/useApi';
import { GlassCard } from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';

interface Reservation {
  id: number;
  estado: string;
  turno_fecha: string;
  turno_hora: string;
  actividad: string;
}

interface Shift {
  id: number;
  fecha: string;
  hora: string;
  actividad: string;
  instructor_nombre: string;
  cupo_disponible: number;
}

const canConfirm = (fecha: string, hora: string) => {
  const diff = new Date(`${fecha} ${hora}`).getTime() - Date.now();
  return diff >= 30 * 60 * 1000;
};

const canCancel = (fecha: string, hora: string) => {
  const diff = new Date(`${fecha} ${hora}`).getTime() - Date.now();
  return diff >= 60 * 60 * 1000;
};

export const Reservations: React.FC = () => {
  const { user } = useAuth();
  const [loadingAction, setLoadingAction] = useState<number | null>(null);

  const { data: reservations, refetch: refetchReservations } = useApi<Reservation[]>(`/reservations?cliente_id=${user?.id || ''}`, [user?.id]);
  const { data: shifts, refetch: refetchShifts } = useApi<Shift[]>('/shifts/available');

  const myReservations = useMemo(() => {
    return (reservations || []).filter((r) => r);
  }, [reservations]);

  const reserveShift = async (shiftId: number) => {
    try {
      setLoadingAction(shiftId);
      await reservationsApi.create(shiftId);
      refetchReservations();
      refetchShifts();
    } finally {
      setLoadingAction(null);
    }
  };

  const confirm = async (reservationId: number) => {
    try {
      setLoadingAction(reservationId);
      await reservationsApi.confirm(reservationId);
      refetchReservations();
    } finally {
      setLoadingAction(null);
    }
  };

  const cancel = async (reservationId: number) => {
    try {
      setLoadingAction(reservationId);
      await reservationsApi.cancel(reservationId, 'Cancelado desde app');
      refetchReservations();
      refetchShifts();
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Mis reservas</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Confirmación mínima 30 min, cancelación recomendada con 1h</p>
        </div>
        <button className="btn btn-secondary" onClick={() => { refetchReservations(); refetchShifts(); }}><RefreshCw size={16} /></button>
      </header>

      <GlassCard>
        <h3 style={{ marginBottom: '1rem' }}>Turnos disponibles</h3>
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          {(shifts || []).slice(0, 8).map((shift) => (
            <div key={shift.id} style={{ border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <strong>{new Date(shift.fecha).toLocaleDateString()} {shift.hora.slice(0, 5)}</strong>
                <p style={{ margin: 0 }}>{shift.actividad} - {shift.instructor_nombre}</p>
              </div>
              <button className="btn btn-primary" disabled={shift.cupo_disponible <= 0 || loadingAction === shift.id} onClick={() => reserveShift(shift.id)}>
                <CalendarPlus size={16} /> Reservar
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 style={{ marginBottom: '1rem' }}>Mis próximas reservas</h3>
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          {myReservations.length === 0 && <p>No tenés reservas registradas.</p>}
          {myReservations.map((reservation) => (
            <div key={reservation.id} style={{ border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <strong>{new Date(reservation.turno_fecha).toLocaleDateString()} {reservation.turno_hora.slice(0, 5)}</strong>
                <p style={{ margin: 0 }}>{reservation.actividad} - Estado: {reservation.estado}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" disabled={!canConfirm(reservation.turno_fecha, reservation.turno_hora) || loadingAction === reservation.id} onClick={() => confirm(reservation.id)}>
                  <CheckCircle2 size={16} /> Confirmar
                </button>
                <button className="btn" style={{ background: canCancel(reservation.turno_fecha, reservation.turno_hora) ? 'rgba(255,77,77,0.12)' : 'rgba(255,179,0,0.12)', color: canCancel(reservation.turno_fecha, reservation.turno_hora) ? 'var(--error)' : 'var(--warning)' }} disabled={loadingAction === reservation.id} onClick={() => cancel(reservation.id)}>
                  <CircleX size={16} /> Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
