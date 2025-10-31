# 🌐 Configurar GitHub Pages - URL Permanente

## 🎯 **URL Final que tendrás:**
**https://aizentek.github.io/demo-voice-LAPZO**

Esta URL será **PERMANENTE** y funcionará **SIEMPRE**, sin importar si el repositorio es público o privado.

---

## 📋 **Pasos para Configurar GitHub Pages:**

### **Paso 1: Ir a la configuración del repositorio**
1. Ve a: https://github.com/AIzentek/demo-voice
2. Haz clic en **"Settings"** (última pestaña a la derecha)

### **Paso 2: Configurar Pages**
1. En el menú lateral izquierdo, busca y haz clic en **"Pages"**
2. En la sección **"Source"** selecciona:
   - **Build and deployment:** "Deploy from a branch"
   - **Branch:** "main" 
   - **Folder:** "/ (root)"
3. Haz clic en **"Save"**

### **Paso 3: Esperar el despliegue**
1. GitHub comenzará a construir tu sitio automáticamente
2. Verás un mensaje: *"Your site is being built from the main branch"*
3. Espera 2-5 minutos para que se complete el proceso

### **Paso 4: Verificar la URL**
1. Refresca la página de Settings → Pages
2. Verás un mensaje verde: *"Your site is published at https://aizentek.github.io/demo-voice-LAPZO"*
3. Haz clic en el enlace para verificar que funciona

---

## ✅ **Verificación Final:**

### **Probar la URL permanente:**
1. Ve a: **https://aizentek.github.io/demo-voice-LAPZO**
2. Deberías ver tu landing page de login
3. Ingresa las credenciales:
   - Usuario: `admin`
   - Contraseña: `password123`
4. Verifica que el widget ElevenLabs carga correctamente

---

## 🔧 **Configuración Automática Incluida:**

### **✅ Ya configuré por ti:**
- **GitHub Actions Workflow** para despliegue automático
- **404.html** personalizado que redirige a la página principal
- **robots.txt** para SEO y seguridad
- **sitemap.xml** para motores de búsqueda
- **Meta tags** mejorados en index.html
- **CNAME** listo para dominio personalizado (opcional)

### **🚀 Funciones adicionales:**
- **Despliegue automático:** Cada vez que hagas push, se actualiza automáticamente
- **HTTPS automático:** GitHub Pages incluye SSL gratis
- **CDN global:** Tu sitio se servirá desde múltiples ubicaciones
- **Uptime 99.9%:** Disponibilidad garantizada por GitHub

---

## 🆘 **Resolución de Problemas:**

### **Si la página no carga:**
1. **Espera 10-15 minutos** (GitHub puede tardar en propagar)
2. **Verifica en Settings → Pages** que dice "Your site is published"
3. **Limpia caché del navegador** (Ctrl+F5 o Cmd+Shift+R)
4. **Prueba en modo incógnito**

### **Si hay errores 404:**
1. Verifica que el archivo `index.html` esté en la raíz del repositorio
2. Asegúrate de que la rama seleccionada sea "main"
3. Comprueba que todos los archivos se hayan subido correctamente

### **Si el widget no carga en GitHub Pages:**
1. Abre la consola del navegador (F12)
2. Busca errores relacionados con CORS o scripts
3. Verifica que el agent ID de ElevenLabs sea correcto

---

## 🔄 **Actualizaciones Automáticas:**

Cada vez que hagas cambios en el repositorio:
1. Haz commit y push como siempre
2. GitHub Actions se ejecutará automáticamente
3. Tu sitio se actualizará en 2-3 minutos
4. No necesitas hacer nada más

---

## 🌟 **Ventajas de GitHub Pages:**

✅ **Gratis** - Sin costo alguno  
✅ **Rápido** - CDN global de GitHub  
✅ **Seguro** - HTTPS incluido  
✅ **Confiable** - 99.9% uptime  
✅ **Automático** - Deploy en cada push  
✅ **Escalable** - Maneja tráfico alto  
✅ **SEO-friendly** - Bien indexado por Google  

---

## 🎯 **URLs de Referencia:**

- **Repositorio:** https://github.com/AIzentek/demo-voice
- **GitHub Pages:** https://aizentek.github.io/demo-voice
- **Sandbox (temporal):** https://8000-i5gcmjnyymes7awfhari4-cbeee0f9.sandbox.novita.ai/

---

## 🔮 **Opcional: Dominio Personalizado**

Si tienes un dominio propio (ej: `demo.tuempresa.com`):

1. **En tu proveedor DNS:**
   - Crea un registro CNAME: `demo` → `aizentek.github.io`

2. **En GitHub Pages:**
   - Ve a Settings → Pages
   - En "Custom domain" ingresa: `demo.tuempresa.com`
   - Habilita "Enforce HTTPS"

3. **Edita el archivo CNAME:**
   - Descomenta y cambia la línea en el archivo `CNAME`

---

## ✅ **¡Ejecuta los pasos y tendrás tu URL permanente!**

Tu demo estará disponible 24/7 en: **https://aizentek.github.io/demo-voice-LAPZO**

🎉 **¡Sin más errores de "servidor no disponible"!**