


 let mp 
   const apiUrl=import.meta.env.VITE_PAYMENT_URL
    let publicKey=import.meta.env.VITE_MP_PUBLIC_KEY


async function recibirKey(){  
   
   

    mp = new MercadoPago(publicKey, {
    locale: "es-AR" 
});

} 
  

 recibirKey()





 export async function enviarCompra(boton){ 
    let sumary=document.getElementById("summary")

    let isButtonInitialized=false

    const carritoProductos=JSON.parse(localStorage.getItem("productos")) 
     let carritoCompra=carritoProductos.map(item=>({...item}))
           
       
        carritoCompra=carritoProductos.map(item=>({
            id:item.producto_id,
            name: item.nombre_producto,
            quantity:item.cantidad,
            unit_price: item.precio_producto,
       

        }))  
        
       console.log(carritoCompra)
       console.log(carritoProductos)

      

    try {  

         const response = await fetch(`${apiUrl}/create_preference`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mp:carritoCompra,ecommerce:carritoProductos })
        });

        const data = await response.json();

        // Inicializar el botón solo si no ha sido creado
        if (!isButtonInitialized) { 
           console.log(sumary)
            let crear=document.createElement("div") 
            crear.id="wallet_container"
           boton.insertAdjacentElement("beforebegin", crear); 
         
        
          if (crear) {
            initializeMercadoPagoButton(data.id);
            isButtonInitialized = true;
          } else {
            console.error("El contenedor 'wallet_container' no existe aún.");
          }
     
}

    } catch (error) {
        console.error("Error al crear la preferencia de pago ->", error);
    }

  

 } 


 const initializeMercadoPagoButton = (preferenceId) => {
    const bricksBuilder = mp.bricks();
    const renderButton = async () => {  
        if (window.initializeMercadoPagoButton) window.initializeMercadoPagoButton.unmount();
        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
            },
        });
    };
    renderButton();
};
 

 