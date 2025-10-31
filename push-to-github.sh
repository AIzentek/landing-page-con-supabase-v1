#!/bin/bash

# Script para hacer push del repositorio a GitHub
# Ejecuta este script después de crear el repositorio vacío en GitHub

set -e

echo "🚀 Preparando push a GitHub..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en el directorio del repositorio"
    exit 1
fi

# Verificar que el remote está configurado
if ! git remote | grep -q "origin"; then
    echo "❌ Error: No se encontró el remote 'origin'"
    echo "Por favor, ejecuta primero:"
    echo "  git remote add origin https://github.com/AIzentek/landing-page-con-supabase-v1.git"
    exit 1
fi

echo "✅ Directorio correcto"
echo "✅ Remote configurado"
echo ""

# Mostrar estado
echo "📊 Estado actual:"
git log --oneline -3
echo ""

# Hacer push
echo "🔄 Haciendo push a GitHub..."
git push -u origin main

echo ""
echo "✅ ¡Push completado exitosamente!"
echo ""
echo "🌐 Tu repositorio está disponible en:"
echo "   https://github.com/AIzentek/landing-page-con-supabase-v1"
echo ""
