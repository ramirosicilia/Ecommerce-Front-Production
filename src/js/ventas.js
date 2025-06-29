import { obtenerProductos,pedidos,detallesPedidos, pagoMercadoPago } from "./api/productos.js"; 




async function obtenerDatos() {
    const productos = await obtenerProductos();
    const Pedidos = await pedidos();
    const detalles_pedidos = await detallesPedidos();
    const pagos = await pagoMercadoPago();

    console.log(productos, "productos");
    console.log(Pedidos, "pedidos");
    console.log(detalles_pedidos, "detalle pedidos");
    console.log(pagos, "pagos mercado");

    // Nombres de los meses
    const nombresMeses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Filtramos los pagos aprobados
    const pagosAprobados = pagos.filter(pago => (pago.status || '').toLowerCase() === 'approved');
    const preferenceIdsAprobados = pagosAprobados.map(p => p.preference_id);

    // Filtramos los pedidos con pagos aprobados
    const pedidosPagados = Pedidos.filter(pedido => preferenceIdsAprobados.includes(pedido.preference_id));

    // Preparamos array de ventas por mes (enero a diciembre)
    const ventasMensuales = Array(12).fill(0); // Inicializamos todo en 0

    // Recorremos cada mes
    for (let mes = 0; mes < 12; mes++) {
      // Filtramos pedidos de ese mes
      const pedidosDelMes = pedidosPagados.filter(pedido => {
        const fecha = new Date(pedido.fecha_creacion);
        return fecha.getMonth() === mes;
      });

      // Obtenemos los IDs de pedidos del mes
      const idsPedidosMes = pedidosDelMes.map(p => p.pedido_id);

      // Filtramos detalles que correspondan a esos pedidos
      const detallesDelMes = detalles_pedidos.filter(detalle =>
        idsPedidosMes.includes(detalle.pedido_id)
      );

      // Sumamos ventas por cantidad * precio del producto
      const totalVentasMes = detallesDelMes.reduce((acum, detalle) => {
        const producto = productos.find(p => p.producto_id === detalle.producto_id);
        const precio = producto?.precio || 0;
        return acum + (detalle.cantidad * precio);
      }, 0);

      ventasMensuales[mes] = totalVentasMes;
    }

    console.log("📈 Ventas por mes:", ventasMensuales);

    // Renderizamos el gráfico
    renderizarGrafico(ventasMensuales, nombresMeses);
  }

  function renderizarGrafico(datosVentas, etiquetas) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: etiquetas,
        datasets: [{
          label: 'Ventas Mensuales',
          data: datosVentas,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 5000
            }
          }
        }
      }
    });
  }

  obtenerDatos();