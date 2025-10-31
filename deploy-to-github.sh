#!/bin/bash

# Script para desplegar a GitHub cuando hay problemas de autenticación
echo "🚀 Preparando despliegue manual a GitHub..."

# Crear resumen de cambios
echo "📋 Resumen de archivos para GitHub Pages:"
echo "✅ index.html - Página principal con login"
echo "✅ test-login-rapido.html - Página de test rápido"
echo "✅ control-dashboard-aizentek.html - Dashboard completo (si existe)"
echo "✅ script.js - Lógica de autenticación"
echo "✅ styles.css - Estilos"
echo "✅ security-protocol.js - Protocolo de seguridad"
echo "✅ .github/workflows/pages.yml - GitHub Actions"
echo "✅ README.md - Documentación completa"
echo "✅ CREDENCIALES_FINALES.md - Credenciales actuales"

# Mostrar instrucciones para GitHub Pages
echo ""
echo "🌐 INSTRUCCIONES PARA ACTIVAR GITHUB PAGES:"
echo ""
echo "1. Ve a: https://github.com/AIzentek/demo-voice-LAPZO"
echo "2. Click en 'Settings' (Configuración)"
echo "3. Scroll down a 'Pages' en el menú lateral"
echo "4. En 'Source', selecciona 'GitHub Actions'"
echo "5. El workflow .github/workflows/pages.yml se ejecutará automáticamente"
echo "6. Espera 2-5 minutos para que se active"
echo "7. Tu sitio estará en: https://aizentek.github.io/demo-voice-LAPZO/"

echo ""
echo "🔐 CREDENCIALES ACTUALES:"
echo "Usuario: lapzodemo"
echo "Password: Lapzodemo!"

echo ""
echo "✅ Todos los archivos están listos en el directorio actual"
echo "📂 Simplemente sube este contenido a GitHub y activa Pages"