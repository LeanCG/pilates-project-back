import axios from "axios";

// Para validar los detalles del usuaro
function validateUserDetails() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    return email && password; // Verifica que los campos no estén vacíos
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
// Evento que intercepta el envío del formulario
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar el envío del formulario

    if (validateUserDetails()) {
        window.location.href = '/home'; // Redirigir a la página de inicio
    }
    else {
        showAlert('Por favor completa todos los campos.');
        return; // Salir si la validación falla
    }

    // Si la validación es exitosa, aquí puedes proceder con el envío del formulario o con el siguiente paso
    console.log('Formulario validado y listo para enviar');
});
// Para mostrar u ocultar la contraseña cuando se presiona el logo del ojito
document.querySelector('.toggle-password').addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    const icon = document.getElementById('togglePasswordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye-slash'); // O 'fa-eye-slash' si usas Font Awesome
        icon.classList.add('bi-eye'); // O 'fa-eye' si usas Font Awesome
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye'); // O 'fa-eye' si usas Font Awesome
        icon.classList.add('bi-eye-slash'); // O 'fa-eye-slash' si usas Font Awesome
    }
});