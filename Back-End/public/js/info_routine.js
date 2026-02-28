document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href;
    const urlParts = url.split('/');
    const routineId = parseInt(urlParts[urlParts.length - 1]); // Convertir a número
    const apiUrl = `http://localhost:3000/api/routine/list/${routineId}`;
    const routinesUrl = "http://localhost:3000/api/routine/list";
    const exerciseTableBody = document.getElementById('exercise-table-body');

    // Función para obtener y renderizar la rutina y los ejercicios
    const fetchRoutineData = async () => {
        try {
            const response = await fetch(routinesUrl);
            if (!response.ok) {
                throw new Error('Error al obtener las rutinas');
            }

            const routines = await response.json();
            console.log("Routines:", routines);

            // Buscar la rutina por ID
            const routine = routines.find(r => r.id === routineId);
            console.log("Routine:", routine);

            if (routine) {
                const routineName = routine.descripcion; // Guardar el nombre de la rutina
                document.getElementById('routine-name').innerText = routineName; // Asignar a la etiqueta
            } else {
                console.error('Rutina no encontrada.');
            }

            const exercisesResponse = await fetch(apiUrl);
            if (!exercisesResponse.ok) {
                throw new Error('Error al obtener los datos de la rutina');
            }

            const exercises = await exercisesResponse.json();
            console.log("Ejercicios:", exercises);

            // Renderizar ejercicios
            renderExercises(exercises);
        } catch (error) {
            console.error(error);
        }
    };

    const renderExercises = async (exercises) => {
        exerciseTableBody.innerHTML = '';

        const exerciseNames = await fetchExerciseNames(); // Obtener nombres de ejercicios

        exercises.forEach((exercise) => {
            const row = document.createElement('tr');

            // Buscar el nombre del ejercicio utilizando el ejercicio_id
            const selectedExercise = exerciseNames.find(e => e.id === exercise.ejercicio_id);

            row.innerHTML = `
                <td>${selectedExercise ? selectedExercise.descripcion : 'Ejercicio no encontrado'}</td>
                <td>${exercise.series}</td>
                <td>${exercise.repeticiones}</td>
            `;
            exerciseTableBody.appendChild(row);
        });
    };

    const fetchExerciseNames = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/exercise/exercise');
            if (!response.ok) {
                throw new Error('Error al obtener los nombres de los ejercicios');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    // Evento para el botón de editar
    document.getElementById('edit-rutine').addEventListener('click', () => {
        window.location.href = `/edit_routine/${routineId}`;
    });

    // Cargar los datos al cargar la página
    fetchRoutineData();
});
