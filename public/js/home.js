//Funciones principales de la página home.html:
document.getElementById('toggle-menu').addEventListener('click', function () {
    var sidebar = document.getElementById('sidebar');
    var mainContent = document.getElementById('main-content');
    var toggleButton = document.getElementById('toggle-menu');

    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('collapsed');

    // Ajustar la posición del botón según el estado del sidebar
    if (sidebar.classList.contains('collapsed')) {
        toggleButton.style.left = '70px';
    } else {
        toggleButton.style.left = '280px';
    }
});

//Sección para mostrar el bs-stepper del registro de usuarios:
document.getElementById('register-user').addEventListener('click', function () {
    fetch('register.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('main-content').innerHTML = data;
            initializeStepper(); // Inicializa el stepper después de cargar el contenido
        })
        .catch(error => console.log(error));
});

function initializeStepper() {
    // Inicialización del stepper
    const stepper = new Stepper(document.querySelector('#stepper'));

    // Función para actualizar el contenido activo
    function updateActiveContent(step) {
        document.querySelectorAll('.content').forEach((content, index) => {
            content.classList.remove('active');
            if (index === step) content.classList.add('active');
        });
    }

    // Función para mostrar alertas
    function showAlert(id, message, type = 'warning') {
        const alert = document.getElementById(id);
        alert.classList.remove('d-none', 'alert-warning', 'alert-success', 'alert-danger');
        alert.classList.add(`alert-${type}`);
        alert.textContent = message;
    }

    // Función para ocultar todas las alertas
    function hideAllAlerts() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => alert.classList.add('d-none'));
    }


    // Manejo de eventos para los botones de navegación
    document.getElementById('next-1').addEventListener('click', () => {
        // Verifica que los datos de la primera sección sean válidos
        if (validatePersonalDetails()) {
            hideAllAlerts(); // Oculta cualquier alerta activa
            stepper.next(); // Siguiente sección
            updateActiveContent(1); // Muestra la segunda sección
        } else {
            showAlert('alert-1', 'Por favor, completa todos los campos requeridos.', 'warning');
        }
    });

    document.getElementById('prev-2').addEventListener('click', () => {
        stepper.previous(); // Sección anterior
        updateActiveContent(0); // Muestra la primera sección
    });

    document.getElementById('next-2').addEventListener('click', () => {
        // Verifica que los datos de la segunda sección sean válidos
        if (validateUserDetails()) {
            hideAllAlerts(); // Oculta cualquier alerta activa
            stepper.next(); // Siguiente sección
            updateActiveContent(2); // Muestra la tercera sección
        } else {
            showAlert('alert-2', 'Por favor, completa todos los campos requeridos.', 'warning');
        }
    });

    document.getElementById('prev-3').addEventListener('click', () => {
        stepper.previous(); // Sección anterior
        updateActiveContent(1); // Muestra la segunda sección
    });


    document.getElementById('finish').addEventListener('click', () => {
        if (validateAppointmentDetails()) {
            hideAllAlerts();
            showAlert('alert-success', '¡Registro exitoso!', 'success');
        } else {
            showAlert('alert-3', 'Por favor, completa todos los campos requeridos.', 'warning');
            showAlert('alert-danger', '¡Error al completar el registro!', 'danger');
        }
    });

    // Control de selección de días y horarios basado en la concurrencia
    let selectedDays = [];
    const maxDays = {
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5
    };

    document.getElementById('concurrence').addEventListener('change', (event) => {
        const concurrence = event.target.value;
        selectedDays = [];
        document.getElementById('day').disabled = false;
        document.getElementById('time').disabled = false;
    });

    document.getElementById('day').addEventListener('change', (event) => {
        const selectedDay = event.target.value;

        if (!selectedDays.includes(selectedDay) && selectedDays.length < maxDays[document.getElementById('concurrence').value]) {
            selectedDays.push(selectedDay);
        } else if (selectedDays.includes(selectedDay)) {
            showAlert('day-alert', '¡Ya has seleccionado este día!', 'warning');
        } else {
            showAlert('day-alert', 'Has alcanzado el máximo de días seleccionados.', 'danger');
        }

        // Verifica si falta seleccionar días
        const requiredDays = maxDays[document.getElementById('concurrence').value];
        if (selectedDays.length < requiredDays) {
            showAlert('day-alert', `Por favor, selecciona ${requiredDays - selectedDays.length} día(s) más.`, 'warning');
        } else {
            hideAlert('day-alert'); // Oculta la alerta si se han seleccionado suficientes días
        }

        if (selectedDays.length >= maxDays[document.getElementById('concurrence').value]) {
            document.getElementById('day').disabled = true;
        }
    });


    // Funciones de validación:
    function validatePersonalDetails() {
        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;

        return name && surname && address && phone; // Verifica que los campos no estén vacíos
    }

    function validateUserDetails() {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        return username && email && password; // Verifica que los campos no estén vacíos
    }

    function validateAppointmentDetails() {
        return selectedDays.length > 0 && document.getElementById('time').value;
    }

    document.getElementById('time').addEventListener('change', (event) => {
        const selectedTime = event.target.value;
        // Lógica para verificar la hora seleccionada
    });

    // Inicializa el contenido activo para la primera sección
    updateActiveContent(0);
}