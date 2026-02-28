document.addEventListener('DOMContentLoaded', function () {
    
    // Funcionalidad del botón de menú desplegable
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });

    // Cargar tabla de usuarios al hacer clic en 'Usuarios'
    document.getElementById('users').addEventListener('click', function () {
        fetch('/users')
            .then(response => response.text())
            .then(data => {
                document.getElementById('main-content').innerHTML = data;

                // Fetch de datos de la tabla
                fetch('/api/users/list')
                    .then(response => response.json())
                    .then(data => {
                        let rows = data.map(user => `
                            <tr>
                                <td>${user.nombre}</td>
                                <td>${user.dni}</td>
                                <td>${user.direccion}</td>
                                <td>${user.tipo_estado}</td>
                                <td>${user.tipo_persona}</td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-light viewUserButton" data-id="${user.id}">
                                            <img src="/images/info_icon.png" class="icon">
                                        </button>
                                        <button class="btn btn-light editUserButton" data-id="${user.id}">
                                            <img src="/images/edit_icon.png" class="icon">
                                        </button>
                                        <button class="btn btn-light deleteUserButton" data-nombre="${user.nombre}" data-id="${user.id}">
                                            <img src="/images/delete_icon.png" class="icon">
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('');

                        document.querySelector('#table_users tbody').innerHTML = rows;

        // Inicializar DataTables después de renderizar las filas
        $('#table_users').DataTable({
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

                        // Agregar eventos a botones después de renderizar la tabla
                        document.querySelectorAll('.viewUserButton').forEach(button => {
                            button.addEventListener('click', function () {
                                console.log('hola')
                                console.log(this.getAttribute('data-id'))
                                window.location.href = `/infoUser/${this.getAttribute('data-id')}`;
                            });
                        });

                        document.querySelectorAll('.deleteUserButton').forEach(button => {
                            button.addEventListener('click', async function () {
                                console.log('click')
                                const userName = this.getAttribute('data-nombre');
                                const { value: borrar } = await Swal.fire({
                                    title: `¿Eliminar a ${userName}?`,
                                    icon: 'warning',
                                    confirmButtonText: 'Borrar',
                                    showCancelButton: true,
                                    cancelButtonText: 'Cancelar'
                                });
                                if (borrar) {
                                    swal.fire('Usuario eliminado', '', 'success');
                                    // Aquí puedes agregar la lógica para eliminar el usuario
                                }
                            });
                        });
                    })
                    .catch(error => console.log("Error al obtener los datos de usuarios:", error));
            })
            .catch(error => console.log("Error al cargar la tabla de usuarios:", error));
    });

    // Cerrar sesión
    document.getElementById('logout-btn').addEventListener('click', (event) => {
        event.preventDefault();
        fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/';
            } else {
                console.error('Error al cerrar sesión');
            }
        })
        .catch(error => console.error('Error:', error));
    });

});
