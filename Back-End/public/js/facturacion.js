// Inicialización de DataTables y sus funcionalidades
let table = new DataTable('#table_invoice', {
    // Traducción al español
    "language": {
        "decimal": "",
        "emptyTable": "No hay datos disponibles en la tabla",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
        "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
        "infoFiltered": "(filtrado de _MAX_ entradas totales)",
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
            className: "btn btn-light"
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
        }
    ],
});

const minEl = document.querySelector('#min');
const maxEl = document.querySelector('#max');


// Función para filtrar facturas por fecha
function filterByDate(facturas) {
    let minDate = minEl.value ? new Date(`${minEl.value}T00:00:00`) : null;
    let maxDate = maxEl.value ? new Date(`${maxEl.value}T23:59:59`) : null;

    return facturas.filter(factura => {
        const facturaDate = new Date(factura.fecha_factura);
        return (
            (!minDate || facturaDate >= minDate) &&
            (!maxDate || facturaDate <= maxDate)
        );
    });
}




// Función para calcular los ingresos y egresos desde la tabla (datos obtenidos del fetch)
async function chartData(facturas) {
    let ingresos = 0;
    let egresos = 0;

    // Iterar sobre los datos y sumar los ingresos y egresos
    facturas.forEach(factura => {
        let monto = parseFloat(factura.precio) || 0;
        if (factura.tipo_factura === 3) { // Ingresos
            ingresos += monto;
        } else if (factura.tipo_factura === 1 || factura.tipo_factura === 2) { // Egresos
            egresos += monto;
        }
    });

    return [
        {
            name: 'Ingresos',
            y: ingresos,
            color: '#28a745' // Verde para ingresos
        },
        {
            name: 'Egresos',
            y: egresos,
            color: '#dc3545' // Rojo para egresos
        }
    ];
}

// Función para inicializar el gráfico con los datos obtenidos
async function initializeChart(facturas) {
    const data = await chartData(facturas); // Calcular datos para el gráfico

    if (data) {
        let contenedor = $('#contenedor');
        Highcharts.chart(contenedor[0], {
            chart: {
                type: 'pie',
                backgroundColor: '#ffffff'
            },
            title: {
                text: 'Ingresos y Egresos'
            },
            series: [
                {
                    name: 'Movimientos',
                    data: data, // Usar los datos calculados
                }
            ],
            tooltip: {
                backgroundColor: '#fff', 
                borderColor: '#000',
                borderRadius: 10,
                style: {
                    color: '#000000',
                    fontSize: '12px'
                },
                useHTML: true,
                headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
                pointFormat: '<span style="color:{point.color}">●</span> <b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)<br/>'
            }
        });
    }
}

// Función para inicializar DataTable y renderizar las facturas en la tabla
async function calculateTotals(facturas) {
    let totalIngresos = 0;
    let totalEgresos = 0;

    // Iterar sobre los datos y sumar los ingresos y egresos
    facturas.forEach(factura => {
        let monto = parseFloat(factura.precio) || 0;
        if (factura.tipo_factura === 3) { // Ingresos
            totalIngresos += monto;
        } else if (factura.tipo_factura === 1 || factura.tipo_factura === 2) { // Egresos
            totalEgresos += monto;
        }
    });

    // Actualizar el footer con los totales
    document.getElementById('total_ingresos').innerText = totalIngresos.toFixed(2);
    document.getElementById('total_egresos').innerText = totalEgresos.toFixed(2);

    // Calcular el balance
    const balance = totalIngresos - totalEgresos;
    document.getElementById('balance_total').innerText = balance.toFixed(2);
}


async function updateTable(filteredData) {
    table.clear();

    filteredData.forEach(factura => {
        const tipo = factura.tipo_factura;
        const icon = tipo === 3 
            ? '<img src="/images/flecha_arriba.png" class="icon">'  // Ingresos
            : '<img src="/images/flecha_abajo.png" class="icon">';  // Egresos

        let formattedDate = new Date(factura.fecha_factura).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        table.row.add([
            factura.detalle,               // Columna Descripción
            formattedDate,                 // Columna Fecha
            tipo === 3 ? factura.precio : '',  // Ingreso (tipo 3)
            tipo !== 3 ? factura.precio : '',  // Egreso (tipo 1 o 2)
            icon                               // Icono
        ]);
    });

    table.draw();
}

// Función para inicializar DataTable y renderizar las facturas en la tabla
// async function initializeTable(facturas) {
//     if (facturas.length > 0) {
//         // Limpiar cualquier dato previo en la tabla
//         table.clear();

//         const filteredData = filterByDate(facturas); // Filtrar facturas por fecha
//         console.log(filteredData)
//         // Agregar nuevas filas con los datos obtenidos
//         facturas.forEach(factura => {
//             console.log(factura.fecha_factura)
//             const tipo = factura.tipo_factura;

//             // Determinar qué icono mostrar basado en el tipo de factura
//             const icon = tipo === 3 
//                 ? '<img src="/images/flecha_arriba.png" class="icon">'  // Ingresos
//                 : '<img src="/images/flecha_abajo.png" class="icon">';  // Egresos

//             // Agregar la fila con los datos de la factura

//             let formattedDate = new Date(factura.fecha_factura).toLocaleDateString('es-ES', {
//                 day: '2-digit',
//                 month: '2-digit',
//                 year: 'numeric'
//             });

//             table.row.add([
//                 factura.detalle,               // Columna Descripción
//                 formattedDate,                     // Columna Fecha
//                 tipo === 3 ? factura.precio : '',  // Ingreso (tipo 3)
//                 tipo !== 3 ? factura.precio : '',  // Egreso (tipo 1 o 2)
//                 icon                               // Icono
//             ]);
//         });

//         // Dibujar la tabla con los datos nuevos
//         table.draw();

//         // Calcular los totales y actualizar el footer
//         calculateTotals(filteredData); // Calcular totales con datos filtrados
//         initializeChart(filteredData); // Actualizar gráfico con datos filtrados

//          // Recalcular en cada cambio de input
//         minEl.addEventListener('input', () => {
//             const filteredData = filterByDate(facturas);
//             calculateTotals(filteredData);
//             initializeChart(filteredData);
//             table.draw();
//         });

//         maxEl.addEventListener('input', () => {
//             const filteredData = filterByDate(facturas);
//             calculateTotals(filteredData);
//             initializeChart(filteredData);
//             table.draw();
//         });

//     }
// }

// Función para cargar datos y actualizar tabla, gráfico y totales
function refreshData(facturas) {
    const filteredData = filterByDate(facturas); // Filtrar facturas por fecha
    console.log("Fechas",filteredData);
    
    updateTable(filteredData);                  // Actualizar tabla
    calculateTotals(filteredData);              // Calcular totales
    initializeChart(filteredData);              // Actualizar gráfico
}

// Función principal que carga tanto la tabla como el gráfico
async function loadData() {
    try {
        const response = await fetch('/api/accounting/balance'); // Endpoint para obtener datos
        const facturas = await response.json(); // Datos obtenidos de la consulta SQL

        // Inicializar DataTable con los datos
        //initializeTable(facturas);

        // Inicializar gráfico con los mismos datos
        //initializeChart(facturas);
        // Inicializar tabla, totales y gráfico con los datos filtrados por fecha
        refreshData(facturas);

        // Recalcular en cada cambio de input
        minEl.addEventListener('input', () => refreshData(facturas));
        maxEl.addEventListener('input', () => refreshData(facturas));


    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Llamada a la función principal para cargar los datos
loadData();
