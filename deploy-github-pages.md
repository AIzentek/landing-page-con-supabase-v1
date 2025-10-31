# 📋 Guía de Despliegue en GitHub Pages

## Pasos para Desplegar LAPZO en GitHub Pages:

### 1. Crear Repositorio en GitHub
```bash
# Inicializar git si no está inicializado
git init
git add .
git commit -m "Initial LAPZO deployment"

# Agregar remote de tu repositorio GitHub
git remote add origin https://github.com/TU_USUARIO/lapzo-agent.git
git push -u origin main
```

### 2. Configurar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Click en **Settings**
3. Scroll down a **Pages**
4. En **Source**, selecciona **Deploy from a branch**
5. Selecciona **main** branch y **/ (root)**
6. Click **Save**

### 3. Tu página estará disponible en:
```
https://TU_USUARIO.github.io/lapzo-agent/
```

## ⚠️ Nota Importante:
GitHub Pages sirve archivos estáticos. El agente ElevenLabs funcionará perfectamente ya que es un widget JavaScript que se ejecuta en el cliente.

## 🔧 Configuración Adicional:
Si necesitas un dominio personalizado, puedes configurarlo en la sección Pages de GitHub.