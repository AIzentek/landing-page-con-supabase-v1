-- ========================================
-- SCHEMA DE BASE DE DATOS PARA SUPABASE
-- Sistema de Tracking de Sesiones
-- ========================================

-- INSTRUCCIONES:
-- 1. Ve a tu proyecto en https://supabase.com
-- 2. Navega a SQL Editor
-- 3. Crea una nueva query
-- 4. Copia y pega este código completo
-- 5. Ejecuta el script
-- 6. Verifica que las tablas se crearon correctamente

-- ========================================
-- TABLA: session_logs
-- Registra todos los intentos de login y sesiones activas
-- ========================================

CREATE TABLE IF NOT EXISTS public.session_logs (
    -- Identificador único
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Información temporal
    login_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    logout_time TIMESTAMPTZ,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    session_duration INTEGER, -- Duración en segundos
    
    -- Estado de la sesión
    is_active BOOLEAN DEFAULT true,
    login_successful BOOLEAN NOT NULL,
    
    -- Información del usuario
    username VARCHAR(255),
    
    -- Información geográfica
    country VARCHAR(100),
    country_code VARCHAR(10),
    region VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone VARCHAR(100),
    
    -- Información del dispositivo
    user_agent TEXT,
    browser VARCHAR(100),
    browser_version VARCHAR(50),
    os VARCHAR(100),
    os_version VARCHAR(50),
    device_type VARCHAR(50), -- desktop, mobile, tablet
    device_vendor VARCHAR(100),
    device_model VARCHAR(100),
    
    -- Información de red
    ip_address INET,
    isp VARCHAR(255),
    
    -- Información de la sesión
    referrer TEXT,
    landing_page TEXT,
    screen_resolution VARCHAR(50),
    language VARCHAR(20),
    
    -- Métricas de interacción
    failed_attempts INTEGER DEFAULT 0,
    pages_visited INTEGER DEFAULT 1,
    
    -- Información de seguridad
    session_key VARCHAR(255),
    security_flags JSONB DEFAULT '{}',
    
    -- Datos adicionales (flexible)
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps automáticos
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ========================================

-- Índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_session_logs_login_time 
    ON public.session_logs(login_time DESC);

-- Índice para sesiones activas
CREATE INDEX IF NOT EXISTS idx_session_logs_is_active 
    ON public.session_logs(is_active) 
    WHERE is_active = true;

-- Índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_session_logs_username 
    ON public.session_logs(username);

-- Índice para búsquedas por IP
CREATE INDEX IF NOT EXISTS idx_session_logs_ip 
    ON public.session_logs(ip_address);

-- Índice para búsquedas por país
CREATE INDEX IF NOT EXISTS idx_session_logs_country 
    ON public.session_logs(country);

-- Índice para búsquedas por tipo de dispositivo
CREATE INDEX IF NOT EXISTS idx_session_logs_device_type 
    ON public.session_logs(device_type);

-- Índice compuesto para análisis de éxito/fallo
CREATE INDEX IF NOT EXISTS idx_session_logs_success_time 
    ON public.session_logs(login_successful, login_time DESC);

-- ========================================
-- FUNCIÓN: Actualizar timestamp automáticamente
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- TRIGGER: Actualizar updated_at en cada modificación
-- ========================================

DROP TRIGGER IF EXISTS update_session_logs_updated_at ON public.session_logs;

CREATE TRIGGER update_session_logs_updated_at
    BEFORE UPDATE ON public.session_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- FUNCIÓN: Calcular duración de sesión al hacer logout
-- ========================================

CREATE OR REPLACE FUNCTION calculate_session_duration()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se actualiza logout_time y no se ha calculado la duración
    IF NEW.logout_time IS NOT NULL AND OLD.logout_time IS NULL THEN
        NEW.session_duration = EXTRACT(EPOCH FROM (NEW.logout_time - NEW.login_time))::INTEGER;
        NEW.is_active = false;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- TRIGGER: Calcular duración al actualizar logout_time
-- ========================================

DROP TRIGGER IF EXISTS calculate_duration_on_logout ON public.session_logs;

CREATE TRIGGER calculate_duration_on_logout
    BEFORE UPDATE OF logout_time ON public.session_logs
    FOR EACH ROW
    EXECUTE FUNCTION calculate_session_duration();

-- ========================================
-- VISTA: Sesiones activas en tiempo real
-- ========================================

CREATE OR REPLACE VIEW active_sessions AS
SELECT 
    id,
    username,
    login_time,
    last_activity,
    EXTRACT(EPOCH FROM (NOW() - login_time))::INTEGER as current_duration,
    country,
    city,
    device_type,
    browser,
    ip_address
FROM public.session_logs
WHERE is_active = true
ORDER BY login_time DESC;

-- ========================================
-- VISTA: Estadísticas diarias
-- ========================================

CREATE OR REPLACE VIEW daily_stats AS
SELECT 
    DATE(login_time) as date,
    COUNT(*) as total_attempts,
    COUNT(*) FILTER (WHERE login_successful = true) as successful_logins,
    COUNT(*) FILTER (WHERE login_successful = false) as failed_logins,
    COUNT(DISTINCT ip_address) as unique_ips,
    COUNT(DISTINCT country) as unique_countries,
    AVG(session_duration) FILTER (WHERE session_duration IS NOT NULL) as avg_session_duration,
    MAX(session_duration) as max_session_duration
FROM public.session_logs
GROUP BY DATE(login_time)
ORDER BY date DESC;

-- ========================================
-- VISTA: Top países por logins
-- ========================================

CREATE OR REPLACE VIEW top_countries AS
SELECT 
    country,
    country_code,
    COUNT(*) as total_logins,
    COUNT(*) FILTER (WHERE login_successful = true) as successful_logins,
    COUNT(DISTINCT ip_address) as unique_ips
FROM public.session_logs
WHERE country IS NOT NULL
GROUP BY country, country_code
ORDER BY total_logins DESC;

-- ========================================
-- FUNCIÓN: Obtener sesiones activas con tiempo real
-- ========================================

CREATE OR REPLACE FUNCTION get_active_sessions_with_duration()
RETURNS TABLE (
    session_id UUID,
    username VARCHAR,
    login_time TIMESTAMPTZ,
    current_duration_seconds INTEGER,
    current_duration_formatted TEXT,
    location TEXT,
    device TEXT,
    last_seen TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sl.id,
        sl.username,
        sl.login_time,
        EXTRACT(EPOCH FROM (NOW() - sl.login_time))::INTEGER,
        TO_CHAR(NOW() - sl.login_time, 'HH24:MI:SS'),
        COALESCE(sl.city || ', ' || sl.country, sl.country, 'Unknown'),
        COALESCE(sl.device_type || ' - ' || sl.browser, sl.browser, 'Unknown'),
        sl.last_activity
    FROM public.session_logs sl
    WHERE sl.is_active = true
    ORDER BY sl.login_time DESC;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ========================================

-- Habilitar Row Level Security
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;

-- Política: Permitir INSERT a todos (usuarios anónimos pueden registrar sesiones)
CREATE POLICY "Allow anonymous insert" ON public.session_logs
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Política: Permitir UPDATE a todos (para actualizar last_activity y logout)
CREATE POLICY "Allow anonymous update" ON public.session_logs
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Política: Permitir SELECT a todos (para dashboard público)
-- NOTA: Si quieres restringir esto, cambia TO anon por TO authenticated
CREATE POLICY "Allow anonymous select" ON public.session_logs
    FOR SELECT
    TO anon
    USING (true);

-- ========================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ========================================

-- Descomentar para insertar datos de prueba
/*
INSERT INTO public.session_logs (
    username, 
    login_successful, 
    country, 
    city, 
    device_type, 
    browser,
    ip_address
) VALUES 
    ('aizentekdemo', true, 'United States', 'New York', 'desktop', 'Chrome', '192.168.1.1'),
    ('aizentekdemo', true, 'Mexico', 'Mexico City', 'mobile', 'Safari', '192.168.1.2'),
    ('testuser', false, 'Spain', 'Madrid', 'tablet', 'Firefox', '192.168.1.3');
*/

-- ========================================
-- VERIFICACIÓN FINAL
-- ========================================

-- Verificar que la tabla se creó correctamente
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'session_logs' 
ORDER BY ordinal_position;

-- Mensaje de éxito
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Schema creado exitosamente!';
    RAISE NOTICE '📊 Tabla: session_logs';
    RAISE NOTICE '📈 Vistas: active_sessions, daily_stats, top_countries';
    RAISE NOTICE '🔐 Políticas RLS habilitadas';
END $$;
