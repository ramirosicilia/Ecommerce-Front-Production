
const apiUrl=import.meta.env.VITE_PAYMENT_URL

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
    try {
      const response = await axios.get(`${apiUrl}/pagos-mercadopago`);
      const pagosData = response.data;
      console.log("los pagos",pagosData)

      const tableBody = document.getElementById('paymentsTable');

      if (pagosData?.data?.length > 0) {
        tableBody.innerHTML = pagosData.data.map(payment => `
          <tr>
            <td>${payment.payment_id}</td>
            <td>${payment.status}</td>
            <td>${payment.transaction_amount}</td>
            <td>${payment.usuario_id}</td>
            <td>
              <button class="btn btn-sm btn-info" onclick="viewDetails('${payment.payment_id}')">Detalles</button>
            </td>
          </tr>
        `).join('');
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

  // Ver detalles (placeholder)
  const viewDetails = (paymentId) => {
    alert(`Mostrando detalles para el pago: ${paymentId}`);
    // Aquí podés cargar más información si querés
  };

  // Ejecutar al cargar
  document.addEventListener('DOMContentLoaded', async () => {
    await obtenerToken();
    await fetchPayments();
  });