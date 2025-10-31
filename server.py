#!/usr/bin/env python3
"""
Servidor HTTP simple para servir la landing page
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Agregar headers de seguridad
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Log personalizado
        print(f"[{self.log_date_time_string()}] {format % args}")

def start_server(port=8000):
    """Iniciar el servidor HTTP"""
    try:
        # Cambiar al directorio del script
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        # Crear el servidor
        with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
            print(f"🚀 Servidor iniciado en http://localhost:{port}")
            print(f"📁 Directorio: {os.getcwd()}")
            print("📋 Credenciales por defecto:")
            print("   Usuario: admin")
            print("   Contraseña: password123")
            print("\n🔗 Abre tu navegador y visita: http://localhost:8000")
            print("⏹️  Presiona Ctrl+C para detener el servidor\n")
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n\n🛑 Servidor detenido por el usuario")
                
    except PermissionError:
        print(f"❌ Error: No se puede usar el puerto {port} (requiere permisos)")
        print("💡 Intenta con un puerto diferente: python server.py 8080")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Error: El puerto {port} ya está en uso")
            print("💡 Intenta con un puerto diferente o cierra el proceso que usa ese puerto")
        else:
            print(f"❌ Error del sistema: {e}")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

if __name__ == "__main__":
    # Obtener puerto desde argumentos de línea de comandos
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("❌ Puerto inválido. Usando puerto por defecto 8000")
            port = 8000
    
    start_server(port)