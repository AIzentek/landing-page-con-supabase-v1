// ========================================
// SISTEMA DE TRACKING DE SESIONES CON SUPABASE
// ========================================

class SupabaseSessionTracker {
    constructor() {
        this.currentSessionId = null;
        this.sessionStartTime = null;
        this.heartbeatInterval = null;
        this.ipInfo = null;
        this.deviceInfo = null;
        
        // Configuración
        this.config = {
            heartbeatIntervalMs: 30000, // 30 segundos
            ipInfoService: 'https://ipapi.co/json/', // Servicio gratuito de geolocalización
            enableHeartbeat: true,
            enableGeolocation: true
        };
        
        console.log('🚀 SupabaseSessionTracker initialized');
    }

    // ========================================
    // OBTENER INFORMACIÓN DEL DISPOSITIVO
    // ========================================
    
    async getDeviceInfo() {
        if (this.deviceInfo) {
            return this.deviceInfo;
        }
        
        const parser = new UAParser();
        const result = parser.getResult();
        
        this.deviceInfo = {
            user_agent: navigator.userAgent,
            browser: result.browser.name || 'Unknown',
            browser_version: result.browser.version || 'Unknown',
            os: result.os.name || 'Unknown',
            os_version: result.os.version || 'Unknown',
            device_type: this.getDeviceType(result),
            device_vendor: result.device.vendor || 'Unknown',
            device_model: result.device.model || 'Unknown',
            screen_resolution: `${screen.width}x${screen.height}`,
            language: navigator.language || navigator.userLanguage
        };
        
        return this.deviceInfo;
    }
    
    getDeviceType(parserResult) {
        if (parserResult.device.type === 'mobile') return 'mobile';
        if (parserResult.device.type === 'tablet') return 'tablet';
        return 'desktop';
    }

    // ========================================
    // OBTENER INFORMACIÓN DE GEOLOCALIZACIÓN
    // ========================================
    
    async getIPInfo() {
        if (this.ipInfo) {
            return this.ipInfo;
        }
        
        try {
            const response = await fetch(this.config.ipInfoService);
            if (!response.ok) throw new Error('IP info service failed');
            
            const data = await response.json();
            
            this.ipInfo = {
                ip_address: data.ip || null,
                country: data.country_name || null,
                country_code: data.country_code || null,
                region: data.region || null,
                city: data.city || null,
                latitude: data.latitude || null,
                longitude: data.longitude || null,
                timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                isp: data.org || null
            };
            
            console.log('📍 IP Info retrieved:', this.ipInfo);
            return this.ipInfo;
            
        } catch (error) {
            console.warn('⚠️ Could not retrieve IP info:', error);
            
            // Fallback: solo timezone
            return {
                ip_address: null,
                country: null,
                country_code: null,
                region: null,
                city: null,
                latitude: null,
                longitude: null,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                isp: null
            };
        }
    }

    // ========================================
    // REGISTRAR INICIO DE SESIÓN
    // ========================================
    
