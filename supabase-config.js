// ========================================
// CONFIGURACIÓN DE SUPABASE
// ========================================

// 🔧 INSTRUCCIONES DE CONFIGURACIÓN:
// 1. Crea un proyecto en https://supabase.com
// 2. Ve a Project Settings > API
// 3. Copia tu Project URL y anon/public key
// 4. Reemplaza los valores aquí debajo
// 5. Ejecuta el script SQL en tu base de datos (ver supabase-schema.sql)

const SUPABASE_CONFIG = {
    // 🔗 URL de tu proyecto Supabase
    // Ejemplo: 'https://xyzcompany.supabase.co'
    url: 'TU_SUPABASE_URL_AQUI',
    
    // 🔑 Clave pública/anon de Supabase
    // Esta clave es segura para usar en el frontend
    anonKey: 'TU_SUPABASE_ANON_KEY_AQUI',
    
    // ⚙️ Configuración adicional
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    }
};

// ========================================
// INICIALIZACIÓN DEL CLIENTE SUPABASE
// ========================================

let supabaseClient = null;

function initializeSupabase() {
    try {
        // Verificar que Supabase esté cargado
        if (typeof supabase === 'undefined') {
            console.error('❌ Supabase library not loaded. Include the CDN script first.');
            return null;
        }
        
        // Verificar que la configuración esté completa
        if (SUPABASE_CONFIG.url === 'TU_SUPABASE_URL_AQUI' || 
            SUPABASE_CONFIG.anonKey === 'TU_SUPABASE_ANON_KEY_AQUI') {
            console.warn('⚠️ Supabase not configured. Please update supabase-config.js');
            return null;
        }
        
        // Crear cliente de Supabase
        supabaseClient = supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey,
            SUPABASE_CONFIG.options
        );
        
        console.log('✅ Supabase client initialized successfully');
        return supabaseClient;
        
    } catch (error) {
        console.error('❌ Error initializing Supabase:', error);
        return null;
    }
}

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

// Obtener cliente de Supabase (lazy initialization)
function getSupabaseClient() {
    if (!supabaseClient) {
        supabaseClient = initializeSupabase();
    }
    return supabaseClient;
}

// Verificar si Supabase está configurado
function isSupabaseConfigured() {
    return SUPABASE_CONFIG.url !== 'TU_SUPABASE_URL_AQUI' && 
           SUPABASE_CONFIG.anonKey !== 'TU_SUPABASE_ANON_KEY_AQUI';
}

// Verificar si Supabase está disponible
function isSupabaseAvailable() {
    return isSupabaseConfigured() && getSupabaseClient() !== null;
}

// ========================================
// EXPORTAR FUNCIONES
// ========================================

// Hacer disponibles las funciones globalmente
window.SupabaseConfig = {
    initialize: initializeSupabase,
    getClient: getSupabaseClient,
    isConfigured: isSupabaseConfigured,
    isAvailable: isSupabaseAvailable,
    config: SUPABASE_CONFIG
};

// Inicialización automática cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🔄 Initializing Supabase on DOM ready...');
        initializeSupabase();
    });
} else {
    console.log('🔄 Initializing Supabase immediately...');
    initializeSupabase();
}
