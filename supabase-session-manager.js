// ========================================
// SUPABASE SESSION MANAGER - SISTEMA CENTRALIZADO
// ========================================
// Este sistema resuelve TODAS las limitaciones de localStorage:
// ✅ Nuclear logout 100% funcional entre todos los dispositivos
// ✅ Monitoreo en tiempo real de usuarios conectados
// ✅ Logs centralizados de todas las conexiones
// ✅ Detección de usuarios activos desde cualquier ubicación

class SupabaseSessionManager {
    constructor() {
        // Configuración de Supabase
        this.supabaseUrl = 'YOUR_SUPABASE_URL';
        this.supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
        this.supabase = null;
        
        // Configuración local
        this.sessionKey = 'lapzodemo_session_aizentek1988';
        this.deviceId = this.generateDeviceId();
        this.heartbeatInterval = null;
        this.nuclearCheckInterval = null;
        
        // Estado actual
        this.isConnected = false;
        this.currentSession = null;
        
        this.init();
    }
    
    async init() {
        // Importar Supabase client
        await this.loadSupabaseClient();
        
        // Inicializar cliente Supabase
        const { createClient } = supabase;
        this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
        
        // Configurar listeners para logout nuclear
        this.setupNuclearLogoutListener();
        
        // Configurar heartbeat para usuarios activos
        this.startHeartbeat();
        
        console.log('🚀 Supabase Session Manager inicializado');
    }
    
    async loadSupabaseClient() {
        // Cargar cliente de Supabase desde CDN
        if (typeof supabase === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@supabase/supabase-js@2';
            document.head.appendChild(script);
            
            return new Promise((resolve) => {
                script.onload = resolve;
            });
        }
    }
    
