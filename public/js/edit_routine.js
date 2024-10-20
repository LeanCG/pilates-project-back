// edit_routine.js

document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href; // Obtener la URL completa
    const urlParts = url.split('/'); // Dividir la URL en partes usando el '/'
    const routineId = urlParts[urlParts.length - 1]; // Suponiendo que el ID es la última parte de la URL
    const apiUrl = `http://localhost:3000/api/routine/list/${routineId}`;
    const exerciseTableBody = document.getElementById('exercise-table-body');

    // Función para obtener y renderizar los ejercicios
    const fetchExercises = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            const exercises = await response.json();

            // Limpiar el contenido anterior
            exerciseTableBody.innerHTML = '';

            // Obtener los nombres de los ejercicios
            const exerciseNames = await fetchExerciseNames();

            // Renderizar los ejercicios en la tabla
            exercises.forEach(exercise => {
                const row = document.createElement('tr');

                const exerciseSelect = createExerciseSelect(exercise.ejercicio_id, exerciseNames);

                row.innerHTML = `
                    <td>${exerciseSelect.outerHTML}</td>
                    <td><input type="number" class="form-control" value="${exercise.series}" min="1"></td>
                    <td><input type="number" class="form-control" value="${exercise.repeticiones}" min="1"></td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteExercise(${exercise.id})">Eliminar</button>
                    </td>
                `;
                exerciseTableBody.appendChild(row);
            });
        } catch (error) {
            console.error(error);
            alert('Hubo un problema al cargar los ejercicios.');
        }
    };

    // Función para obtener los nombres de los ejercicios desde la API
    const fetchExerciseNames = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/exercise/exercise');
            if (!response.ok) {
                throw new Error('Error al obtener los ejercicios');
            }
            return await response.json(); // Devuelve la lista de ejercicios
        } catch (error) {
            console.error(error);
            return []; // Devuelve un array vacío en caso de error
        }
    };

    // Función para crear un select con los nombres de los ejercicios
    const createExerciseSelect = (selectedExerciseId, exerciseNames) => {
        const select = document.createElement('select');
        select.classList.add('form-select');

        exerciseNames.forEach(exercise => {
            const option = document.createElement('option');
            option.value = exercise.id; // El ID es el value del select
            option.textContent = exercise.descripcion; // La descripción es el texto del option

            // Si el ID del ejercicio coincide con el seleccionado, marcarlo como seleccionado
            if (exercise.id === selectedExerciseId) {
                option.selected = true;
            }

            select.appendChild(option);
        });

        return select; // Devuelve el elemento select
    };

    // Función para eliminar un ejercicio (implementar según tus necesidades)
    window.deleteExercise = async (exerciseId) => {
        // Aquí puedes agregar la lógica para eliminar un ejercicio
        console.log(`Eliminar ejercicio con ID: ${exerciseId}`);
    };

    // Llamar a la función para obtener y renderizar los ejercicios al cargar la página
    fetchExercises();
});