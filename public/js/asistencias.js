async function obtenerTurnos() {
    try {
        // Hacemos la petición a la API para obtener los turnos
        const response = await fetch('/api/dashboard');

        // Verificamos si la respuesta es exitosa (código 200)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Convertimos la respuesta a JSON
        const turnos = await response.json();

        // Seleccionamos las secciones para insertar el contenido dinámico
        const mananaContent = document.querySelector('#Mañana');
        const tardeContent = document.querySelector('#tarde');
        const nocheContent = document.querySelector('#noche');

        // Inicializamos contadores para la suma de usuarios
        let totalManana = 0;
        let totalTarde = 0;
        let totalNoche = 0;

        // Limpiamos el contenido previo de las secciones
        mananaContent.innerHTML = '';
        tardeContent.innerHTML = '';
        nocheContent.innerHTML = '';

        // Definimos el máximo de usuarios
        const maxUsuarios = 6;

        turnos.forEach(turno => {
            // Calculamos cuántos lugares quedan disponibles
            const disponibles = maxUsuarios - turno.cantidad;

            // Generamos el HTML dinámico para cada turno
            const turnoHTML = `
                <p class="mbr-text mb-3 display-8">${turno.turno}: ${turno.cantidad}/6 usuarios, <b>disponible: ${disponibles}</b></p>
            `;

            // Clasificamos los turnos en sus respectivas secciones
            const hora = parseInt(turno.turno.split(':')[0]); // Convertimos la hora a número para comparar

            if (hora >= 8 && hora <= 12) {
                // Insertamos en la sección Mañana
                mananaContent.innerHTML += turnoHTML;
                totalManana += turno.cantidad; // Sumamos la cantidad de usuarios
            } else if (hora >= 16 && hora < 20) {
                // Insertamos en la sección Tarde
                tardeContent.innerHTML += turnoHTML;
                totalTarde += turno.cantidad; // Sumamos la cantidad de usuarios
            } else if (hora >= 20 && hora <= 23) {
                // Insertamos en la sección Noche
                nocheContent.innerHTML += turnoHTML;
                totalNoche += turno.cantidad; // Sumamos la cantidad de usuarios
            }
        });

        // Actualizamos el texto de la sección Mañana
        const mananaTexto = totalManana < maxUsuarios ? "Mañana: Disponible" : "Mañana: Lleno";
        mananaContent.insertAdjacentHTML('afterbegin', `
            <div class="title mt-0 mb-2 display-5 ">
                <span class="num display-1">${totalManana}</span>
            </div>
            <h4 class="subtitle display-5">
                <span>${mananaTexto}</span>
            </h4>

        `);

        // Actualizamos el texto de la sección Tarde
        const tardeTexto = totalTarde < maxUsuarios ? "Tarde: Disponible" : "Tarde: Lleno";
        tardeContent.insertAdjacentHTML('afterbegin', `
            <div class="title mb-2 mb-md-3">
                <span class="num display-1">${totalTarde}</span>
            </div>
            <h4 class="subtitle display-5">
                <span>${tardeTexto}</span>
            </h4>

        `);

        // Actualizamos el texto de la sección Noche
        const nocheTexto = totalNoche < maxUsuarios ? "Noche: Disponible" : "Noche: Lleno";
        nocheContent.insertAdjacentHTML('afterbegin', `
            <div class="title mb-2 mb-md-3">
                <span class="num display-1">${totalNoche}</span>
            </div>
            <h4 class="subtitle display-5">
                <span>${nocheTexto}</span>
            </h4>

        `);

    } catch (error) {
        console.error('Error al obtener los turnos:', error);
    }
}

// Llama a la función para obtener los turnos
obtenerTurnos();