    generateDeviceId() {
        // Generar ID único para cada dispositivo
        let deviceId = localStorage.getItem('device_id');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('device_id', deviceId);
        }
        return deviceId;
    }
    
    // ========================================
    // GESTIÓN DE SESIONES CENTRALIZADAS
    // ========================================
    
    async login(username, password, userInfo = {}) {
        try {
            console.log('🔐 Iniciando login con Supabase...');
            
            // Validar credenciales (mantienes tu lógica actual)
            if (username !== 'lapzodemo' || password !== 'Lapzodemo!') {
                await this.logFailedAttempt(username, userInfo);
                return false;
            }
            
            // Crear sesión en Supabase
            const sessionData = {
                username: username,
                device_id: this.deviceId,
                device_info: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language,
                    screen: `${screen.width}x${screen.height}`,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    ...userInfo
                },
                ip_address: await this.getClientIP(),
                login_time: new Date().toISOString(),
                last_heartbeat: new Date().toISOString(),
                status: 'active',
                session_key: this.sessionKey
            };
            
            const { data, error } = await this.supabase
                .from('user_sessions')
                .insert([sessionData]);
                
            if (error) {
                console.error('Error creando sesión:', error);
                return false;
            }
            
            // Guardar sesión localmente también
            localStorage.setItem(this.sessionKey, 'true');
            localStorage.setItem(this.sessionKey + '_timestamp', Date.now().toString());
            
            this.currentSession = sessionData;
            this.isConnected = true;
            
            console.log('✅ Login exitoso - Sesión creada en Supabase');
            return true;
            
        } catch (error) {
            console.error('Error en login:', error);
            return false;
        }
    }
    
    async logFailedAttempt(username, userInfo = {}) {
        try {
            const failedAttempt = {
                username: username || 'empty',
                device_id: this.deviceId,
                device_info: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    ...userInfo
                },
                ip_address: await this.getClientIP(),
                attempt_time: new Date().toISOString(),
                status: 'failed',
                reason: 'invalid_credentials'
            };
            
            await this.supabase
                .from('login_attempts')
                .insert([failedAttempt]);
                
        } catch (error) {
            console.error('Error logging failed attempt:', error);
        }
    }
    
    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }
    
    // ========================================
    // NUCLEAR LOGOUT - 100% FUNCIONAL
    // ========================================
    
    async nuclearLogoutAll() {
        try {
            console.log('💥 INICIANDO NUCLEAR LOGOUT GLOBAL...');
            
            // 1. Marcar TODAS las sesiones como expulsadas
            const { error: updateError } = await this.supabase
                .from('user_sessions')
                .update({ 
                    status: 'nuclear_logout',
                    logout_time: new Date().toISOString(),
                    logout_reason: 'admin_nuclear_expulsion'
                })
                .eq('status', 'active');
                
            if (updateError) {
                console.error('Error en nuclear logout:', updateError);
                return false;
            }
            
            // 2. Crear evento de nuclear logout
            const nuclearEvent = {
                event_type: 'nuclear_logout_all',
                admin_device: this.deviceId,
                timestamp: new Date().toISOString(),
                affected_sessions: 'all_active'
            };
            
            await this.supabase
                .from('admin_events')
                .insert([nuclearEvent]);
            
            // 3. Limpiar sesión local
            localStorage.clear();
            sessionStorage.clear();
            
            console.log('💥 NUCLEAR LOGOUT COMPLETADO - Todos los usuarios expulsados');
            return true;
            
        } catch (error) {
            console.error('Error en nuclear logout:', error);
            return false;
        }
    }
    
    setupNuclearLogoutListener() {
        // Verificar cada segundo si ha sido expulsado
        this.nuclearCheckInterval = setInterval(async () => {
            if (!this.isConnected) return;
            
            try {
                // Verificar si esta sesión ha sido marcada para logout
                const { data, error } = await this.supabase
                    .from('user_sessions')
                    .select('*')
                    .eq('device_id', this.deviceId)
                    .eq('session_key', this.sessionKey)
                    .order('login_time', { ascending: false })
                    .limit(1);
                    
                if (data && data.length > 0) {
                    const session = data[0];
                    
                    if (session.status === 'nuclear_logout' || session.status === 'admin_expelled') {
                        console.log('💥 NUCLEAR LOGOUT DETECTADO - Expulsando usuario...');
                        
                        // EXPULSIÓN INMEDIATA
                        document.body.innerHTML = `
                            <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;
                                       background:#ff0000;color:white;display:flex;align-items:center;
                                       justify-content:center;font-family:Arial;text-align:center;z-index:999999999;">
                                <div>
                                    <h1 style="font-size:48px;">🚨 EXPULSADO POR ADMIN</h1>
                                    <p style="font-size:24px;">Sesión terminada remotamente</p>
                                    <p style="font-size:16px;">Redirigiendo en 3 segundos...</p>
                                </div>
                            </div>
                        `;
                        
                        // Limpiar todo y recargar
                        localStorage.clear();
                        sessionStorage.clear();
                        this.isConnected = false;
                        
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    }
                }
                
            } catch (error) {
                console.error('Error verificando nuclear logout:', error);
            }
        }, 1000); // Cada segundo - ULTRA RÁPIDO
    }
    
    // ========================================
    // MONITOREO EN TIEMPO REAL
    // ========================================
    
    startHeartbeat() {
        // Enviar heartbeat cada 30 segundos
        this.heartbeatInterval = setInterval(async () => {
            if (!this.isConnected) return;
            
            try {
                await this.supabase
                    .from('user_sessions')
                    .update({ 
                        last_heartbeat: new Date().toISOString(),
                        status: 'active'
                    })
                    .eq('device_id', this.deviceId)
                    .eq('session_key', this.sessionKey);
                    
            } catch (error) {
                console.error('Error enviando heartbeat:', error);
            }
        }, 30000);
    }
    
    async getActiveUsers() {
        try {
            // Usuarios activos en los últimos 2 minutos
            const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
            
            const { data, error } = await this.supabase
                .from('user_sessions')
                .select('*')
                .eq('status', 'active')
                .gt('last_heartbeat', twoMinutesAgo)
                .order('last_heartbeat', { ascending: false });
                
            if (error) {
                console.error('Error obteniendo usuarios activos:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('Error en getActiveUsers:', error);
            return [];
        }
    }
    
    async getAllSessions(limit = 50) {
        try {
            const { data, error } = await this.supabase
                .from('user_sessions')
                .select('*')
                .order('login_time', { ascending: false })
                .limit(limit);
                
            if (error) {
                console.error('Error obteniendo sesiones:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('Error en getAllSessions:', error);
            return [];
        }
    }
    
    async getFailedAttempts(limit = 100) {
        try {
            const { data, error } = await this.supabase
                .from('login_attempts')
                .select('*')
                .eq('status', 'failed')
                .order('attempt_time', { ascending: false })
                .limit(limit);
                
            return data || [];
            
        } catch (error) {
            console.error('Error obteniendo intentos fallidos:', error);
            return [];
        }
    }
    
    // ========================================
    // ADMINISTRACIÓN Y LIMPIEZA
    // ========================================
    
    async logout() {
        try {
            if (this.isConnected) {
                // Marcar sesión como cerrada
                await this.supabase
                    .from('user_sessions')
                    .update({ 
                        status: 'logged_out',
                        logout_time: new Date().toISOString(),
                        logout_reason: 'user_logout'
                    })
                    .eq('device_id', this.deviceId)
                    .eq('session_key', this.sessionKey);
            }
            
            // Limpiar local
            localStorage.removeItem(this.sessionKey);
            this.isConnected = false;
            
            // Detener intervals
            if (this.heartbeatInterval) {
                clearInterval(this.heartbeatInterval);
            }
            if (this.nuclearCheckInterval) {
                clearInterval(this.nuclearCheckInterval);
            }
            
        } catch (error) {
            console.error('Error en logout:', error);
        }
    }
    
    async expelSpecificUser(deviceId) {
        try {
            const { error } = await this.supabase
                .from('user_sessions')
                .update({ 
                    status: 'admin_expelled',
                    logout_time: new Date().toISOString(),
                    logout_reason: 'admin_expulsion'
                })
                .eq('device_id', deviceId)
                .eq('status', 'active');
                
            return !error;
            
        } catch (error) {
            console.error('Error expulsando usuario:', error);
            return false;
        }
    }
    
    async cleanOldSessions(daysOld = 7) {
        try {
            const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).toISOString();
            
            await this.supabase
                .from('user_sessions')
                .delete()
                .lt('login_time', cutoffDate);
                
            await this.supabase
                .from('login_attempts')
                .delete()
                .lt('attempt_time', cutoffDate);
                
            console.log(`🧹 Limpieza completada: sesiones más antigas de ${daysOld} días eliminadas`);
            
        } catch (error) {
            console.error('Error en limpieza:', error);
        }
    }
}

// ========================================
// INICIALIZACIÓN GLOBAL
// ========================================

// Instancia global del session manager
window.SupabaseSessionManager = SupabaseSessionManager;
window.sessionManager = null;

// Función para inicializar con credenciales de Supabase
window.initSupabaseSessionManager = function(supabaseUrl, supabaseKey) {
    window.sessionManager = new SupabaseSessionManager();
    window.sessionManager.supabaseUrl = supabaseUrl;
    window.sessionManager.supabaseKey = supabaseKey;
    window.sessionManager.init();
    
    console.log('🚀 Supabase Session Manager configurado');
    return window.sessionManager;
};

// Funciones de conveniencia para el dashboard
window.supabaseLogin = async function(username, password, userInfo = {}) {
    if (!window.sessionManager) {
        console.error('❌ Session Manager no inicializado. Usar initSupabaseSessionManager() primero');
        return false;
    }
    return await window.sessionManager.login(username, password, userInfo);
};

window.supabaseNuclearLogout = async function() {
    if (!window.sessionManager) {
        console.error('❌ Session Manager no inicializado');
        return false;
    }
    return await window.sessionManager.nuclearLogoutAll();
};

window.getSupabaseActiveUsers = async function() {
    if (!window.sessionManager) {
        console.error('❌ Session Manager no inicializado');
        return [];
    }
    return await window.sessionManager.getActiveUsers();
};

window.getAllSupabaseSessions = async function(limit = 50) {
    if (!window.sessionManager) {
        console.error('❌ Session Manager no inicializado');
        return [];
    }
    return await window.sessionManager.getAllSessions(limit);
};

window.getSupabaseFailedAttempts = async function(limit = 100) {
    if (!window.sessionManager) {
        console.error('❌ Session Manager no inicializado');
        return [];
    }
    return await window.sessionManager.getFailedAttempts(limit);
};

console.log('📦 Supabase Session Manager cargado - Listo para inicializar');