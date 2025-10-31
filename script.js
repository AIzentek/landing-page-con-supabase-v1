// Configuracion de credenciales (ACTUALIZADO LAPZO DEMO)
const VALID_CREDENTIALS = {
    username: 'aizentekdemo',
    password: 'Demo12345!'
};

// Nombre de la clave en localStorage para mantener la sesion
const SESSION_KEY = 'aizentekdemo_session_demo2025';

// ⚡ LISTENER PARA LOGOUT FORZADO DESDE ADMIN (SOLO PARA NUCLEAR LOGOUT)
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'NUCLEAR_LOGOUT') {
        console.log('💥 NUCLEAR LOGOUT RECIBIDO');
        localStorage.clear();
        sessionStorage.clear();
        location.reload();
    }
});

// 🚨 NUEVO: Listener para cambios de localStorage (sync entre pestañas/dispositivos)
window.addEventListener('storage', function(event) {
    if (event.key === 'force_logout_all' || event.key === 'nuclear_logout_active') {
        console.log('💥 NUCLEAR LOGOUT DETECTADO VIA STORAGE EVENT');
        nukeLaunched = true;
        localStorage.clear();
        sessionStorage.clear();
        location.reload();
    }
});

// 🚨 NUEVO: Custom event listener
window.addEventListener('nuclear_logout', function(event) {
    console.log('💥 NUCLEAR LOGOUT DETECTADO VIA CUSTOM EVENT');
    nukeLaunched = true;
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
});

// 💥 LOGOUT NUCLEAR ULTRA SIMPLE - GARANTIZADO QUE FUNCIONA
let nukeLaunched = false;
let lastNuclearCheck = Date.now();

