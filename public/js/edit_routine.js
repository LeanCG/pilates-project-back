// edit_routine.js

document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href;
    const urlParts = url.split('/');
    const routineId = urlParts[urlParts.length - 1];
    const apiUrl = `http://localhost:3000/api/routine/list`;
    const exerciseTableBody = document.getElementById('exercise-table-body');

    // Función para obtener y renderizar la rutina y los ejercicios
    const fetchRoutineAndExercises = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Error al obtener los datos de la rutina');
            }

            const routines = await response.json();
            console.log("routines:", routines);

            const routine = routines.find(r => r.id === parseInt(routineId));

            if (routine) {
                document.getElementById('routineName').value = routine.descripcion;
            } else {
                alert('Rutina no encontrada.');
            }

            const exercises = await fetchExercisesByRoutineId(routineId);
            console.log("Exercises:", exercises)
            renderExercises(exercises);
        } catch (error) {
            console.error(error);
            alert('Hubo un problema al cargar la rutina.');
        }
    };

    const fetchExercisesByRoutineId = async (routineId) => {
        const response = await fetch(`http://localhost:3000/api/routine/list/${routineId}`);
        if (!response.ok) {
            throw new Error('Error al obtener los ejercicios');
        }
        return await response.json();
    };

    const renderExercises = (exercises) => {
        exerciseTableBody.innerHTML = '';

        fetchExerciseNames().then(exerciseNames => {
            exercises.forEach((exercise, index) => {
                const row = document.createElement('tr');
                row.dataset.ejercicioId = exercise.id;
                const exerciseSelect = createExerciseSelect(exercise.ejercicio_id, exerciseNames, index);

                row.innerHTML = `
                    <td>${exerciseSelect.outerHTML}</td>
                    <td><input id="series-${index}" type="number" class="form-control" value="${exercise.series}" min="1"></td>
                    <td><input id="repeticiones-${index}" type="number" class="form-control" value="${exercise.repeticiones}" min="1"></td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteExercise(${exercise.id})">Eliminar</button>
                    </td>
                `;
                exerciseTableBody.appendChild(row);
            });
        });
    };

    const fetchExerciseNames = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/exercise/exercise');
            if (!response.ok) {
                throw new Error('Error al obtener los ejercicios');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const createExerciseSelect = (selectedExerciseId, exerciseNames, index) => {
        const select = document.createElement('select');
        select.classList.add('form-select');
        select.id = `ejercicio-${index}`; // Asignar un ID único

        const selectedExercise = exerciseNames.find(exercise => exercise.id === selectedExerciseId);

        if (selectedExercise) {
            const option = document.createElement('option');
            option.value = selectedExercise.id;
            option.textContent = selectedExercise.descripcion;
            option.selected = true;
            select.appendChild(option);
        }

        exerciseNames.forEach(exercise => {
            if (exercise.id !== selectedExerciseId) {
                const option = document.createElement('option');
                option.value = exercise.id;
                option.textContent = exercise.descripcion;
                select.appendChild(option);
            }
        });

        return select;
    };

    window.deleteExercise = async (exerciseId) => {
        console.log(`Eliminar ejercicio con ID: ${exerciseId}`);
    };

    const saveRoutine = async () => {
        const descripcion = document.getElementById('routineName').value;
        const ejercicios = [];

        const rows = exerciseTableBody.querySelectorAll('tr');
        console.log("rows:", rows);

        rows.forEach((row, index) => {
            const select = document.getElementById(`ejercicio-${index}`);
            const seriesInput = document.getElementById(`series-${index}`);
            const repeticionesInput = document.getElementById(`repeticiones-${index}`);

            if (select && seriesInput && repeticionesInput) {
                const ejercicio = {
                    id: parseInt(row.dataset.ejercicioId), // ID de rutina_ejercicio
                    ejercicio_id: parseInt(select.value), // ID del ejercicio
                    series: parseInt(seriesInput.value),
                    repeticiones: parseInt(repeticionesInput.value)
                };
                ejercicios.push(ejercicio);
            } else {
                console.error("Elementos no encontrados en la fila", row);
            }
        });

        try {
            const response = await fetch(`http://localhost:3000/api/routine/update/${routineId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ descripcion, ejercicios })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la rutina');
            }

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error(error);
            alert('Hubo un problema al guardar la rutina.');
        }
    };

    document.getElementById('save-routine').addEventListener('click', saveRoutine);

    fetchRoutineAndExercises();
});
