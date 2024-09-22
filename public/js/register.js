document.addEventListener('DOMContentLoaded', function () {
    const stepper = new Stepper(document.querySelector('#stepper'));
    // Función para actualizar el contenido activo
    function updateActiveContent(step) {
        document.querySelectorAll('.content').forEach((content, index) => {
            content.classList.remove('active');
            if (index === step) content.classList.add('active');
        });
    }

    // Se muestran las alertas si ingresó mal o faltó datos
    function showAlert(message, type = 'danger') {
        const alertContainer = document.getElementById('alert-container');
        alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
        </div>
    `;

        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 3000);
    }

    // Manejo de eventos para los botones de navegación
    document.getElementById('next-1').addEventListener('click', () => {
        // Verifica que los datos de la primera sección sean válidos
        if (validatePersonalDetails()) {
            stepper.next(); // Siguiente sección
            updateActiveContent(1); // Muestra la segunda sección
        } else {
            showAlert('Por favor, completa todos los campos requeridos.');
        }
    });

    document.getElementById('prev-2').addEventListener('click', () => {
        stepper.previous(); // Sección anterior
        updateActiveContent(0); // Muestra la primera sección
    });

    document.getElementById('next-2').addEventListener('click', () => {
        // Verifica que los datos de la segunda sección sean válidos
        if (validateUserDetails()) {
            stepper.next(); // Siguiente sección
            updateActiveContent(2); // Muestra la tercera sección
        } else {
            showAlert('Por favor, completa todos los campos requeridos.');
        }
    });

    document.getElementById('prev-3').addEventListener('click', () => {
        stepper.previous(); // Sección anterior
        updateActiveContent(1); // Muestra la segunda sección
    });


    document.getElementById('finish').addEventListener('click', () => {
        if (validateAppointmentDetails()) {
            showAlert('¡Registro exitoso!');
        } else {
            showAlert('Por favor, completa todos los campos requeridos.');
        }
    });

    // Funciones de validación:
    function validatePersonalDetails() {
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const dni = document.getElementById('dni').value;
        const cuil = document.getElementById('cuil').value;
        const direccion = document.getElementById('descripcion').value;
        const municipio_id = document.getElementById('municipio_id').value;
        const tipo_persona_id = document.getElementById('tipo_persona_id').value;

        return nombre && apellido && dni && cuil && direccion && municipio_id && tipo_persona_id; // Verifica que los campos no estén vacíos
    }

    function validateUserDetails() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const created_at = document.getElementById('created_at').value;
        const updated_at = document.getElementById('updated_at').value;
        const rol_id = document.getElementById('rol_id').value;
        const tipo_estado_id = document.getElementById('tipo_estado_id').value;

        return username && password && created_at && updated_at && rol_id && tipo_estado_id; // Verifica que los campos no estén vacíos
    }

    function validateAppointmentDetails() {
        const fecha_turno = document.getElementById('fecha_turno').value;
        const hora = document.getElementById('hora').value;
        const tipo_pilates_id = document.getElementById('tipo_pilates_id').value;
        const dias_turno_id = document.getElementById('dias_turno_id').value;
        const numero_factura = document.getElementById('numero_factura').value;
        const sub_total = document.getElementById('sub_total').value;
        const descuento = document.getElementById('descuento').value;
        const cantidad = document.getElementById('cantidad').value;
        const precio = document.getElementById('precio').value;

        return fecha_turno && hora && tipo_pilates_id && dias_turno_id && numero_factura && sub_total && descuento && cantidad && precio;
    }

    // Inicializa el contenido activo para la primera sección
    updateActiveContent(0);

    document.getElementById('registerForm').addEventListener('submit', async (e) =>{
        e.preventDefault()

        const data = {
            nombre : document.getElementById('nombre').value,
            apellido : document.getElementById('apellido').value,
            dni : document.getElementById('dni').value,
            cuil : document.getElementById('cuil').value,
            direccion : document.getElementById('descripcion').value,
            municipio_id : document.getElementById('municipio_id').value,
            tipo_persona_id : document.getElementById('tipo_persona_id').value,
            username : document.getElementById('username').value,
            password : document.getElementById('password').value,
            created_at : document.getElementById('created_at').value,
            updated_at : document.getElementById('updated_at').value,
            rol_id : document.getElementById('rol_id').value,
            tipo_estado_id : document.getElementById('tipo_estado_id').value,
            fecha_turno : document.getElementById('fecha_turno').value,
            hora : document.getElementById('hora').value,
            tipo_pilates_id : document.getElementById('tipo_pilates_id').value,
            dias_turno_id : document.getElementById('dias_turno_id').value,
            numero_factura : document.getElementById('numero_factura').value,
            sub_total : document.getElementById('sub_total').value,
            descuento : document.getElementById('descuento').value,
            cantidad : document.getElementById('cantidad').value,
            precio : document.getElementById('precio').value
        }


        try {
            const response = await fetch('/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                const result = await response.json();
                alert('Registro exitoso');
                console.log(result);
            } else {
                alert('Hubo un error en el registro');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }



    })
});