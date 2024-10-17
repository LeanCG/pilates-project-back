function enableEdit(index) {
    document.getElementById(`exercise-${index}`).disabled = false;
    document.getElementById(`series-${index}`).disabled = false;
    document.getElementById(`repeticiones-${index}`).disabled = false;

    document.getElementById(`edit-${index}`).style.display = 'none';
    document.getElementById(`save-${index}`).style.display = 'inline-block';
}

function saveChanges(index) {
    const ejercicio = document.getElementById(`exercise-${index}`).value;
    const series = document.getElementById(`series-${index}`).value;
    const repeticiones = document.getElementById(`repeticiones-${index}`).value;

    // Realizar el envío de datos al backend para guardar los cambios
    fetch(`/api/routine/updateExercise/${index}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ejercicio: ejercicio,
            series: series,
            repeticiones: repeticiones
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cambios guardados con éxito');
            document.getElementById(`exercise-${index}`).disabled = true;
            document.getElementById(`series-${index}`).disabled = true;
            document.getElementById(`repeticiones-${index}`).disabled = true;

            document.getElementById(`edit-${index}`).style.display = 'inline-block';
            document.getElementById(`save-${index}`).style.display = 'none';
        } else {
            alert('Error al guardar los cambios');
        }
    })
    .catch(error => console.error('Error:', error));
}
