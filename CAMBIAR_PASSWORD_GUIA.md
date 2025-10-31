# 🔐 Guía Completa: Cambiar Password de Acceso

## ❌ **PROBLEMA:** El password anterior sigue funcionando

### **Causas comunes:**
1. **Sesión activa** en localStorage del navegador
2. **Caché del navegador** con versión anterior
3. **GitHub Pages** no actualizado con los cambios
4. **Múltiples ventanas** del navegador abiertas

---

## ✅ **SOLUCIÓN COMPLETA (5 MINUTOS):**

### **Paso 1: Verificar cambios en script.js**

#### **En el archivo `script.js` líneas 2-5 debe aparecer:**
```javascript
const VALID_CREDENTIALS = {
    username: 'TU_NUEVO_USUARIO',     // ← Cambiar aquí
    password: 'TU_NUEVA_CONTRASEÑA'   // ← Cambiar aquí  
};
```

#### **Ejemplo:**
```javascript
const VALID_CREDENTIALS = {
    username: 'admin',
    password: 'miNuevaPassword2024'
};
```

### **Paso 2: Limpiar sesión del navegador (MUY IMPORTANTE)**

#### **Opción A: Desde la aplicación (Recomendado)**
1. **Ir a:** https://aizentek.github.io/demo-voice
2. **Si ya estás logueado:** Haz clic en "Cerrar Sesión"
3. **En el formulario de login:** Presiona F12
4. **En Console ejecutar:** `localStorage.clear()`
5. **Recargar página:** Ctrl+F5 (o Cmd+Shift+R en Mac)

#### **Opción B: Manualmente en DevTools**
1. **Abrir DevTools:** F12
2. **Ir a:** Application tab → Storage → Local Storage
3. **Buscar:** https://aizentek.github.io
4. **Eliminar:** `authenticated_session` key
5. **Recargar página:** Ctrl+F5

#### **Opción C: Modo incógnito (Prueba rápida)**
1. **Abrir:** Ventana incógnita/privada
2. **Ir a:** https://aizentek.github.io/demo-voice-LAPZO  
3. **Probar:** Nuevas credenciales (debería funcionar)

### **Paso 3: Forzar actualización de caché**

#### **Limpiar caché del navegador:**
1. **Recarga forzada:** Ctrl+Shift+R (o Cmd+Shift+R en Mac)
2. **O presiona:** Ctrl+F5 varias veces
3. **O usar:** DevTools → Network tab → "Disable cache" activado

#### **Verificar que script.js se actualizó:**
1. **F12 → Network tab**
2. **Recargar página**
3. **Buscar:** `script.js` en la lista
4. **Verificar:** Que aparezca como descargado (no "from cache")

### **Paso 4: Esperar deploy de GitHub Pages**

#### **Si acabas de cambiar script.js:**
1. **Hacer commit y push** de los cambios
2. **Esperar 2-5 minutos** para deploy automático
3. **Verificar en:** Settings → Pages que el último build sea exitoso

#### **Comandos para hacer push:**
```bash
git add script.js
git commit -m "update: cambiar credenciales de acceso"
git push origin main
```

---

## 🔧 **MÉTODO RÁPIDO DE VERIFICACIÓN:**

### **Test completo (2 minutos):**

#### **1️⃣ Limpiar todo:**
```javascript
// En console del navegador (F12):
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

#### **2️⃣ Probar credenciales:**
- **Viejas credenciales:** Debe fallar ❌
- **Nuevas credenciales:** Debe funcionar ✅

#### **3️⃣ Si sigue fallando:**
- Revisar que `script.js` tenga los cambios correctos
- Usar modo incógnito para confirmar
- Esperar más tiempo para deploy de GitHub

---

## 🛠️ **SOLUCIÓN DEFINITIVA CON CÓDIGO:**

### **Agregar función para forzar logout:**

#### **Agregar al final de script.js:**
```javascript
// Función para forzar limpieza (usar en emergencia)
window.forceLogout = function() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.clear();
    sessionStorage.clear();
    location.reload(true);
    console.log('Sesión forzosamente limpiada');
};

// Función para verificar credenciales actuales
window.checkCurrentCredentials = function() {
    console.log('Credenciales actuales:', VALID_CREDENTIALS);
};
```

#### **Para usar estas funciones:**
1. **Abrir console:** F12
2. **Ejecutar:** `forceLogout()` para limpiar todo
3. **O ejecutar:** `checkCurrentCredentials()` para ver qué credenciales están activas

---

## 🎯 **VERIFICACIÓN FINAL:**

### **✅ Checklist de confirmación:**

- [ ] `script.js` tiene las nuevas credenciales
- [ ] Hice commit y push de los cambios
- [ ] Limpié localStorage del navegador
- [ ] Recargué la página con Ctrl+Shift+R
- [ ] Esperé 5 minutos para deploy de GitHub
- [ ] Las credenciales viejas YA NO funcionan ❌
- [ ] Las credenciales nuevas SÍ funcionan ✅

---

## 🆘 **TROUBLESHOOTING:**

### **Problema: Sigue funcionando el password viejo**
#### **Causa:** Sesión activa o caché
#### **Solución:** 
```javascript
// En console (F12):
localStorage.clear();
location.reload(true);
```

### **Problema: Ningún password funciona**
#### **Causa:** Cambios no deployados
#### **Solución:**
1. Verificar en GitHub que el commit se hizo
2. Esperar 10 minutos más
3. Probar en modo incógnito

### **Problema: Error en console**
#### **Causa:** Error de sintaxis en script.js
#### **Solución:**
1. F12 → Console → revisar errores
2. Verificar comillas y sintaxis en VALID_CREDENTIALS

---

## ⚡ **MÉTODO SÚPER RÁPIDO (30 segundos):**

### **Si tienes prisa:**
1. **Abrir modo incógnito**
2. **Ir a:** https://aizentek.github.io/demo-voice
3. **Probar nuevas credenciales**
4. **Si funciona:** El problema es caché/localStorage
5. **Limpiar caché** en ventana normal

---

## 🔐 **EJEMPLO COMPLETO DE CAMBIO:**

### **Antes (script.js):**
```javascript
const VALID_CREDENTIALS = {
    username: 'admin',
    password: 'password123'
};
```

### **Después (script.js):**
```javascript
const VALID_CREDENTIALS = {
    username: 'admin',
    password: 'MiPasswordSeguro2024!'
};
```

### **Pasos después del cambio:**
1. **Guardar archivo**
2. **git add script.js**
3. **git commit -m "update credentials"**  
4. **git push origin main**
5. **Esperar 5 minutos**
6. **Limpiar localStorage:** `localStorage.clear()`
7. **Recargar:** Ctrl+Shift+R
8. **Probar nuevas credenciales**

---

## ✅ **¡LISTO! Nuevas credenciales funcionando**

Una vez completados estos pasos, **solo las nuevas credenciales funcionarán** y las anteriores serán rechazadas.

**¿En cuál paso necesitas ayuda específica?** 🚀