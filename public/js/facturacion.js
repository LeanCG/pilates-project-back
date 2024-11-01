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
        if (factura.movimiento_caja_id === 1) { // Ingresos
            ingresos += monto;
        } else if (factura.movimiento_caja_id !=1) { // Egresos
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
async function calculateTotals(facturas, previousBalance) {
    let totalIngresos = 0;
    let totalEgresos = 0;
    const previousbalance = previousBalance;
    console.log("previus balance:", previousBalance)
    // Iterar sobre los datos y sumar los ingresos y egresos
    facturas.forEach(factura => {
        let monto = parseFloat(factura.precio) || 0;
        if (factura.movimiento_caja_id === 1) { // Ingresos
            totalIngresos += monto;
        } else if (factura.movimiento_caja_id != 1) { // Egresos
            totalEgresos += monto;
        }
    });

    if(previousBalance >= 0){
        totalIngresos = totalIngresos+previousbalance;
    }else {
        totalEgresos = previousbalance + previousbalance;
    }


    // Actualizar el footer con los totales
    document.getElementById('total_ingresos').innerText = totalIngresos.toFixed(2);
    document.getElementById('total_egresos').innerText = totalEgresos.toFixed(2);
    const balance = totalIngresos - totalEgresos;

    console.log(balance)
    document.getElementById('balance_total').innerText = balance.toFixed(2);
}


async function updateTable(filteredData, previousBalance) {
    table.clear();

    // Agregar fila de balance anterior
    const balanceType = previousBalance >= 0 ? 'Positivo' : 'Negativo';
    const balanceRow = [
        'Debito anterior', // Descripción
        '', // Fecha
        previousBalance >= 0 ? previousBalance.toFixed(2) : '', // Ingreso
        previousBalance < 0 ? Math.abs(previousBalance).toFixed(2) : '', // Egreso
        '', // Icono
        '' // ID (puedes dejarlo vacío)
    ];
    
    table.row.add(balanceRow); // Agregar fila del balance


    filteredData.forEach(factura => {
        const tipo = factura.movimiento_caja_id;
        const icon = tipo === 1
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
            tipo === 1 ? factura.precio : '',  // Ingreso (tipo 3)
            tipo !== 1 ? factura.precio : '',  // Egreso (tipo 1 o 2)
            icon , // Icono
            factura.id,
        ]);
    });

    table.draw();
}


// Función para cargar datos y actualizar tabla, gráfico y totales
function refreshData(facturas) {
    const filteredData = filterByDate(facturas); // Filtrar facturas por fecha
    console.log("Fechas",filteredData);
    const previousBalance = calculatePreviousBalance(facturas, minEl.value);

    updateTable(filteredData, previousBalance);                  // Actualizar tabla
    calculateTotals(filteredData,previousBalance);              // Calcular totales
    initializeChart(filteredData);              // Actualizar gráfico
}

// Nueva función para calcular el balance anterior
function calculatePreviousBalance(facturas, minDateValue) {
    const minDate = new Date(`${minDateValue}T00:00:00`);
    let totalIngresos = 0;
    let totalEgresos = 0;

    facturas.forEach(factura => {
        const facturaDate = new Date(factura.fecha_factura);
        if (facturaDate < minDate) {
            let monto = parseFloat(factura.precio) || 0;
            if (factura.movimiento_caja_id === 1) { // Ingresos
                totalIngresos += monto;
            } else if (factura.movimiento_caja_id !== 1) { // Egresos
                totalEgresos += monto;
            }
        }
    });

    return totalIngresos - totalEgresos; // Devuelve el balance
}


// Función principal que carga tanto la tabla como el gráfico
async function loadData() {
    try {
        const response = await fetch('/api/accounting/balance'); // Endpoint para obtener datos
        const facturas = await response.json(); // Datos obtenidos de la consulta SQL

        // Inicializar tabla, totales y gráfico con los datos filtrados por fecha
        refreshData(facturas);

        // Recalcular en cada cambio de input
        minEl.addEventListener('input', () => refreshData(facturas));
        maxEl.addEventListener('input', () => refreshData(facturas));

        $('#table_invoice tbody').on('click', 'tr', function() {
            // Obtén los datos de la fila seleccionada
            const data = table.row(this).data();
            
            // Verifica si hay datos en la fila seleccionada
            if (data) {
                const facturaId = data[5];
                console.log("Fila seleccionada:", data,"id: ",facturaId);
                mostrarDetallesFactura(facturaId); // Llama a la función para mostrar detalles
            }});


    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Llamada a la función principal para cargar los datos
loadData();
async function mostrarDetallesFactura(id) {

try {
        // Llamada al endpoint para obtener los datos de la factura
        const response = await fetch(`http://localhost:3000/api/accounting/factura/${id}`);
        const data = await response.json()

        const formattedFechaEmision = new Date(data[0].fecha_factura).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        console.log("fecha formateada :", formattedFechaEmision);
        
        const detalleFacturaHtml = `
        <div class="container border p-4">
            <div class="text-center mb-4">
                <h2>${data[0].descripcion_tipo_factura}</h2>
                <p>Proyecto pilates</p>
            </div>
            <div class="row mb-4">
                <div class="col-md-6">
                    <p><strong>Razón Social:</strong> Proyecto Pilates</p>
                    <p><strong>CUIT:</strong> 2780905973</p>
                    <p><strong>Domicilio Comercial:</strong> Pedro Moreno 3844, Posadas, Misiones</p>
                    <p><strong>Condición frente al IVA:</strong> Responsable Monotributo</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Cliente:</strong> ${data[0].cliente_nya}</p>
                    <p><strong>CUIT Cliente:</strong> ${data[0].cuil}</p>
                    <p><strong>Domicilio Cliente:</strong> ${data[0].direccion}</p>
                </div>
            </div>
            <div class="mb-4">
                <p><strong>Fecha de Emisión:</strong> ${formattedFechaEmision}</p>
            </div>
            <div class="table-responsive mb-4">
                <table class="table table-bordered text-center">
                    <thead class="table-light">
                        <tr>
                            <th>Código</th>
                            <th>Producto/Servicio</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.values(data[0].detalle_factura).map(detalle => `
                            <tr>
                                <td>${detalle.detalle_id}</td>
                                <td>${detalle.descripcion}</td>
                                <td>${detalle.cantidad}</td>
                                <td>$${detalle.precio.toFixed(2)}</td>
                                <td>$${data[0].sub_total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="text-end mb-4">
                <p><strong>Subtotal:</strong> $${data[0].sub_total.toFixed(2)}</p>
                <p><strong>Total:</strong> $${data[0].sub_total.toFixed(2)}</p>
            </div>
            <div class="text-center">
                <p>CAE N°: 73053493791087</p>

            </div>
        </div>
    `;

    // Insertar el contenido en el modal
    document.getElementById('detalleFacturaBody').innerHTML = detalleFacturaHtml;

    // Mostrar el modal
    //$('#modalDetalles .modal-body').text(JSON.stringify(data)); // Mostrar datos en el modal
    $('#modalDetalles').modal('show'); // Mostrar modal (usando Bootstrap en este caso)
} catch (error) {
    console.error('Error al obtener los detalles de la factura:', error);
}
}