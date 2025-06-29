import { obtenerProductos,pedidos,detallesPedidos, pagoMercadoPago } from "./api/productos.js"; 



async function promesas() {
  const [productos, Pedidos, DetallesPedidos, pago] = await Promise.all([
    obtenerProductos(),
    pedidos(),
    detallesPedidos(),
    pagoMercadoPago()
  ]);

  console.log(productos, "productos");
  console.log(Pedidos, "pedidos");
  console.log(DetallesPedidos, "detalles pedidos");

  function calcularVentasPorMes(mes, año, Pedidos, DetallesPedidos, productos) {
    const pedidosFiltrados = Pedidos?.filter(pedido => {
      const fecha = new Date(pedido.fecha_creacion);
      return fecha.getMonth() === mes && fecha.getFullYear() === año;
    });

    const idsPedidos = pedidosFiltrados?.map(p => p.pedido_id);

    const detallesFiltrados = DetallesPedidos?.filter(d =>
      idsPedidos.includes(d.pedido_id)
    );

    const total = detallesFiltrados.reduce((acum, detalle) => {
      const producto = productos.find(p => p.producto_id === detalle.producto_id);
      const subtotal = detalle.cantidad * (producto?.precio || 0);
      return acum + subtotal;
    }, 0);

    return total;
  }

  function obtenerClientesActivos(Pedidos, Pagos) {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();

    const pagosAprobados = Pagos.filter(pago => (pago.status || '').toLowerCase() === 'approved');
    const preferenceIdsPagos = pagosAprobados.map(p => p.preference_id);

    const pedidosMesActual = Pedidos.filter(pedido => {
      const fechaPedido = new Date(pedido.fecha_creacion);
      return (
        fechaPedido.getMonth() === mesActual &&
        fechaPedido.getFullYear() === añoActual &&
        preferenceIdsPagos.includes(pedido.preference_id)
      );
    });

    const usuariosActivos = [...new Set(pedidosMesActual.map(p => p.usuario_id))];

    return usuariosActivos.length;
  }

  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const añoActual = hoy.getFullYear();
  const mesPasado = mesActual === 0 ? 11 : mesActual - 1;
  const añoMesPasado = mesActual === 0 ? añoActual - 1 : añoActual;

  const totalActual = calcularVentasPorMes(mesActual, añoActual, Pedidos, DetallesPedidos, productos);
  const totalPasado = calcularVentasPorMes(mesPasado, añoMesPasado, Pedidos, DetallesPedidos, productos);
  const diferencia = totalActual - totalPasado;
  const porcentajeCambio = totalPasado !== 0 ? ((diferencia / totalPasado) * 100).toFixed(2) : "∞";

  document.getElementById("total-actual").innerHTML = `$${totalActual}`;

  const comparacionElem = document.getElementById("comparacion-mes-pasado");
  let mensajeComparacion = "";

  if (totalPasado === 0 && totalActual > 0) {
    mensajeComparacion = "Este mes hubo nuevas ventas (sin comparación)";
  } else if (totalPasado === 0 && totalActual === 0) {
    mensajeComparacion = "Sin ventas en ambos meses";
  } else {
    mensajeComparacion = `Comparado con el mes pasado: ${porcentajeCambio}%`;
  }

  if (comparacionElem) comparacionElem.textContent = mensajeComparacion;

  const totalClientesActivos = obtenerClientesActivos(Pedidos, pago);
  const clientesActivosElem = document.getElementById("clientes-activos-numero");
  if (clientesActivosElem) clientesActivosElem.textContent = totalClientesActivos;

  const pedidosFiltrados = Pedidos.filter(pedido => {
    const fecha = new Date(pedido.fecha_creacion);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
  });

  const idsPedidosActuales = pedidosFiltrados.map(p => p.pedido_id);

  const detallesFiltrados = DetallesPedidos.filter(d =>
    idsPedidosActuales.includes(d.pedido_id)
  );

  const totalProductosVendidos = detallesFiltrados.reduce((acum, detalle) => {
    return acum + detalle.cantidad;
  }, 0);

  const productosVendidosElem = document.getElementById("productos-vendidos-numero");
  if (productosVendidosElem) productosVendidosElem.textContent = totalProductosVendidos;

  const ventasMensuales = [];
  const etiquetasMensuales = [];
  const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  for (let mes = 0; mes < 12; mes++) {
    if (mes <= mesActual) {
      const total = calcularVentasPorMes(mes, añoActual, Pedidos, DetallesPedidos, productos);
      ventasMensuales.push(total);
    } else {
      ventasMensuales.push(0);
    }
    etiquetasMensuales.push(nombresMeses[mes]);
  }

  renderizarGrafico(ventasMensuales, etiquetasMensuales);

  // ✳️ Modal de reporte al presionar botón
  document.getElementById("reportes").addEventListener("click", () => {
    const pedidosPagados = Pedidos.filter(p =>
      pago.filter(pg => (pg.status || '').toLowerCase() === 'approved')
          .map(pg => pg.preference_id)
          .includes(p.preference_id)
    );

    const totalPedidos = pedidosPagados.length;

    const totalVendidos = DetallesPedidos
      .filter(d => pedidosPagados.map(p => p.pedido_id).includes(d.pedido_id))
      .reduce((acc, d) => acc + d.cantidad, 0);

    const totalIngresos = ventasMensuales.reduce((acc, n) => acc + n, 0);

    const filas = ventasMensuales.map((valor, i) => `
      <tr>
        <td>${nombresMeses[i]}</td>
        <td>$${valor.toFixed(2)}</td>
      </tr>`).join("");

    const html = `
      <table style="width:100%; border-collapse: collapse; margin-top: 1rem;">
        <thead>
          <tr style="background:#f0f0f0;">
            <th style="padding:8px; border-bottom:1px solid #ccc;">Mes</th>
            <th style="padding:8px; border-bottom:1px solid #ccc;">Ventas</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
      <div style="margin-top:1rem;">
        <p><strong>Ingresos totales:</strong> $${totalIngresos.toFixed(2)}</p>
        <p><strong>Productos vendidos:</strong> ${totalVendidos}</p>
        <p><strong>Pedidos pagados:</strong> ${totalPedidos}</p>
      </div>
    `;

    document.getElementById("contenido-reporte").innerHTML = html;
    document.getElementById("modal-reporte").classList.remove("hidden");
  });

  document.querySelector(".close-button").addEventListener("click", () => {
    document.getElementById("modal-reporte").classList.add("hidden");
  });
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
        borderColor: '#6a11cb',
        backgroundColor: 'rgba(106, 17, 203, 0.1)',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });
}

promesas();