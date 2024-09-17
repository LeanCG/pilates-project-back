
function fetchUsersData() {
    fetch('/api/users/list')
        .then(response => response.json()) // Aquí obtienes el JSON de la respuesta
        .then(data => {
            renderUsersTable(data); // Renderiza la tabla con los datos
        })
        .catch(error => console.error('Error al obtener los datos de usuarios:', error));
}

function renderUsersTable(data) {
    // Genera las filas de la tabla con los datos obtenidos
    let rows = data.map(user => `
        <tr>
            <td>${user.nombre}</td>
            <td>${user.dni}</td>
            <td>${user.direccion}</td>
            <td>${user.telefono}</td>
            <td>${user.estado}</td>
            <td>
                <div class="btn-group">
                    <a title="Ver detalles" href="#" class="btn btn-light" id="viewUserButton">
                        <img src="/images/info_icon.png" class="icon">
                    </a>
                    <a title="Editar" href="#" class="btn btn-light" id="editUserButton">
                        <img src="/images/edit_icon.png" class="icon">
                    </a>
                    <a title="Eliminar" href="#" class="btn btn-light" id="deleteUserButton">
                        <img src="/images/delete_icon.png" class="icon">
                    </a>
                </div>
            </td>
        </tr>
    `).join('');

    console.log(rows)

    // Inserta las filas generadas en el cuerpo de la tabla
    document.querySelector('#table_users tbody').innerHTML = rows;
}

document.addEventListener('DOMContentLoaded', function () {
    fetchUsersData();
});