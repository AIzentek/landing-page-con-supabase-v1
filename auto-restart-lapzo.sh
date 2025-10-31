#!/bin/bash

# Script de monitoreo y auto-restart para LAPZO
LOG_FILE="/home/user/webapp/lapzo-monitor.log"
PORT=8080

echo "🔍 Iniciando monitor LAPZO..." | tee -a "$LOG_FILE"

while true; do
    # Verificar si el servidor está corriendo
    if ! pgrep -f "python3 -m http.server $PORT" > /dev/null; then
        echo "⚠️  $(date): Servidor LAPZO no está corriendo. Reiniciando..." | tee -a "$LOG_FILE"
        
        # Matar cualquier proceso zombi
        pkill -f "python3 -m http.server $PORT" 2>/dev/null || true
        
        # Esperar un momento
        sleep 2
        
        # Cambiar al directorio correcto
        cd /home/user/webapp
        
        # Iniciar el servidor
        nohup python3 -m http.server $PORT > /dev/null 2>&1 &
        
        echo "✅ $(date): Servidor LAPZO reiniciado en puerto $PORT" | tee -a "$LOG_FILE"
    else
        echo "✅ $(date): Servidor LAPZO funcionando correctamente" | tee -a "$LOG_FILE"
    fi
    
    # Esperar 30 segundos antes del próximo check
    sleep 30
done