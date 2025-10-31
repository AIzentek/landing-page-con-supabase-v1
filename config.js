// Archivo de configuración para la landing page
// IMPORTANTE: Este archivo contiene configuraciones sensibles

const CONFIG = {
    // Credenciales de acceso - CAMBIAR ESTOS VALORES POR SEGURIDAD
    auth: {
        username: 'aizentekdemo',
        password: 'Demo12345!'
    },
    
    // Configuración del widget ElevenLabs
    elevenlabs: {
        agentId: 'agent_6501k7apm2zte7p8c3zzsmjddzsh',
        hidebranding: true
    },
    
    // Configuración de seguridad
    security: {
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
        maxLoginAttempts: 3,
        blockDevTools: true,
        blockRightClick: true
    },
    
    // Textos de la interfaz
    ui: {
        title: 'Acceso Seguro - Landing Page',
        loginTitle: 'Acceso Seguro',
        loginSubtitle: 'Ingresa tus credenciales para continuar',
        welcomeTitle: 'Bienvenido al Panel Principal',
        widgetTitle: 'Asistente Virtual',
        widgetDescription: 'Interactúa con nuestro asistente de IA conversacional',
        errorMessage: 'Credenciales incorrectas. Por favor, intenta nuevamente.',
        logoutConfirm: '¿Estás seguro de que quieres cerrar sesión?'
    }
};

// Función para obtener configuración
function getConfig(key) {
    const keys = key.split('.');
    let value = CONFIG;
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return null;
        }
    }
    
    return value;
}

// Función para actualizar configuración (solo si está autenticado)
function updateConfig(key, newValue) {
    if (localStorage.getItem('authenticated_session') !== 'true') {
        console.warn('No autorizado para cambiar configuración');
        return false;
    }
    
    const keys = key.split('.');
    let obj = CONFIG;
    
    for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in obj)) {
            obj[keys[i]] = {};
        }
        obj = obj[keys[i]];
    }
    
    obj[keys[keys.length - 1]] = newValue;
    console.log(`Configuración actualizada: ${key} = ${newValue}`);
    return true;
}

// Exportar configuración para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, getConfig, updateConfig };
}

