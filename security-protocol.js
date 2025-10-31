// 🚨 PROTOCOLO DE SEGURIDAD AVANZADO - AIZENTEK
// Este archivo implementa medidas de protección adicionales

(function() {
    'use strict';
    
    // 🔒 Anti-tampering protection
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    
    // 🕵️ Detección de intento de acceso no autorizado
    let failedAttempts = 0;
    const MAX_ATTEMPTS = 3;
    
    window.securityProtocol = {
        // 🚨 Registrar intento fallido
        registerFailedAttempt: function() {
            failedAttempts++;
            const timestamp = new Date().toISOString();
            
            // Registrar en localStorage para tracking
            const attempts = JSON.parse(localStorage.getItem('security_attempts') || '[]');
            attempts.push({
                timestamp: timestamp,
                ip: 'unknown',
                userAgent: navigator.userAgent,
                url: window.location.href
            });
            localStorage.setItem('security_attempts', JSON.stringify(attempts));
            
            if (failedAttempts >= MAX_ATTEMPTS) {
                this.lockdown();
            }
        },
        
        // 🔒 Bloqueo de emergencia
        lockdown: function() {
            // Limpiar todo
            localStorage.clear();
            sessionStorage.clear();
            
            // Redirigir a página de bloqueo
            document.body.innerHTML = `
                <div style="
                    position: fixed; top: 0; left: 0; 
                    width: 100%; height: 100%; 
                    background: #dc3545; color: white; 
                    display: flex; align-items: center; justify-content: center;
                    font-family: Arial, sans-serif; z-index: 99999;
                ">
                    <div style="text-align: center; padding: 40px;">
                        <h1>🚨 ACCESO BLOQUEADO</h1>
                        <p>Demasiados intentos fallidos detectados</p>
                        <p>Contacta al administrador: AIzentek</p>
                        <p><strong>Código de seguridad:</strong> SEC-${Date.now()}</p>
                    </div>
                </div>
            `;
            
            // Bloquear interacciones
            document.addEventListener('keydown', function(e) { e.preventDefault(); });
            document.addEventListener('click', function(e) { e.preventDefault(); });
            
            console.warn('🚨 SISTEMA BLOQUEADO POR SEGURIDAD');
        },
        
        // 🔍 Verificar integridad
        verifyIntegrity: function() {
            const currentTime = Date.now();
            const deployTime = 1697304000000; // Timestamp de deploy de seguridad
            
            if (currentTime < deployTime) {
                console.warn('🚨 Posible manipulación de tiempo detectada');
                return false;
            }
            
            return true;
        },
        
        // 📊 Obtener estadísticas de seguridad
        getSecurityStats: function() {
            const attempts = JSON.parse(localStorage.getItem('security_attempts') || '[]');
            return {
                totalAttempts: attempts.length,
                recentAttempts: attempts.filter(a => 
                    Date.now() - new Date(a.timestamp).getTime() < 3600000 // Última hora
                ).length,
                lastAttempt: attempts.length > 0 ? attempts[attempts.length - 1] : null
            };
        }
    };
    
    // 🚨 Activar protecciones al cargar
    if (!window.securityProtocol.verifyIntegrity()) {
        window.securityProtocol.lockdown();
    }
    
    // 🔒 Proteger contra modificaciones
    Object.freeze(window.securityProtocol);
    
    console.log('🛡️ Protocolo de seguridad activado');
})();