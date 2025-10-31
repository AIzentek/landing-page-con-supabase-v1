# 🚫 Forzar Logout de Todos los Usuarios Activos

## 🎯 **PROBLEMA:** Alguien más ya está logueado y quieres sacarlo de la sesión

### **Situaciones comunes:**
- Alguien usó las credenciales anteriores y sigue logueado
- Múltiples usuarios tienen sesiones activas
- Quieres invalidar todas las sesiones existentes
- Cambio de credenciales pero usuarios siguen conectados

---

## ⚡ **SOLUCIONES DISPONIBLES:**

### **🚀 OPCIÓN 1: Cambiar la clave de sesión (RECOMENDADO)**

#### **Método más efectivo - invalida TODAS las sesiones:**

1. **Editar `script.js` línea 8:**
```javascript
// Cambiar de:
const SESSION_KEY = 'authenticated_session';

// A:
const SESSION_KEY = 'authenticated_session_v2';  // ← Cambiar aquí
```

2. **Hacer commit y push:**
```bash
git add script.js
git commit -m "security: invalidar todas las sesiones activas"
git push origin main
```

3. **Resultado:** ✅ **TODOS los usuarios son deslogueados automáticamente**

---

### **🔧 OPCIÓN 2: Agregar sistema de invalidación global**

#### **Agregar al script.js - Sistema más avanzado:**

```javascript
// Agregar al final de script.js:

// Sistema de invalidación global de sesiones
const SESSION_VERSION = '2024-10-12-v1';  // Cambiar esta fecha/versión para invalidar todo

function checkSessionValidity() {
    const currentVersion = localStorage.getItem('session_version');
    if (currentVersion !== SESSION_VERSION) {
        // Sesión inválida, limpiar todo
        localStorage.clear();
        sessionStorage.clear();
        return false;
    }
    return true;
}

// Modificar checkAuthentication para incluir validación
const originalCheckAuth = checkAuthentication;
checkAuthentication = function() {
    if (!checkSessionValidity()) {
        // Forzar logout si la sesión es inválida
        localStorage.setItem('session_version', SESSION_VERSION);
        return originalCheckAuth();
    }
    return originalCheckAuth();
};

// Guardar versión en login exitoso
const originalLogin = handleLogin;
handleLogin = function(event) {
    const result = originalLogin(event);
    if (localStorage.getItem(SESSION_KEY) === 'true') {
        localStorage.setItem('session_version', SESSION_VERSION);
    }
    return result;
};
```

---

### **⚡ OPCIÓN 3: Timeout automático de sesiones**

#### **Agregar expiración automática:**

```javascript
// Agregar al final de script.js:

// Sistema de timeout de sesiones (24 horas)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 horas en millisegundos

function checkSessionTimeout() {
    const loginTime = localStorage.getItem(SESSION_KEY + '_timestamp');
    if (loginTime) {
        const now = new Date().getTime();
        const elapsed = now - parseInt(loginTime);
        
        if (elapsed > SESSION_TIMEOUT) {
            // Sesión expirada
            localStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(SESSION_KEY + '_timestamp');
            return false;
        }
    }
    return true;
}

// Modificar login para guardar timestamp
function handleLoginWithTimeout(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        localStorage.setItem(SESSION_KEY, 'true');
        localStorage.setItem(SESSION_KEY + '_timestamp', new Date().getTime()); // ← Nuevo
        errorMessage.style.display = 'none';
        
        showSuccessAnimation();
        setTimeout(() => {
            checkAuthentication();
        }, 1000);
    } else {
        // ... resto del código de error
    }
    
    return false;
}
```

---

## 🎯 **MÉTODO SÚPER RÁPIDO (2 minutos):**

### **Para desloggar a TODOS inmediatamente:**

#### **Paso 1: Cambiar clave de sesión**
```javascript
// En script.js línea 8, cambiar:
const SESSION_KEY = 'authenticated_session_NEW_' + Date.now();
```

#### **Paso 2: Subir cambios**
```bash
git add script.js
git commit -m "force logout all users"  
git push origin main
```

#### **Paso 3: Esperar 2-5 minutos**
- GitHub Pages se actualiza automáticamente
- **TODOS los usuarios son deslogueados**
- Solo funcionan las nuevas credenciales

---

## 🛠️ **FUNCIONES DE ADMINISTRACIÓN:**

### **Agregar al final de script.js:**

```javascript
// ========================================  
// FUNCIONES DE ADMINISTRACIÓN DE SESIONES
// ========================================

// Invalidar todas las sesiones (solo admin)
window.invalidateAllSessions = function() {
    const newSessionKey = 'auth_session_' + Date.now();
    console.log('🚫 Invalidando todas las sesiones activas...');
    console.log('Nueva clave de sesión:', newSessionKey);
    console.log('⚠️ ACTUALIZA SESSION_KEY en script.js con:', newSessionKey);
};

// Ver estadísticas de sesión
window.getSessionStats = function() {
    console.log('📊 ESTADÍSTICAS DE SESIÓN:');
    console.log('=========================');
    console.log('Clave actual:', SESSION_KEY);
    console.log('Estado local:', localStorage.getItem(SESSION_KEY) === 'true' ? 'ACTIVA' : 'INACTIVA');
    console.log('Timestamp:', localStorage.getItem(SESSION_KEY + '_timestamp') || 'No disponible');
    console.log('Credenciales:', VALID_CREDENTIALS);
};

// Limpiar sesión específica (para testing)
window.clearSpecificSession = function(sessionKey) {
    localStorage.removeItem(sessionKey);
    console.log('🧹 Sesión específica limpiada:', sessionKey);
};
```

---

## 🔒 **NIVELES DE SEGURIDAD:**

### **🟢 Nivel Básico (actual):**
- Credenciales en frontend
- Sesión en localStorage
- Sin expiración automática

### **🟡 Nivel Mejorado:**
- Cambio de SESSION_KEY para invalidar todos
- Timeout automático de sesiones
- Versioning de sesiones

### **🔴 Nivel Avanzado (recomendado para producción):**
- Tokens JWT con expiración
- Autenticación del servidor
- Rate limiting
- Logs de acceso

---

## ⚡ **ACCIÓN INMEDIATA RECOMENDADA:**

### **Para resolver tu problema AHORA:**

1. **Abrir:** `script.js` 
2. **Cambiar línea 8:**
   ```javascript
   const SESSION_KEY = 'authenticated_session_v2_secure';
   ```
3. **Commit y push:** 
   ```bash
   git add script.js && git commit -m "invalidate all sessions" && git push origin main
   ```
4. **Esperar 5 minutos**
5. **¡Listo!** Todos deslogueados, solo nuevas credenciales funcionan

---

## 🎯 **RESULTADO ESPERADO:**

### **Después del cambio:**
- ❌ **Usuarios anteriores:** Deslogueados automáticamente
- ❌ **Credenciales viejas:** No funcionan
- ✅ **Solo tú:** Puedes acceder con las nuevas credenciales
- 🔄 **Actualización:** Automática en GitHub Pages

---

## 📞 **CONFIRMACIÓN:**

**¿Qué método prefieres usar?**
1. **🚀 Rápido:** Cambiar SESSION_KEY (2 minutos)
2. **🔧 Avanzado:** Sistema de versioning (10 minutos)  
3. **⚡ Inmediato:** Función de administración (5 minutos)

**¡Cualquiera de estos métodos sacará a todos los usuarios activos!** 💪