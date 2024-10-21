document.addEventListener('DOMContentLoaded', function () {
  const userId = window.location.pathname.split('/').pop();

  fetch(`/api/users/infoUser/${userId}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const user = data[0];

        document.getElementById('userName').textContent = `${user.nombre} ${user.apellido}`;

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

        document.getElementById('editarInfoUser').addEventListener('click', () => {

          document.getElementById('nombre').innerHTML = `<input type="text" value="${user.nombre}" id="nombreInput">`;
          document.getElementById('apellido').innerHTML = `<input type="text" value="${user.apellido}" id="apellidoInput">`;
          document.getElementById('dni').innerHTML = `<input type="text" value="${user.dni}" id="dniInput">`;
          document.getElementById('cuil').innerHTML = `<input type="text" value="${user.cuil}" id="cuilInput">`;
          document.getElementById('direccion').innerHTML = `<input type="text" value="${user.direccion}" id="direccionInput">`;
          document.getElementById('municipio').innerHTML = `<input type="text" value="${user.municipio}" id="municipioInput">`;
          document.getElementById('departamento').innerHTML = `<input type="text" value="${user.departamento}" id="departamentoInput">`;
          document.getElementById('provincia').innerHTML = `<input type="text" value="${user.provincia}" id="provinciaInput">`;
          document.getElementById('pais').innerHTML = `<input type="text" value="${user.pais}" id="paisInput">`;
          document.getElementById('tipoPersona').innerHTML = `<input type="text" value="${user.tipo_persona}" id="tipoPersonaInput">`;
          document.getElementById('username').innerHTML = `<input type="text" value="${user.username}" id="usernameInput">`;

          document.getElementById('guardarCambios').style.display = 'block';
        });

        document.getElementById('guardarCambios').addEventListener('click', () => {
          const updatedUser = {
            nombre: document.getElementById('nombreInput').value,
            apellido: document.getElementById('apellidoInput').value,
            dni: document.getElementById('dniInput').value,
            cuil: document.getElementById('cuilInput').value,
            direccion: document.getElementById('direccionInput').value,
            municipio: document.getElementById('municipioInput').value,
            departamento: document.getElementById('departamentoInput').value,
            provincia: document.getElementById('provinciaInput').value,
            pais: document.getElementById('paisInput').value,
            tipo_persona: document.getElementById('tipoPersonaInput').value,
            username: document.getElementById('usernameInput').value
          };

          fetch(`/api/users/editUser/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
          })
          .then(response => response.json())
          .then(result => {
            alert('Usuario actualizado correctamente');
            // Aquí podrías redirigir a la página inicial o mostrar algún mensaje de confirmación
          })
          .catch(error => console.error('Error al actualizar los datos:', error));
        });
      } else {
        console.error('No se encontraron datos del usuario.');
      }
    })
    .catch(error => {
      console.error('Error al obtener los datos del usuario:', error);
    });
});
