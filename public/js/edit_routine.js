// edit_routine.js

document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href; // Obtener la URL completa
    const urlParts = url.split('/'); // Dividir la URL en partes usando el '/'
    const routineId = urlParts[urlParts.length - 1]; // Suponiendo que el ID es la última parte de la URL
    const apiUrl = `http://localhost:3000/api/routine/list`;
    const exerciseTableBody = document.getElementById('exercise-table-body');

    // Función para obtener y renderizar la rutina y los ejercicios
    const fetchRoutineAndExercises = async () => {
        try {
            // Obtener la rutina
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la rutina');
            }

            const routines = await response.json();
            console.log("routines:", routines);

            // Buscar la rutina con el ID correspondiente
            const routine = routines.find(r => r.id === parseInt(routineId));

            if (routine) {
                // Mostrar la descripción de la rutina en un input
                document.getElementById('routineName').value = routine.descripcion; // Mostrar la descripción en un input
            } else {
                alert('Rutina no encontrada.');
            }

            // Mostrar la descripción de la rutina en un input
            document.getElementById('routineName').value = routine.descripcion; // Mostrar la descripción en un input

            // Obtener los ejercicios relacionados (puedes modificar este endpoint según tus necesidades)
            const exercises = await fetchExercisesByRoutineId(routineId);
            console.log("Exercises:", exercises)
            renderExercises(exercises);
        } catch (error) {
            console.error(error);
            alert('Hubo un problema al cargar la rutina.');
        }
    };

    // Función para obtener los ejercicios relacionados con la rutina
    const fetchExercisesByRoutineId = async (routineId) => {
        // Asume que tienes un endpoint para obtener ejercicios por ID de rutina
        const response = await fetch(`http://localhost:3000/api/routine/list/${routineId}`);
        if (!response.ok) {
            throw new Error('Error al obtener los ejercicios');
        }
        return await response.json();
    };

    // Función para renderizar los ejercicios en la tabla
    const renderExercises = (exercises) => {
        // Limpiar el contenido anterior
        exerciseTableBody.innerHTML = '';

        // Obtener los nombres de los ejercicios
        fetchExerciseNames().then(exerciseNames => {
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
        });
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
        console.log("exeercises names:",exerciseNames)
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

    // Llamar a la función para obtener y renderizar la rutina y los ejercicios al cargar la página
    fetchRoutineAndExercises();
});
