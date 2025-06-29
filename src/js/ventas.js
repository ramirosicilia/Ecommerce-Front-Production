import { obtenerProductos,pedidos,detallesPedidos, pagoMercadoPago } from "./api/productos.js"; 




document.addEventListener("DOMContentLoaded", () => {

  async function obtenerDatos() {
    const reportesID = document.getElementById("reportes");

    const productos = await obtenerProductos();
    const Pedidos = await pedidos();
    const detalles_pedidos = await detallesPedidos();
    const pagos = await pagoMercadoPago();

    console.log(productos, "productos");
    console.log(Pedidos, "pedidos");
    console.log(detalles_pedidos, "detalle pedidos");
    console.log(pagos, "pagos mercado");

    const nombresMeses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const pagosAprobados = pagos.filter(pago => (pago.status || '').toLowerCase() === 'approved');
    const preferenceIdsAprobados = pagosAprobados.map(p => p.preference_id);
    const pedidosPagados = Pedidos.filter(pedido => preferenceIdsAprobados.includes(pedido.preference_id));

    const ventasMensuales = Array(12).fill(0);

    for (let mes = 0; mes < 12; mes++) {
      const pedidosDelMes = pedidosPagados.filter(pedido => {
        const fecha = new Date(pedido.fecha_creacion);
        return fecha.getMonth() === mes;
      });

      const idsPedidosMes = pedidosDelMes.map(p => p.pedido_id);

      const detallesDelMes = detalles_pedidos.filter(detalle =>
        idsPedidosMes.includes(detalle.pedido_id)
      );

      const totalVentasMes = detallesDelMes.reduce((acum, detalle) => {
        const producto = productos.find(p => p.producto_id === detalle.producto_id);
        const precio = producto?.precio || 0;
        return acum + (detalle.cantidad * precio);
      }, 0);

      ventasMensuales[mes] = totalVentasMes;
    }

    console.log("📈 Ventas por mes:", ventasMensuales);
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

  obtenerDatos(); // Se ejecuta una vez que todo el DOM está cargado

});
