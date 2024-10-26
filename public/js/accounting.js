document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('registerForm').addEventListener('submit', async (e) => {

        e.preventDefault()

        const datos = {
            fecha: document.getElementById('fecha').value,
            dni: document.getElementById('dni').value,
            detalle: document.getElementById('detalle').value,
            tipo_factura: document.getElementById('tipo_factura').value,
            movimiento_caja_id:document.getElementById('movimiento_caja').value,
            nro_factura: document.getElementById('nro_factura').value,
            monto: document.getElementById('monto').value,
            descuento: document.getElementById('descuento').value
        }

        try {
            const response = await fetch('/api/accounting/movement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            if (response.ok) {
                const result = await response.json();
                swal.fire({
                    title: '¡Usuario creado exitosamente!',
                    icon: 'success',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                //alert('Registro exitoso');
                window.location.href = '/facturacion';
                console.log(result);
            } else {
                //alert('Hubo un error en el registro');
                swal.fire({
                    title: '¡Hubo un error en el registro!',
                    icon: 'warning',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }

    })

})