    async trackLogin(username, isSuccessful = true, failedAttempts = 0) {
        try {
            const supabase = window.SupabaseConfig?.getClient();
            if (!supabase) {
                console.warn('⚠️ Supabase not available, skipping session tracking');
                return null;
            }
            
            // Obtener información del dispositivo y ubicación
            const [deviceInfo, ipInfo] = await Promise.all([
                this.getDeviceInfo(),
                this.getIPInfo()
            ]);
            
            // Preparar datos de la sesión
            const sessionData = {
                login_time: new Date().toISOString(),
                login_successful: isSuccessful,
                is_active: isSuccessful, // Solo marcar activo si login fue exitoso
                username: username,
                
                // Información geográfica
                ...ipInfo,
                
                // Información del dispositivo
                ...deviceInfo,
                
                // Información de la página
                referrer: document.referrer || 'direct',
                landing_page: window.location.href,
                
                // Métricas
                failed_attempts: failedAttempts,
                pages_visited: 1,
                
                // Seguridad
                session_key: this.generateSessionKey(),
                
                // Metadata adicional
                metadata: {
                    screen_width: screen.width,
                    screen_height: screen.height,
                    viewport_width: window.innerWidth,
                    viewport_height: window.innerHeight,
                    color_depth: screen.colorDepth,
                    pixel_ratio: window.devicePixelRatio || 1,
                    touch_support: 'ontouchstart' in window,
                    connection_type: navigator.connection?.effectiveType || 'unknown',
                    online: navigator.onLine
                }
            };
            
            // Insertar en Supabase
            const { data, error } = await supabase
                .from('session_logs')
                .insert([sessionData])
                .select()
                .single();
            
            if (error) {
                console.error('❌ Error tracking login:', error);
                return null;
            }
            
            console.log('✅ Login tracked successfully:', data);
            
            // Si el login fue exitoso, guardar el ID de sesión e iniciar heartbeat
            if (isSuccessful) {
                this.currentSessionId = data.id;
                this.sessionStartTime = new Date();
                
                if (this.config.enableHeartbeat) {
                    this.startHeartbeat();
                }
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error in trackLogin:', error);
            return null;
        }
    }

    // ========================================
    // ACTUALIZAR ACTIVIDAD (HEARTBEAT)
    // ========================================
    
    async updateActivity() {
        if (!this.currentSessionId) {
            console.warn('⚠️ No active session to update');
            return;
        }
        
        try {
            const supabase = window.SupabaseConfig?.getClient();
            if (!supabase) return;
            
            const { error } = await supabase
                .from('session_logs')
                .update({ 
                    last_activity: new Date().toISOString(),
                    metadata: {
                        ...this.deviceInfo?.metadata,
                        last_heartbeat: new Date().toISOString()
                    }
                })
                .eq('id', this.currentSessionId);
            
            if (error) {
                console.error('❌ Error updating activity:', error);
            } else {
                console.log('💓 Heartbeat sent');
            }
            
        } catch (error) {
            console.error('❌ Error in updateActivity:', error);
        }
    }

    // ========================================
    // INICIAR HEARTBEAT AUTOMÁTICO
    // ========================================
    
    startHeartbeat() {
        // Limpiar heartbeat anterior si existe
        this.stopHeartbeat();
        
        console.log(`💓 Starting heartbeat (interval: ${this.config.heartbeatIntervalMs}ms)`);
        
        this.heartbeatInterval = setInterval(() => {
            this.updateActivity();
        }, this.config.heartbeatIntervalMs);
        
        // También actualizar en eventos de interacción
        ['click', 'scroll', 'keypress', 'mousemove'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                if (!this.lastInteraction || Date.now() - this.lastInteraction > 5000) {
                    this.lastInteraction = Date.now();
                    this.updateActivity();
                }
            }, { passive: true, once: false });
        });
    }

    // ========================================
    // DETENER HEARTBEAT
    // ========================================
    
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
            console.log('💤 Heartbeat stopped');
        }
    }

    // ========================================
    // REGISTRAR LOGOUT
    // ========================================
    
    async trackLogout() {
        if (!this.currentSessionId) {
            console.warn('⚠️ No active session to logout');
            return;
        }
        
        try {
            const supabase = window.SupabaseConfig?.getClient();
            if (!supabase) return;
            
            // Detener heartbeat
            this.stopHeartbeat();
            
            // Calcular duración
            const duration = this.sessionStartTime 
                ? Math.floor((Date.now() - this.sessionStartTime.getTime()) / 1000)
                : 0;
            
            // Actualizar sesión
            const { error } = await supabase
                .from('session_logs')
                .update({
                    logout_time: new Date().toISOString(),
                    is_active: false,
                    session_duration: duration,
                    last_activity: new Date().toISOString()
                })
                .eq('id', this.currentSessionId);
            
            if (error) {
                console.error('❌ Error tracking logout:', error);
            } else {
                console.log('✅ Logout tracked successfully');
            }
            
            // Limpiar estado
            this.currentSessionId = null;
            this.sessionStartTime = null;
            
        } catch (error) {
            console.error('❌ Error in trackLogout:', error);
        }
    }

    // ========================================
    // REGISTRAR INTENTO FALLIDO
    // ========================================
    
    async trackFailedAttempt(username, attemptNumber = 1) {
        return await this.trackLogin(username, false, attemptNumber);
    }

    // ========================================
    // OBTENER SESIONES ACTIVAS
    // ========================================
    
    async getActiveSessions() {
        try {
            const supabase = window.SupabaseConfig?.getClient();
            if (!supabase) return [];
            
            const { data, error } = await supabase
                .from('session_logs')
                .select('*')
                .eq('is_active', true)
                .order('login_time', { ascending: false });
            
            if (error) {
                console.error('❌ Error getting active sessions:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('❌ Error in getActiveSessions:', error);
            return [];
        }
    }

    // ========================================
    // OBTENER ESTADÍSTICAS
    // ========================================
    
    async getStats(days = 7) {
        try {
            const supabase = window.SupabaseConfig?.getClient();
            if (!supabase) return null;
            
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            
            const { data, error } = await supabase
                .from('session_logs')
                .select('*')
                .gte('login_time', startDate.toISOString());
            
            if (error) {
                console.error('❌ Error getting stats:', error);
                return null;
            }
            
            // Calcular estadísticas
            const stats = {
                total_logins: data.length,
                successful_logins: data.filter(s => s.login_successful).length,
                failed_logins: data.filter(s => !s.login_successful).length,
                unique_users: [...new Set(data.map(s => s.username))].length,
                unique_ips: [...new Set(data.map(s => s.ip_address).filter(Boolean))].length,
                unique_countries: [...new Set(data.map(s => s.country).filter(Boolean))].length,
                avg_session_duration: this.calculateAverage(
                    data.filter(s => s.session_duration).map(s => s.session_duration)
                ),
                top_countries: this.getTopItems(data.map(s => s.country).filter(Boolean)),
                top_devices: this.getTopItems(data.map(s => s.device_type).filter(Boolean)),
                top_browsers: this.getTopItems(data.map(s => s.browser).filter(Boolean))
            };
            
            return stats;
            
        } catch (error) {
            console.error('❌ Error in getStats:', error);
            return null;
        }
    }

    // ========================================
    // UTILIDADES
    // ========================================
    
    generateSessionKey() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    calculateAverage(numbers) {
        if (!numbers || numbers.length === 0) return 0;
        return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);
    }
    
    getTopItems(items, limit = 5) {
        const counts = {};
        items.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });
        
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([name, count]) => ({ name, count }));
    }

    // ========================================
    // CLEANUP AL CERRAR VENTANA
    // ========================================
    
    setupCleanup() {
        // Registrar logout cuando se cierra la ventana
        window.addEventListener('beforeunload', () => {
            if (this.currentSessionId) {
                // Usar sendBeacon para enviar datos incluso cuando se cierra la ventana
                const supabase = window.SupabaseConfig?.getClient();
                if (supabase) {
                    this.trackLogout();
                }
            }
        });
        
        // También manejar cuando la página pierde visibilidad
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.updateActivity();
            }
        });
    }
}

// ========================================
// INICIALIZACIÓN GLOBAL
// ========================================

// Crear instancia global
window.sessionTracker = new SupabaseSessionTracker();

// Setup cleanup handlers
window.sessionTracker.setupCleanup();

console.log('✅ Supabase Session Tracker ready');
