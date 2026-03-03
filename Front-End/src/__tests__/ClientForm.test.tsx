import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ClientForm } from '../components/ClientForm';
import '@testing-library/jest-dom';

describe('ClientForm', () => {
    it('Calculates subtotal correctly based on precio, descuento and cantidad', async () => {
        const mockSubmit = vi.fn();
        render(<ClientForm onSubmit={mockSubmit} />);

        // Get inputs
        const precioInput = screen.getByLabelText(/Precio Base Mensual/i) as HTMLInputElement;
        const descuentoInput = screen.getByLabelText(/Descuento/i) as HTMLInputElement;
        const cantidadInput = screen.getByLabelText(/Meses \(Cantidad\)/i) as HTMLInputElement;

        // The default values in the component are 15000, 0, 1 -> subtotal is 15000
        expect(screen.getByText(/\$15[.,]000/)).toBeInTheDocument();

        // Change values
        fireEvent.change(precioInput, { target: { value: '1000' } });
        fireEvent.change(cantidadInput, { target: { value: '2' } });
        fireEvent.change(descuentoInput, { target: { value: '10' } });

        // Expected calculation: (1000 * 2) = 2000. 10% discount -> 2000 - 200 = 1800
        await waitFor(() => {
            expect(screen.getByText(/\$1[.,]800/)).toBeInTheDocument();
        });
    });
});
