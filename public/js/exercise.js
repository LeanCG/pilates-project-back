document.addEventListener('DOMContentLoaded', function () {
    // Variable para almacenar los ejercicios que se van agregando
    let ejercicios = [];

    // Cargar los ejercicios desde la API
    fetchExercises();

    // Manejar el evento del botón "Agregar ejercicio"
    document.getElementById('addExerciseButton').addEventListener('click', function (event) {
        event.preventDefault(); // Evitar el envío normal del formulario

        // Obtener valores del formulario de ejercicios
        const ejercicioId = document.getElementById('ejercicio').value;
        const ejercicioDescripcion = document.getElementById('ejercicio').selectedOptions[0].text;
        const series = document.getElementById('series').value;
        const repeticiones = document.getElementById('repeticiones').value;

        if (!ejercicioId || !series || !repeticiones) {
            alert("Por favor, complete todos los campos del ejercicio.");
            return;
        }

        // Agregar ejercicio al array de ejercicios
        ejercicios.push({
            ejercicioId,
            series,
            repeticiones,
            orden: ejercicios.length + 1 // Se va asignando el orden basado en la cantidad de ejercicios
        });

        // Crear una nueva fila en la tabla para mostrar el ejercicio agregado
        const row = `<tr>
            <td>${ejercicioDescripcion}</td>
            <td>${series}</td>
            <td>${repeticiones}</td>
        </tr>`;
        document.querySelector('#exerciseTable tbody').insertAdjacentHTML('beforeend', row);

        // Limpiar los campos de ejercicio, series y repeticiones
        document.getElementById('ejercicio').value = '';
        document.getElementById('series').value = '';
        document.getElementById('repeticiones').value = '';
    });

    // Manejar el envío del formulario completo cuando se presione "Guardar"
    document.getElementById('addExerciseForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar el envío normal del formulario

        // Obtener valores del formulario de rutina
        const rutinaDescripcion = document.getElementById('rutina').value;

        if (!rutinaDescripcion || ejercicios.length === 0) {
            alert("Por favor, ingrese la descripción de la rutina y al menos un ejercicio.");
            return;
        }

        // Guardar la rutina y los ejercicios asociados
        fetch('/api/routine/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                descripcion: rutinaDescripcion,
                ejercicios // Enviar todos los ejercicios en un solo request
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('Rutina y ejercicios guardados exitosamente.');
            console.log('Respuesta del servidor:', data);

            // Limpiar el formulario después de guardar
            document.getElementById('rutina').value = '';
            document.querySelector('#exerciseTable tbody').innerHTML = ''; // Limpiar la tabla de ejercicios
            ejercicios = []; // Limpiar el array de ejercicios
        })
        .catch(error => {
            console.error('Error al guardar la rutina y ejercicios:', error);
            alert('Hubo un error al guardar la rutina y los ejercicios.');
        });
    });

    // Función para cargar los ejercicios desde la API
    function fetchExercises() {
        fetch('/api/exercise/exercise')
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById('ejercicio');
                data.forEach(ejercicio => {
                    const option = document.createElement('option');
                    option.value = ejercicio.id; // Asegúrate de que sea el ID del ejercicio
                    option.text = ejercicio.descripcion;
                    select.appendChild(option);
                });
            })
            .catch(error => console.error('Error al cargar ejercicios:', error));
    }
});
