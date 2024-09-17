// Funcionalidad para el botón de menú desplegable:
const sidebarToggle = document.getElementById('sidebar-toggle');

sidebarToggle.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
});

// Para mostrar la tabla de usuarios cuando se hace clic en 'Usuarios':
document.getElementById('users').addEventListener('click', function () {
    fetch('/users')
        .then(response => response.text())
        .then(data => {
            document.getElementById('main-content').innerHTML = data;
            // Inicialización de DataTables y sus funcionalidades
            initializeDataTable();
            setupRegisterUserEvent();
        })
        .catch(error => console.log(error));
    
        fetch('/api/users/list')
        .then(response => response.json())
        .then(data => {
            // Renderizar los datos en la tabla
            renderUsersTable(data);
        })
        .catch(error => console.log("Error al obtener los datos de usuarios:", error));
});

// Inicialización de DataTables y sus funcionalidades
function initializeDataTable() {
    let table = new DataTable('#table_users', {
        // Para traducir al español
        "language": {
            "decimal": "",
            "emptyTable": "No hay datos disponibles en la tabla",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered": "(filtrado de _MAX_ entradas totales)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "No se encontraron registros coincidentes",
            "paginate": {
                "first": "<<",
                "last": ">>",
                "next": ">",
                "previous": "<"
            },
            "aria": {
                "sortAscending": ": activar para ordenar la columna de manera ascendente",
                "sortDescending": ": activar para ordenar la columna de manera descendente"
            }
        },
        responsive: true,
        layout: {
            topStart: 'buttons',
            topEnd: 'search',
            bottomStart: 'info',
            bottomEnd: 'paging'
        },
        buttons: [
            {
                extend: 'copy',
                text: '<img src="/images/copy_icon.png" class="icon">',
                titleAttr: 'Copiar al portapapeles',
                className: "btn btn-light"
            },
            {
                extend: 'excel',
                text: '<img src="/images/excel_icon.png" class="icon">',
                titleAttr: 'Exportar a Excel',
                className: "btn btn-light",
                excelStyles: {
                    template: 'header_blue'
                }
            },
            {
                extend: 'pdf',
                text: '<img src="/images/pdf_icon.png" class="icon">',
                titleAttr: 'Exportar a PDF',
                className: "btn btn-light"
            },
            {
                extend: 'print',
                text: '<img src="/images/print_icon.png" class="icon">',
                titleAttr: 'Imprimir',
                className: "btn btn-light"
            },
        ]
    });
}

function renderUsersTable(data) {
    // Genera las filas de la tabla con los datos obtenidos
    let rows = data.map(user => `
        <tr>
            <td>${user.nombre}</td>
            <td>${user.dni}</td>
            <td>${user.direccion}</td>
            <td>${user.tipo_estado}</td>
            <td>${user.tipo_persona}</td>
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

    // console.log(rows)

    // Inserta las filas generadas en el cuerpo de la tabla
    document.querySelector('#table_users tbody').innerHTML = rows;
}