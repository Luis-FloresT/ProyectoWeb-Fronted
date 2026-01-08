# ==========================================
# ETAPA 1: CONSTRUCCIÓN (BUILD STAGE)
# ==========================================
# Utilizamos una imagen base de Node.js versión 20 basada en Alpine Linux.
# 'Alpine' es una distribución minimalista que reduce drásticamente el peso de la imagen inicial.
# Le asignamos el alias 'build' para referenciarla más tarde en la etapa de producción.
FROM node:20-alpine as build

# Establecemos el directorio de trabajo dentro del contenedor.
# Todas las instrucciones siguientes se ejecutarán dentro de '/app'.
WORKDIR /app

# ESTRATEGIA DE CACHÉ DE CAPAS:
# Copiamos primero SOLO los archivos de definición de dependencias (package.json y lockfile).
# Esto permite a Docker cachear esta capa. Si no cambias tus dependencias, Docker
# no volverá a ejecutar el 'npm install', acelerando los builds futuros.
COPY package.json package-lock.json ./

# Instalamos las dependencias del proyecto (node_modules) basándonos en el package-lock.json
# para asegurar versiones exactas (reproducibilidad).
RUN npm install

# Una vez instaladas las librerías, copiamos el resto del código fuente del proyecto
# al directorio de trabajo del contenedor.
COPY . .

# DEFINICIÓN DE VARIABLES DE ENTORNO (BUILD TIME):
# Vite necesita saber la URL del backend AL MOMENTO DE COMPILAR, ya que al ser un frontend
# estático, estas variables se "queman" (hardcodean) en el código JavaScript resultante.
# Nota: En un entorno enterprise real, esto idealmente se inyectaría dinámicamente o se usaría un proxy.
ENV VITE_API_URL=http://127.0.0.1:8000/api

# Ejecutamos el script de construcción de Vite.
# Esto transpiló React/JSX a archivos estáticos (HTML, CSS, JS) optimizados y minificados
# que se guardarán en la carpeta '/app/dist'.
RUN npm run build

# ==========================================
# ETAPA 2: SERVIDOR DE PRODUCCIÓN (RUNTIME STAGE)
# ==========================================
# Iniciamos una nueva imagen limpia basada en Nginx (también Alpine).
# Desechamos todo lo de la etapa 'build' (node_modules, código fuente, etc.) y nos quedamos
# solo con lo necesario para servir la web, logrando una imagen final muy ligera (<30MB).
FROM nginx:alpine

# Copiamos nuestra configuración personalizada de Nginx al directorio de configuración del contenedor.
# Esto es vital para manejar el enrutamiento de la SPA (Single Page Application) y evitar errores 404.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# TRANSFERENCIA DE ARTEFACTOS:
# Copiamos UNICAMENTE la carpeta 'dist' generada en la etapa anterior (alias 'build')
# al directorio estándar donde Nginx sirve contenido estático.
COPY --from=build /app/dist /usr/share/nginx/html

# Documentamos que el contenedor escuchará peticiones en el puerto 80 (estándar HTTP).
EXPOSE 80

# Comando de inicio del contenedor:
# Ejecutamos Nginx en primer plano ('daemon off') para que Docker monitoree el proceso
# y mantenga el contenedor activo.
CMD ["nginx", "-g", "daemon off;"]