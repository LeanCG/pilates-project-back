function fetchRoutinesData() {
    fetch('/api/routine/list')
        .then(response => response.json())
        .then(data => {
            renderRoutinesTable(data);
        })
        .catch(error => console.error('Error al obtener los datos de las rutinas:', error));
}

function renderRoutinesTable(data) {
    let rows = data.map(routine => `
        <tr>
            <td>${routine.descripcion}</td>
            <td>
                <div class="btn-group">
                    <a title="Ver detalles" href="#" class="btn btn-light" id="viewRoutineButton">
                        <img src="/images/info_icon.png" class="icon">
                    </a>
                    <a title="Editar" href="#" class="btn btn-light" id="editRoutineButton">
                        <img src="/images/edit_icon.png" class="icon">
                    </a>
                    <a title="Eliminar" href="#" class="btn btn-light" id="deleteRoutineButton">
                        <img src="/images/delete_icon.png" class="icon">
                    </a>
                </div>
            </td>
        </tr>
    `).join('');

    document.querySelector('#table_routine tbody').innerHTML = rows;
}

document.addEventListener('DOMContentLoaded', function () {
    fetchRoutinesData();
});