
const apiUrl=import.meta.env.VITE_BACKEND_URL



const saveConfig = (event) => {
    event.preventDefault();
    const accessToken = document.getElementById('accessToken').value;

    axios.post('/api/config', { accessToken })
      .then(response => {
        alert('Configuración guardada con éxito.');
        fetchPayments(); // Refrescar pagos después de guardar configuración
      })
      .catch(error => {
        console.error(error);
        alert('Error al guardar la configuración.');
      });
  };

  const fetchPayments = () => {
    axios.get('/api/payments')
      .then(response => {
        const tableBody = document.getElementById('paymentsTable');
        if (response.data.length > 0) {
          tableBody.innerHTML = response.data.map(payment => `
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
          tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No se encontraron pagos registrados.</td></tr>`;
        }
      })
      .catch(error => {
        console.error(error);
        alert('Error al obtener los pagos.');
      });
  };

  const viewDetails = (paymentId) => {
    alert(`Mostrando detalles para el pago: ${paymentId}`);
    // Aquí puedes implementar la lógica para mostrar más detalles
  };

  document.addEventListener('DOMContentLoaded', fetchPayments);