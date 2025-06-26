import { obtenerUsuarios } from "./api/productos.js";


   (async()=>{     

    const apiUrl=import.meta.env.VITE_PAYMENT_URL  
     const btnToken=document.getElementById("btn-token") 
     const containerSecret=document.getElementById("container-secret")  
    const inputToken=document.getElementById("input-Token")  


    let token 

    let tokenRecibido

     containerSecret.addEventListener('click',async()=>{ 
  
        token=await obtenerToken() 

        console.log(token,"token recibido")


    }) 
function onFocusToken() { 
  
  inputToken.readOnly = true;


  if (!token) { 
    alert("Clickeá el rectángulo para obtener el token");
  } else { 
    tokenRecibido=token 
    inputToken.placeholder=tokenRecibido
    alert("Token ingresado");
  }

  inputToken.removeEventListener("focus", onFocusToken);
}

inputToken.addEventListener("focus", onFocusToken);



   btnToken.addEventListener('click',async()=>{ 
     await fetchPayments();

  
   })

const obtenerToken = async () => { 


    try {
      const response = await axios.get(`${apiUrl}/token-mercadopago`);

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      const token = response.data;
      console.log("Token obtenido:", token);
      return token;

    } catch (error) {
      console.error("Error al obtener el token:", error.message);
      alert("Error al obtener el token de MercadoPago.");
      return null;
    }
  };

  // Obtener pagos y renderizar la tabla
 const fetchPayments = async () => { 
       if(!tokenRecibido){ 

        alert('no se enviado el token')
        return
       } 

      inputToken.placeholder="Access token ingresado una una vez "

  try {
    const usuarios = await obtenerUsuarios(); // primero traemos los usuarios
    console.log(usuarios.user,"usuarios")
    const response = await axios.get(`${apiUrl}/pagos-mercadopago`);
    const pagosData = response.data;

    const tableBody = document.getElementById('paymentsTable');

    if (pagosData?.length > 0) {
      tableBody.innerHTML = pagosData.map(payment => {
        const nombreUsuario = usuarios.user.find(user => user.usuario_id === payment.usuario_id)?.usuario || 'Usuario desconocido';

        return `
          <tr>
            <td>${payment.payment_id}</td>
            <td>${payment.status}</td>
            <td>$${payment.transaction_amount.toFixed(2)}</td>
            <td>${nombreUsuario}</td>
            <td>
              <button class="btn btn-sm btn-info detalle-btn" data-id="${payment.payment_id}">Detalles</button>
            </td>
          </tr>
        `;
      }).join(''); 

        document.querySelectorAll('.detalle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          alert(`Mostrando detalles para el pago: ${id}`);
        });
      });

    } else {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center">No se encontraron pagos registrados.</td>
        </tr>
      `;
    }  

    

  } catch (error) {
    console.error("Error al obtener los pagos:", error.message);
    alert("Error al obtener los pagos.");
  }
};


   })()

   
 
    
  

 

  // Ejecutar al cargar
 