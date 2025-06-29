import { obtenerProductos,pedidos,detallesPedidos, pagoMercadoPago } from "./api/productos.js"; 




async function obtenerDatos(){

    const productos= await obtenerProductos()
    const Pedidos=await pedidos() 
    const detalles_pedidos= await detallesPedidos()
    const mercadoPago=  await pagoMercadoPago() 

    console.log(productos,"productos")
    console.log(Pedidos,"pedidos")
    console.log(detalles_pedidos,"detalle pedidos")
    console.log(mercadoPago,"mercado pago")

} 

obtenerDatos()



const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [{
          label: 'Ventas Mensuales',
          data: [0, 500, 1200, 3000, 5000, 7000, 8500, 10000, 15000, 18000, 22000, 25000],
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

