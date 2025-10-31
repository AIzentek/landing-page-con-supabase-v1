# Dockerfile para LAPZO Agent
FROM python:3.9-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache \
    nginx \
    supervisor

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de la aplicación
COPY . .

# Crear configuración de nginx
RUN mkdir -p /etc/nginx/http.d
COPY nginx.conf /etc/nginx/http.d/default.conf

# Crear configuración de supervisor
COPY supervisord.conf /etc/supervisord.conf

# Exponer puerto
EXPOSE 80

# Comando de inicio
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]