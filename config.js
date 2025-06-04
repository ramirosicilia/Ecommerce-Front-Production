import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './', // importante para rutas relativas en producción
  root: '.',  // raíz del proyecto
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {

      
      input: {
        carrito: resolve(__dirname, 'src/pages/carrito.html'),
        categorias: resolve(__dirname, 'src/pages/categorias.html'),
        configuracion: resolve(__dirname, 'src/pages/configuracion.html'),
        dashboard: resolve(__dirname, 'src/pages/dashboard.html'),
        descripcion: resolve(__dirname, 'src/pages/descripcion.html'),
        envioRecuperacion: resolve(__dirname, 'src/pages/envioRecuperacion.html'),
        login: resolve(__dirname, 'src/pages/login.html'),
        nuevoRegistro: resolve(__dirname, 'src/pages/nuevoRegistro.html'),
        productosAdmin: resolve(__dirname, 'src/pages/productosAdmin.html'),
        productosUsuario: resolve(__dirname, 'src/pages/productosUsuario.html'),
        registro: resolve(__dirname, 'src/pages/registro.html'),
        registroProducto: resolve(__dirname, 'src/pages/registroProducto.html'),
        ventas: resolve(__dirname, 'src/pages/ventas.html'),
        // puedes agregar más si luego sumas páginas nuevas
      }
    }
  },
  server: {
    open: true,
    port: 5173
  }
})

