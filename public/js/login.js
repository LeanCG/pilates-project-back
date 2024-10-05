// Para validar los detalles del usuaro
function validateUserDetails() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    return username && password; // Verifica que los campos no estén vacíos
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
document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario

    if (validateUserDetails()) {

        const username = document.getElementById('username').value
        const password = document.getElementById('password').value

        try {
            const response = await fetch('/api/auth/login',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({username: username, password: password}),
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Error en las credenciales');
            }

            const data = await response.json()

            window.location.href = '/home'; // Redirigir a la página de inicio

        } catch (error) {
            showAlert('Usuario o contraseña incorrectos')
        }

    }

    else {
        showAlert('Por favor completa todos los campos.');
        return; // Salir si la validación falla
    }

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

window.addEventListener('load', () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));

    // Si el token existe, redirigir al home
    if (token) {
        window.location.href = '/home';
    }
});

history.replaceState(null, null, location.href);

// Detectar cuando el usuario presiona "Atrás" y redirigir al home
window.addEventListener('popstate', function () {
    history.pushState(null, null, location.href); // Esto previene que el usuario vuelva al login
    window.location.href = '/home'; // Redirige al home si intenta usar "Atrás"
});