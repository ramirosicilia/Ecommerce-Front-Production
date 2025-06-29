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

  // Función adaptada para calcular ventas
  function calcularVentasPorMes(mes, año, Pedidos, DetallesPedidos, productos) {

    const pedidosFiltrados = Pedidos?.filter(pedido => {
      const fecha = new Date(pedido.fecha_creacion);
      return fecha.getMonth() === mes && fecha.getFullYear() === año;
    });

    const idsPedidos = pedidosFiltrados?.map(p => p.pedido_id);

    const detallesFiltrados = DetallesPedidos?.filter(d =>
      idsPedidos.includes(d.pedido_id)
    ); 

     console.log(productos, "productos");
  console.log(Pedidos, "pedidos");
  console.log(DetallesPedidos, "detalles pedidos");

    const total = detallesFiltrados.reduce((acum, detalle) => {
      const producto = productos.find(p => p.producto_id === detalle.producto_id);
      const subtotal = detalle.cantidad * (producto?.precio || 0);
      return acum + subtotal;
    }, 0);

    return total;
  }

  // Función para obtener clientes activos
  function obtenerClientesActivos(Pedidos, Pagos) {
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const añoActual = hoy.getFullYear();

  // 1. Filtrar pagos aprobados
  const pagosAprobados = Pagos.filter(pago => (pago.status || '').toLowerCase() === 'approved');

  // 2. Obtener todos los preference_id de pagos aprobados
  const preferenceIdsPagos = pagosAprobados.map(p => p.preference_id);

  // 3. Filtrar pedidos del mes actual cuyo preference_id esté en pagos aprobados
  const pedidosMesActual = Pedidos.filter(pedido => {
    const fechaPedido = new Date(pedido.fecha_creacion);
    return (
      fechaPedido.getMonth() === mesActual &&
      fechaPedido.getFullYear() === añoActual &&
      preferenceIdsPagos.includes(pedido.preference_id)
    );
  });

  // 4. Obtener usuario_id únicos de esos pedidos
  const usuariosActivos = [...new Set(pedidosMesActual.map(p => p.usuario_id))];

  console.log("Pagos aprobados:", pagosAprobados);
  console.log("Preference IDs pagos aprobados:", preferenceIdsPagos);
  console.log("Pedidos mes actual con pagos aprobados:", pedidosMesActual);
  console.log("Usuarios activos:", usuariosActivos);

  return usuariosActivos.length;
}



  // Fechas actuales
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const añoActual = hoy.getFullYear();
  const mesPasado = mesActual === 0 ? 11 : mesActual - 1;
  const añoMesPasado = mesActual === 0 ? añoActual - 1 : añoActual;

  // Totales de ventas
  const totalActual = calcularVentasPorMes(mesActual, añoActual, Pedidos, DetallesPedidos, productos);
  const totalPasado = calcularVentasPorMes(mesPasado, añoMesPasado, Pedidos, DetallesPedidos, productos);
  const diferencia = totalActual - totalPasado;
  const porcentajeCambio = totalPasado !== 0 ? ((diferencia / totalPasado) * 100).toFixed(2) : "∞";

  // Mostrar total actual
  const idTotalActual = document.getElementById("total-actual");
  idTotalActual.innerHTML = `$${totalActual}`;

  // Mostrar comparación con mes pasado (opcional)
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

  // Clientes activos
  const totalClientesActivos = obtenerClientesActivos(Pedidos, pago);
  const clientesActivosElem = document.getElementById("clientes-activos-numero");
  if (clientesActivosElem) clientesActivosElem.textContent = totalClientesActivos; 

  // 🟢 CANTIDAD DE PRODUCTOS VENDIDOS (no dinero)
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

// Mostrarlo en el DOM
const productosVendidosElem = document.getElementById("productos-vendidos-numero");
if (productosVendidosElem) productosVendidosElem.textContent = totalProductosVendidos;
}

promesas();
