#!/bin/bash

# Script para iniciar el servidor LAPZO
echo "🚀 Iniciando servidor LAPZO..."

# Ir al directorio del proyecto
cd /home/user/webapp

# Matar procesos previos si existen
echo "🔧 Limpiando procesos previos..."
pkill -f "python3 -m http.server 8080" 2>/dev/null || true
pkill -f "python3 server.py" 2>/dev/null || true

# Esperar un momento
sleep 2

# Iniciar el servidor
echo "▶️  Iniciando servidor en puerto 8080..."
python3 -m http.server 8080 &

# Mostrar información
echo "✅ Servidor LAPZO iniciado!"
echo "🌐 La página estará disponible en el puerto 8080"
echo "🔑 Credenciales: lapzodemo / Lapzodemo!"
echo "🎯 Agent ID: agent_6501k7apm2zte7p8c3zzsmjddzsh"

# Mantener el script activo
wait