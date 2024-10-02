

// Inicialización de DataTables y sus funcionalidades

let table = new DataTable('#table_invoice', {
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
            text: '<img src="public/images/copy_icon.png" class="icon">',
            titleAttr: 'Copiar al portapapeles',
            className: "btn btn-light"
        },
        {
            extend: 'excel',
            text: '<img src="public/images/excel_icon.png" class="icon">',
            titleAttr: 'Exportar a Excel',
            className: "btn btn-light",
            excelStyles: {
                template: 'header_blue'
            }
        },
        {
            extend: 'pdf',
            text: '<img src="public/images/pdf_icon.png" class="icon">',
            titleAttr: 'Exportar a PDF',
            className: "btn btn-light"
        },
        {
            extend: 'print',
            text: '<img src="public/images/print_icon.png" class="icon">',
            titleAttr: 'Imprimir',
            className: "btn btn-light"
        },
    ],

});

// Inicialización de Highcharts para el gráfico de torta
let contenedor = $('#contenedor');
let chart = Highcharts.chart(contenedor[0], {
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
            data: chartData(table),
        }
    ],
    tooltip: {
        background: '#fff', // Color de fondo
        borderColor: '#000',     // Color del borde
        borderRadius: 10,        // Redondeo del borde
        style: {
            color: '#000000',       // Color del texto
            fontSize: '12px'
        },
            
        useHTML: true, // Permite usar HTML en el tooltip
        headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
        pointFormat: '<span style="color:{point.color}">●</span> <b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)<br/>'
    }
});
// Actualización del gráfico cada vez que se modifiquen los datos en la tabla
table.on('draw', function () {
    chart.series[0].setData(chartData(table));
});
// Función para calcular los ingresos y egresos desde la tabla
function chartData(table) {
    let ingresos = 0;
    let egresos = 0;

    // Sumamos los ingresos (columna 2) y los egresos (columna 3)
    table
        .rows()
        .data()
        .each(function (rowData) {
            let ingreso = parseFloat(rowData[2].replace(/\./g, '')) || 0;
            let egreso = parseFloat(rowData[3].replace(/\./g, '')) || 0;
            ingresos += ingreso;
            egresos += egreso;
        });

    return [
        {
            name: 'Ingresos',
            y: ingresos,
            color: '#28a745' // Color verde para ingresos
        },
        {
            name: 'Egresos',
            y: egresos,
            color: '#dc3545' // Color rojo para egresos
        }
    ];
}

