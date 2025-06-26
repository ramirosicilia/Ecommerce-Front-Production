import { pedidos,detallesPedidos,obtenerProductos } from "./api/productos" 


let ordenes=[]
let detalleOrdenes=[]
let productos=[]



async function obtenerDatos(){  

    const Products= await obtenerProductos()

    const [order,detailsOrders]= await Promise.all([pedidos(),detallesPedidos()]) 
    ordenes=order 
    detalleOrdenes=detailsOrders
    productos=Products

} 


(async()=>{ 
  await  obtenerDatos() 
  mostrarOrden()

})() 
 
function mostrarOrden(){ 
    
    const objectoStorage=JSON.parse(localStorage.getItem("pagos"))||{}

    console.log(objectoStorage) 

    console.log(objectoStorage?.user+" "+"usuario" , objectoStorage?.pagoID+" "+"pago") 
    console.log(ordenes,"ordendes") 
    console.log(detalleOrdenes," detalle ordenes") 
    console.log(productos,"productos")

    let variantes=productos.flatMap(productos=>productos.productos_variantes) 
    console.log(variantes) 


}


