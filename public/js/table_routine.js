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
                    <a title="Ver detalles" href="#" class="btn btn-light view-routine" data-id="${routine.id}">
                        <img src="/images/info_icon.png" class="icon" alt="Ver detalles">
                    </a>
                    <a title="Editar" href="#" class="btn btn-light edit-routine" data-id="${routine.id}">
                        <img src="/images/edit_icon.png" class="icon" alt="Editar">
                    </a>
                    <a title="Eliminar" href="#" class="btn btn-light delete-routine" data-id="${routine.id}">
                        <img src="/images/delete_icon.png" class="icon" alt="Eliminar">
                    </a>
                </div>
            </td>
        </tr>
    `).join('');

    document.querySelector('#table_routine tbody').innerHTML = rows;


        // Inicializar DataTables después de renderizar las filas
        $('#table_routine').DataTable({
            "language": {
                "lengthMenu": "Mostrar _MENU_ registros por página",
                "zeroRecords": "No se encontraron resultados",
                "info": "Mostrando página _PAGE_ de _PAGES_",
                "infoEmpty": "No hay registros disponibles",
                "infoFiltered": "(filtrado de _MAX_ registros totales)",
                "search": "Buscar:",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }
        });

    // Agregar eventos a los botones una vez que se rendericen las filas
    addEventListeners();
}

// Función para agregar los event listeners a los botones
function addEventListeners() {
    // Botón "Ver detalles"
    document.querySelectorAll('.view-routine').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('data-id');
            viewRoutineDetails(id);
        });
    });

    // Botón "Editar"
    document.querySelectorAll('.edit-routine').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('data-id');
            editRoutine(id);
        });
    });

    // Botón "Eliminar"
    document.querySelectorAll('.delete-routine').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('data-id');
            deleteRoutine(id);
        });
    });
}

// Función para ver los detalles de una rutina
function viewRoutineDetails(id) {
    console.log('Ver detalles de la rutina con ID:', id);
    // Aquí podrías redirigir a otra página o mostrar un modal con detalles
    // window.location.href = `/routine/details/${id}`;
}

// Función para editar una rutina
function editRoutine(id) {
    console.log('Editar la rutina con ID:', id);
    // Redirigir a la página de edición
    window.location.href = `/edit_routine/${id}`;

}

// Función para eliminar una rutina
function deleteRoutine(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta rutina?')) {
        fetch(`/api/routine/delete/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la rutina');
            }
            return response.json();
        })
        .then(data => {
            alert('Rutina eliminada exitosamente');
            fetchRoutinesData();  // Recargar la tabla después de eliminar
        })
        .catch(error => console.error('Error al eliminar la rutina:', error));
    }
}

// Cargar los datos al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    fetchRoutinesData();
});