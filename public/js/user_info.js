document.addEventListener('DOMContentLoaded', function () {
    const userId = window.location.pathname.split('/').pop();

    // const urlParams = new URLSearchParams(window.location.search);
    // const userId = urlParams.get('id');

    fetch(`/api/users/infoUser/${userId}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const user = data[0]; // Suponiendo que solo habrá un usuario con este ID

          // Colocar el nombre completo del usuario como título
          document.getElementById('userName').textContent = `${user.nombre} ${user.apellido}`;

          // Insertar los demás datos en la tabla
          document.getElementById('nombre').textContent = user.nombre;
          document.getElementById('apellido').textContent = user.apellido;
          document.getElementById('dni').textContent = user.dni;
          document.getElementById('cuil').textContent = user.cuil;
          document.getElementById('direccion').textContent = user.direccion;
          document.getElementById('municipio').textContent = user.municipio;
          document.getElementById('departamento').textContent = user.departamento;
          document.getElementById('provincia').textContent = user.provincia;
          document.getElementById('pais').textContent = user.pais;
          document.getElementById('tipoPersona').textContent = user.tipo_persona;
          document.getElementById('username').textContent = user.username;
          document.getElementById('createdAt').textContent = new Date(user.created_at).toLocaleDateString();
          document.getElementById('updatedAt').textContent = new Date(user.updated_at).toLocaleDateString();
          document.getElementById('rol').textContent = user.rol;
          document.getElementById('estado').textContent = user.tipo_estado;
        } else {
          console.error('No se encontraron datos del usuario.');
        }
      })
      .catch(error => {
        console.error('Error al obtener los datos del usuario:', error);
      });
  });