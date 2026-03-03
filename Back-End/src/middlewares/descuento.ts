export function calcularDescuento(monto: number, descuento: number): number {
    return (monto - ((monto * descuento) / 100))
}