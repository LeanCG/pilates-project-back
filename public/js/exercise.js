document.addEventListener('DOMContentLoaded', function () {
    // Cargar las rutinas y ejercicios desde la API
    fetchRoutines();
    fetchExercises();

    // Manejar el envío del formulario
    document.getElementById('addExerciseForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar el envío normal del formulario

        // Obtener valores del formulario
        const rutinaId = document.getElementById('rutina').value;
        const ejercicioId = document.getElementById('ejercicio').value;
        const series = document.getElementById('series').value;
        const repeticiones = document.getElementById('repeticiones').value;
        const orden = document.getElementById('orden').value;

        // Crear una nueva fila en la tabla
        const row = `<tr>
            <td>${document.getElementById('rutina').selectedOptions[0].text}</td>
            <td>${document.getElementById('ejercicio').selectedOptions[0].text}</td>
            <td>${series}</td>
            <td>${repeticiones}</td>
            <td>${orden}</td>
        </tr>`;
        document.querySelector('#exerciseTable tbody').insertAdjacentHTML('beforeend', row);

        // Limpiar el formulario después de agregar
        document.getElementById('addExerciseForm').reset();
    });
});

// Función para cargar las rutinas desde la API
function fetchRoutines() {
    fetch('/api/rutinas')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('rutina');
            data.forEach(rutina => {
                const option = document.createElement('option');
                option.value = rutina.id;
                option.text = rutina.descripcion;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar rutinas:', error));
}

// Función para cargar los ejercicios desde la API
function fetchExercises() {
    fetch('/api/ejercicios')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('ejercicio');
            data.forEach(ejercicio => {
                const option = document.createElement('option');
                option.value = ejercicio.id;
                option.text = ejercicio.descripcion;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar ejercicios:', error));
}