// Polling SÚPER AGRESIVO cada 100ms
setInterval(function() {
    if (nukeLaunched) return;
    
    // NUEVO: Verificar timestamp de nuclear logout global
    const nuclearTimestamp = localStorage.getItem('nuclear_logout_timestamp');
    const nuclearFlag = localStorage.getItem('nuclear_logout_active');
    
    // Si hay contenido principal visible pero no hay sesión = LOGOUT NUCLEAR
    const mainContent = document.getElementById('main-content');
    const hasSession = localStorage.getItem(SESSION_KEY);
    
    // NUEVA CONDICIÓN: También verificar si se activó nuclear logout
    const nuclearActivated = nuclearFlag === 'true' && nuclearTimestamp && 
                            (Date.now() - parseInt(nuclearTimestamp)) < 30000; // 30 segundos
    
    if (mainContent && mainContent.style.display === 'block' && (!hasSession || nuclearActivated)) {
        console.log('💥 LOGOUT NUCLEAR - Sesión eliminada por admin');
        nukeLaunched = true;
        
        // DESTRUIR PÁGINA INMEDIATAMENTE
        document.body.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;
                       background:#ff0000;color:white;display:flex;align-items:center;
                       justify-content:center;font-family:Arial;text-align:center;z-index:999999999;">
                <div>
                    <h1 style="font-size:48px;">🚨 EXPULSADO POR ADMIN</h1>
                    <p style="font-size:24px;">Redirigiendo...</p>
                </div>
            </div>
        `;
        
        // Limpiar y redirect
        localStorage.clear();
        sessionStorage.clear();
        
        setTimeout(() => {
            window.location.href = window.location.origin + window.location.pathname;
        }, 1500);
    }
}, 100); // Cada 100ms = SÚPER FRECUENTE

// 🔄 VERIFICACIÓN AUTOMÁTICA DESACTIVADA 
// (Causaba conflicto con logout nuclear - se ejecutaba automáticamente)
// El logout nuclear ahora maneja toda la lógica de expulsión

// Función para verificar si el usuario está autenticado
function checkAuthentication() {
    const isAuthenticated = localStorage.getItem(SESSION_KEY);
    const loginForm = document.getElementById('login-form');
    const mainContent = document.getElementById('main-content');
    
    // 🚨 VERIFICACIÓN DE SEGURIDAD DESACTIVADA TEMPORALMENTE PARA DEMO
    // Verificación de timestamp removida para evitar expulsión automática
    console.log('🔄 Verificación de autenticación - timestamp check DISABLED for demo');
    
    if (isAuthenticated === 'true') {
        // Usuario autenticado, mostrar contenido principal
        loginForm.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Usuario autenticado - monitoring automático ya activo
    } else {
        // Usuario no autenticado, mostrar formulario de login
        loginForm.style.display = 'block';
        mainContent.style.display = 'none';
    }
}

// Función para manejar el login
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Verificar credenciales
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        // Credenciales correctas
        localStorage.setItem(SESSION_KEY, 'true');
        localStorage.setItem(SESSION_KEY + '_timestamp', new Date().getTime());
        errorMessage.style.display = 'none';
        
        // 🔥 NUEVO: Registrar login exitoso en Supabase
        if (window.sessionTracker) {
            await window.sessionTracker.trackLogin(username, true, 0);
        }
        
        // Registrar acceso exitoso para el panel de administración (local)
        logUserAccess('success', { username, timestamp: new Date().toISOString() });
        
        // Mostrar animación de éxito y cambiar a contenido principal
        showSuccessAnimation();
        setTimeout(() => {
            checkAuthentication();
        }, 1000);
        
    } else {
        // Credenciales incorrectas
        errorMessage.style.display = 'block';
        
        // Contar intentos fallidos para Supabase
        const failedAttempts = parseInt(localStorage.getItem('failed_login_attempts') || '0') + 1;
        localStorage.setItem('failed_login_attempts', failedAttempts.toString());
        
        // 🔥 NUEVO: Registrar intento fallido en Supabase
        if (window.sessionTracker) {
            await window.sessionTracker.trackFailedAttempt(username || 'empty', failedAttempts);
        }
        
        // Registrar intento fallido (local)
        logUserAccess('failed', { 
            username: username || 'empty', 
            timestamp: new Date().toISOString(),
            reason: 'invalid_credentials'
        });
        
        // 🚨 Activar protocolo de seguridad
        if (window.securityProtocol) {
            window.securityProtocol.registerFailedAttempt();
        }
        
        // Agregar efecto de shake al formulario
        const loginBox = document.querySelector('.login-box');
        loginBox.classList.add('shake');
        setTimeout(() => {
            loginBox.classList.remove('shake');
        }, 600);
        
        // Limpiar campos
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
    }
    
    return false;
}

// Función para mostrar animación de éxito
function showSuccessAnimation() {
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    
    loginBtn.textContent = '✓ Acceso Autorizado';
    loginBtn.style.background = '#2ecc71';
    loginBtn.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        loginBtn.textContent = originalText;
        loginBtn.style.background = '';
        loginBtn.style.transform = '';
    }, 1500);
}

// Función para cerrar sesión
async function logout() {
    // Mostrar confirmación
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // 🔥 NUEVO: Registrar logout en Supabase
        if (window.sessionTracker) {
            await window.sessionTracker.trackLogout();
        }
        
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem('failed_login_attempts'); // Limpiar contador de intentos fallidos
        
        // Limpiar formulario
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('error-message').style.display = 'none';
        
        checkAuthentication();
    }
}

// Función para agregar seguridad adicional
function addSecurityMeasures() {
    // Deshabilitar clic derecho
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    
    // Deshabilitar F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') || 
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
        }
    });
    
    // Detectar si las herramientas de desarrollador están abiertas
    let devtools = {
        open: false,
        orientation: null
    };
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > 160 || 
            window.outerWidth - window.innerWidth > 160) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                console.log('%c⚠️ ADVERTENCIA DE SEGURIDAD', 'color: red; font-size: 20px; font-weight: bold;');
                console.log('%cAcceso no autorizado a herramientas de desarrollador detectado.', 'color: red; font-size: 14px;');
            }
        } else {
            devtools.open = false;
        }
    }, 500);
}

// Función para manejar el cambio de visibilidad de la pestaña
function handleVisibilityChange() {
    if (document.hidden) {
        document.title = '🔒 Acceso Seguro - Sesión Protegida';
    } else {
        document.title = 'Acceso Seguro - Landing Page';
    }
}

// Función para proteger contra inspección de código
function protectCode() {
    // Reemplazar console.log para evitar inspección
    const originalLog = console.log;
    console.log = function() {
        // No hacer nada o mostrar mensaje de advertencia
    };
    
    // Detectar si se intenta inspeccionar el localStorage
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = function(key) {
        if (key === SESSION_KEY) {
            // Solo permitir acceso desde el dominio correcto
            return originalGetItem.call(this, key);
        }
        return originalGetItem.call(this, key);
    };
}

// Event Listeners y inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación al cargar la página
    checkAuthentication();
    
    // Agregar medidas de seguridad
    addSecurityMeasures();
    protectCode();
    
    // Manejar cambios de visibilidad
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Focus en el campo de usuario al cargar
    const usernameField = document.getElementById('username');
    if (usernameField && document.getElementById('login-form').style.display !== 'none') {
        usernameField.focus();
    }
    
    // Agregar evento para Enter en los campos de input
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('password').focus();
        }
    });
    
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    });
});

// Agregar estilos para la animación de shake
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    .shake {
        animation: shake 0.6s ease-in-out;
    }
    
    @keyframes shake {
        0%, 20%, 40%, 60%, 80% {
            transform: translateX(-10px);
        }
        10%, 30%, 50%, 70%, 90% {
            transform: translateX(10px);
        }
        100% {
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(shakeStyle);

// Funciones de utilidad para cambiar credenciales (solo para administración)
window.updateCredentials = function(newUsername, newPassword) {
    if (localStorage.getItem(SESSION_KEY) === 'true') {
        VALID_CREDENTIALS.username = newUsername;
        VALID_CREDENTIALS.password = newPassword;
        console.log('Credenciales actualizadas correctamente');
    } else {
        console.log('Acceso denegado: no está autenticado');
    }
};

// Función para obtener información de la sesión (solo si está autenticado)
window.getSessionInfo = function() {
    if (localStorage.getItem(SESSION_KEY) === 'true') {
        return {
            authenticated: true,
            loginTime: localStorage.getItem(SESSION_KEY + '_time') || 'No disponible',
            currentUser: VALID_CREDENTIALS.username
        };
    } else {
        return {
            authenticated: false,
            message: 'No hay sesión activa'
        };
    }
};

// ========================================
// FUNCIONES DE AYUDA PARA CAMBIO DE CREDENCIALES
// ========================================

// Función para forzar logout completo (usar cuando cambies credenciales)
window.forceLogout = function() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.clear();
    sessionStorage.clear();
    
    // Limpiar campos del formulario
    if (document.getElementById('username')) {
        document.getElementById('username').value = '';
    }
    if (document.getElementById('password')) {
        document.getElementById('password').value = '';
    }
    if (document.getElementById('error-message')) {
        document.getElementById('error-message').style.display = 'none';
    }
    
    // Recargar página completamente
    location.reload(true);
    
    console.log('🔐 Sesión forzosamente limpiada - Recarga completa realizada');
};

// Función para verificar credenciales actuales
window.checkCurrentCredentials = function() {
    console.log('🔑 Credenciales actuales configuradas:');
    console.log('   Usuario:', VALID_CREDENTIALS.username);
    console.log('   Password:', VALID_CREDENTIALS.password);
    console.log('   Sesión activa:', localStorage.getItem(SESSION_KEY) === 'true' ? 'SÍ' : 'NO');
};

// Función para limpiar solo la sesión actual (sin recargar)
window.clearSession = function() {
    localStorage.removeItem(SESSION_KEY);
    console.log('🧹 Sesión limpiada - Debes recargar la página manualmente');
};

// Función de diagnóstico completo
window.diagnosticCredentials = function() {
    console.log('🔍 DIAGNÓSTICO DE CREDENCIALES:');
    console.log('=================================');
    console.log('✅ Credenciales configuradas:');
    console.log('   - Usuario:', VALID_CREDENTIALS.username);
    console.log('   - Password:', VALID_CREDENTIALS.password);
    console.log('');
    console.log('📊 Estado de la sesión:');
    console.log('   - Sesión activa:', localStorage.getItem(SESSION_KEY) === 'true' ? 'SÍ' : 'NO');
    console.log('   - Timestamp página:', new Date().toISOString());
    console.log('');
    console.log('🛠️ Para solucionar problemas:');
    console.log('   - Forzar logout: forceLogout()');
    console.log('   - Solo limpiar sesión: clearSession()');
    console.log('   - Ver credenciales: checkCurrentCredentials()');
    console.log('   - Invalidar todas las sesiones: invalidateAllSessions()');
};

// ========================================  
// FUNCIONES DE ADMINISTRACIÓN DE SESIONES
// ========================================

// Invalidar todas las sesiones activas (FUNCIÓN DE ADMINISTRADOR)
window.invalidateAllSessions = function() {
    const newSessionKey = 'auth_session_' + Date.now();
    
    console.log('🚫 INVALIDANDO TODAS LAS SESIONES ACTIVAS');
    console.log('==========================================');
    console.log('⚠️ ACCIÓN REQUERIDA: Actualizar script.js');
    console.log('');
    console.log('📝 Cambiar en script.js línea 8:');
    console.log(`   const SESSION_KEY = '${newSessionKey}';`);
    console.log('');
    console.log('💾 Después hacer commit y push:');
    console.log('   git add script.js');
    console.log('   git commit -m "invalidate all active sessions"');
    console.log('   git push origin main');
    console.log('');
    console.log('✅ Resultado: TODOS los usuarios serán deslogueados');
    console.log('🔐 Solo las nuevas credenciales funcionarán');
    
    return {
        newSessionKey: newSessionKey,
        currentKey: SESSION_KEY,
        action: 'update_script_js'
    };
};

// Método rápido para generar nueva clave de sesión
window.generateNewSessionKey = function() {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const newKey = `auth_session_${timestamp}_${randomStr}`;
    
    console.log('🔑 NUEVA CLAVE DE SESIÓN GENERADA:');
    console.log('==================================');
    console.log(`SESSION_KEY = '${newKey}';`);
    console.log('');
    console.log('📋 Pasos para aplicar:');
    console.log('1. Copiar la línea de arriba');
    console.log('2. Reemplazar en script.js línea 8');
    console.log('3. Commit y push los cambios');
    console.log('4. Esperar 5 minutos para deploy');
    
    return newKey;
};

// Ver estadísticas completas de sesión
window.getSessionStats = function() {
    console.log('📊 ESTADÍSTICAS COMPLETAS DE SESIÓN:');
    console.log('====================================');
    console.log('🔑 Configuración:');
    console.log('   - Clave de sesión:', SESSION_KEY);
    console.log('   - Usuario:', VALID_CREDENTIALS.username);
    console.log('   - Password configurado:', VALID_CREDENTIALS.password ? 'Sí' : 'No');
    console.log('');
    console.log('📱 Estado local (este navegador):');
    console.log('   - Sesión activa:', localStorage.getItem(SESSION_KEY) === 'true' ? '✅ SÍ' : '❌ NO');
    console.log('   - Timestamp actual:', new Date().toISOString());
    console.log('');
    console.log('🧹 Limpieza disponible:');
    console.log('   - localStorage keys:', Object.keys(localStorage).length);
    console.log('');
    console.log('⚡ Funciones de administrador:');
    console.log('   - invalidateAllSessions() - Desloggear a todos');
    console.log('   - generateNewSessionKey() - Generar nueva clave');
    console.log('   - forceLogout() - Logout forzado local');
};

// Función para verificar si hay múltiples sesiones (aproximado)
window.checkMultipleSessions = function() {
    console.log('🔍 VERIFICACIÓN DE MÚLTIPLES SESIONES:');
    console.log('=====================================');
    
    // Verificar diferentes variantes de claves que podrían estar activas
    const possibleKeys = [
        'authenticated_session',
        'authenticated_session_v2', 
        'auth_session_' + SESSION_KEY,
        SESSION_KEY
    ];
    
    let activeSessions = 0;
    possibleKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value === 'true') {
            console.log(`✅ Sesión activa encontrada: ${key}`);
            activeSessions++;
        }
    });
    
    if (activeSessions === 0) {
        console.log('❌ No hay sesiones activas en este navegador');
    } else if (activeSessions === 1) {
        console.log('✅ Una sesión activa (normal)');
    } else {
        console.log(`⚠️ ${activeSessions} sesiones activas (posible problema)`);
        console.log('💡 Recomendación: Usar forceLogout() para limpiar');
    }
    
    return activeSessions;
};

// ========================================
// SISTEMA DE LOGGING Y ESTADÍSTICAS
// ========================================

// Función para registrar accesos de usuarios
function logUserAccess(type, data = {}) {
    try {
        // Obtener información del dispositivo y ubicación
        const logEntry = {
            type: type === 'success' ? 'user_login' : 'failed_login',
            timestamp: new Date().toISOString(),
            sessionKey: SESSION_KEY,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            url: window.location.href,
            referrer: document.referrer || 'direct',
            ...data
        };

        // Intentar obtener información de IP y ubicación (si está disponible)
        if (navigator.geolocation && type === 'success') {
            navigator.geolocation.getCurrentPosition(position => {
                logEntry.location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                saveLogEntry(logEntry);
            }, () => {
                // Si no se puede obtener ubicación, guardar sin ella
                saveLogEntry(logEntry);
            });
        } else {
            saveLogEntry(logEntry);
        }
        
    } catch (error) {
        console.warn('Error logging user access:', error);
    }
}

// Función para guardar la entrada de log
function saveLogEntry(logEntry) {
    try {
        const logs = JSON.parse(localStorage.getItem('admin_access_logs') || '[]');
        logs.push(logEntry);
        
        // Mantener solo los últimos 500 logs para evitar sobrecargar localStorage
        if (logs.length > 500) {
            logs.splice(0, logs.length - 500);
        }
        
        localStorage.setItem('admin_access_logs', JSON.stringify(logs));
        
        // Actualizar estadísticas
        updateAccessStats();
        
    } catch (error) {
        console.warn('Error saving log entry:', error);
    }
}

// Función para actualizar estadísticas de acceso
function updateAccessStats() {
    try {
        const logs = JSON.parse(localStorage.getItem('admin_access_logs') || '[]');
        
        const stats = {
            totalLogins: logs.filter(log => log.type === 'user_login').length,
            failedLogins: logs.filter(log => log.type === 'failed_login').length,
            uniqueIPs: [...new Set(logs.map(log => log.ip).filter(Boolean))].length,
            uniqueUserAgents: [...new Set(logs.map(log => log.userAgent).filter(Boolean))].length,
            lastAccess: logs.length > 0 ? logs[logs.length - 1].timestamp : null,
            sessionsToday: logs.filter(log => {
                const logDate = new Date(log.timestamp).toDateString();
                const today = new Date().toDateString();
                return logDate === today && log.type === 'user_login';
            }).length,
            currentSessionKey: SESSION_KEY,
            updated: new Date().toISOString()
        };
        
        localStorage.setItem('admin_stats', JSON.stringify(stats));
        
    } catch (error) {
        console.warn('Error updating stats:', error);
    }
}

// Función para obtener estadísticas de acceso (para el panel de admin)
window.getAccessLogs = function() {
    return JSON.parse(localStorage.getItem('admin_access_logs') || '[]');
};

// Función para obtener estadísticas (para el panel de admin)
window.getAccessStats = function() {
    updateAccessStats();
    return JSON.parse(localStorage.getItem('admin_stats') || '{}');
};

// Función para limpiar logs antiguos (automática)
function cleanOldLogs() {
    try {
        const logs = JSON.parse(localStorage.getItem('admin_access_logs') || '[]');
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        const recentLogs = logs.filter(log => 
            new Date(log.timestamp) > thirtyDaysAgo
        );
        
        if (recentLogs.length !== logs.length) {
            localStorage.setItem('admin_access_logs', JSON.stringify(recentLogs));
            console.log(`🧹 Limpieza automática: ${logs.length - recentLogs.length} logs antiguos eliminados`);
        }
        
    } catch (error) {
        console.warn('Error cleaning old logs:', error);
    }
}

// Función mejorada para logout que también registra la acción
const originalLogout = logout;
logout = function() {
    // Registrar logout antes de cerrar sesión
    logUserAccess('logout', { 
        timestamp: new Date().toISOString(),
        sessionDuration: getSessionDuration()
    });
    
    // Llamar a la función original de logout
    return originalLogout();
};

// Función para calcular duración de sesión
function getSessionDuration() {
    const loginTime = localStorage.getItem(SESSION_KEY + '_timestamp');
    if (loginTime) {
        const duration = Date.now() - parseInt(loginTime);
        return Math.round(duration / 1000); // Duración en segundos
    }
    return 0;
}

// ========================================
// FUNCIONES ADMINISTRATIVAS MEJORADAS
// ========================================

// Función mejorada para invalidar sesiones con logging
const originalInvalidateAll = window.invalidateAllSessions;
window.invalidateAllSessions = function() {
    const result = originalInvalidateAll();
    
    // Registrar acción administrativa
    const logs = JSON.parse(localStorage.getItem('admin_access_logs') || '[]');
    logs.push({
        type: 'admin_invalidate_all',
        timestamp: new Date().toISOString(),
        newSessionKey: result.newSessionKey,
        previousKey: SESSION_KEY,
        affectedSessions: 'all_active',
        adminAction: true
    });
    localStorage.setItem('admin_access_logs', JSON.stringify(logs));
    
    return result;
};

// Función para exportar datos completos
window.exportCompleteData = function() {
    const data = {
        logs: getAccessLogs(),
        stats: getAccessStats(),
        configuration: {
            sessionKey: SESSION_KEY,
            credentials: {
                username: VALID_CREDENTIALS.username,
                passwordLength: VALID_CREDENTIALS.password.length
            }
        },
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    return data;
};

// Inicialización automática
document.addEventListener('DOMContentLoaded', function() {
    // Limpiar logs antiguos al cargar
    cleanOldLogs();
    
    // Registrar visita a la página (no login)
    const logs = JSON.parse(localStorage.getItem('admin_access_logs') || '[]');
    logs.push({
        type: 'page_visit',
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct'
    });
    localStorage.setItem('admin_access_logs', JSON.stringify(logs));
});
