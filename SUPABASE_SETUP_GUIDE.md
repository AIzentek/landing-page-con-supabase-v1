# 🚀 Guía Completa de Configuración - Supabase Session Tracking

Esta guía te llevará paso a paso para configurar el sistema de tracking de sesiones con Supabase.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Paso 1: Crear Proyecto en Supabase](#paso-1-crear-proyecto-en-supabase)
3. [Paso 2: Configurar Base de Datos](#paso-2-configurar-base-de-datos)
4. [Paso 3: Configurar el Proyecto](#paso-3-configurar-el-proyecto)
5. [Paso 4: Verificar Funcionamiento](#paso-4-verificar-funcionamiento)
6. [Datos que se Registran](#datos-que-se-registran)
7. [Dashboard de Visualización](#dashboard-de-visualización)
8. [Solución de Problemas](#solución-de-problemas)

---

## ✅ Requisitos Previos

- Una cuenta en [Supabase](https://supabase.com) (gratuita)
- Acceso al código del proyecto
- Un navegador web moderno

---

## 📝 Paso 1: Crear Proyecto en Supabase

### 1.1 Crear Cuenta y Proyecto

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"**
3. Regístrate con tu email o GitHub
4. Una vez dentro, haz clic en **"New project"**

### 1.2 Configurar Proyecto

Complete los siguientes campos:

- **Organization**: Selecciona o crea una organización
- **Project Name**: `landing-page-sessions` (o el nombre que prefieras)
- **Database Password**: Genera una contraseña fuerte (¡guárdala!)
- **Region**: Selecciona la región más cercana a tus usuarios
- **Pricing Plan**: Free (gratuito) es suficiente para empezar

5. Haz clic en **"Create new project"**
6. Espera 2-3 minutos mientras Supabase crea tu base de datos

---

## 🗄️ Paso 2: Configurar Base de Datos

### 2.1 Acceder al SQL Editor

1. En tu proyecto de Supabase, ve al menú lateral
2. Haz clic en **"SQL Editor"** (icono de código)
3. Haz clic en **"New query"**

### 2.2 Ejecutar el Schema

1. Abre el archivo `supabase-schema.sql` de este proyecto
2. Copia **TODO** el contenido del archivo
3. Pega el contenido en el SQL Editor de Supabase
4. Haz clic en **"Run"** (▶️) o presiona `Ctrl + Enter`

### 2.3 Verificar que se Creó Correctamente

Deberías ver:
```
✅ Schema creado exitosamente!
📊 Tabla: session_logs
📈 Vistas: active_sessions, daily_stats, top_countries
🔐 Políticas RLS habilitadas
```

Para verificar visualmente:
1. Ve a **"Table Editor"** en el menú lateral
2. Deberías ver la tabla **"session_logs"**
3. Haz clic en ella para ver su estructura

---

## ⚙️ Paso 3: Configurar el Proyecto

### 3.1 Obtener Credenciales de Supabase

1. En tu proyecto de Supabase, ve a **"Settings"** (⚙️) en el menú lateral
2. Haz clic en **"API"** en el submenú
3. Encontrarás dos valores importantes:

   - **Project URL**: `https://xxxxxxxxxxx.supabase.co`
   - **anon public key**: Una clave larga que empieza con `eyJ...`

4. **Copia estos valores** (los necesitarás en el siguiente paso)

### 3.2 Configurar el Archivo supabase-config.js

1. Abre el archivo `supabase-config.js` en tu editor de código
2. Encuentra estas líneas:

```javascript
const SUPABASE_CONFIG = {
    url: 'TU_SUPABASE_URL_AQUI',
    anonKey: 'TU_SUPABASE_ANON_KEY_AQUI',
    // ...
```

3. Reemplaza los valores:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://tuproyecto.supabase.co', // ← Tu Project URL aquí
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // ← Tu anon key aquí
    // ...
```

4. Guarda el archivo

### 3.3 Subir Cambios a GitHub

```bash
cd /home/user/webapp/landing-page-con-supabase-v1
git add supabase-config.js
git commit -m "feat: Configure Supabase credentials"
git push origin main
```

---

## ✅ Paso 4: Verificar Funcionamiento

### 4.1 Probar el Login

1. Abre tu landing page en el navegador
2. Intenta hacer login con las credenciales correctas
3. Abre la consola del navegador (F12)
4. Deberías ver mensajes como:
   ```
   ✅ Supabase client initialized successfully
   📍 IP Info retrieved: {...}
   ✅ Login tracked successfully
   💓 Heartbeat sent
   ```

### 4.2 Verificar en Supabase

1. Ve a tu proyecto en Supabase
2. Navega a **"Table Editor"**
3. Selecciona la tabla **"session_logs"**
4. Deberías ver tu sesión registrada con todos los datos

### 4.3 Ver el Dashboard

1. Abre `supabase-dashboard.html` en tu navegador
2. Deberías ver:
   - Estadísticas de sesiones
   - Sesiones activas en tiempo real
   - Historial reciente

---

## 📊 Datos que se Registran

### 🕒 Información Temporal
- **Día y hora de login** (login_time)
- **Última actividad** (last_activity) - Se actualiza cada 30 segundos
- **Hora de logout** (logout_time)
- **Duración de la sesión** (session_duration en segundos)

### 🌍 Información Geográfica
- **País** (country)
- **Código de país** (country_code)
- **Región/Estado** (region)
- **Ciudad** (city)
- **Latitud y Longitud** (latitude, longitude)
- **Zona horaria** (timezone)

### 💻 Información del Dispositivo
- **User Agent completo** (user_agent)
- **Navegador y versión** (browser, browser_version)
- **Sistema operativo** (os, os_version)
- **Tipo de dispositivo** (device_type: desktop, mobile, tablet)
- **Fabricante y modelo** (device_vendor, device_model)
- **Resolución de pantalla** (screen_resolution)
- **Idioma del navegador** (language)

### 🌐 Información de Red
- **Dirección IP** (ip_address)
- **Proveedor de Internet** (isp)

### 📈 Métricas de Interacción
- **Estado de conexión** (is_active: true/false)
- **Login exitoso o fallido** (login_successful)
- **Número de intentos fallidos** (failed_attempts)
- **Páginas visitadas** (pages_visited)

### 🔒 Información de Seguridad
- **Referrer** (de dónde viene el usuario)
- **Página de entrada** (landing_page)
- **Clave de sesión** (session_key)
- **Flags de seguridad** (security_flags)
- **Metadata adicional** (metadata en formato JSON)

---

## 📊 Dashboard de Visualización

### Características del Dashboard

El dashboard (`supabase-dashboard.html`) muestra:

#### 📈 Estadísticas Generales:
- Sesiones activas en tiempo real
- Total de logins exitosos (últimos 7 días)
- Total de intentos fallidos (últimos 7 días)
- Países únicos
- Duración promedio de sesiones
- Usuarios únicos

#### 🔴 Sesiones Activas:
- Lista de todas las sesiones actualmente activas
- Ubicación de cada usuario
- Tipo de dispositivo y navegador
- Duración en tiempo real (se actualiza automáticamente)
- Auto-refresh cada 10 segundos (configurable)

#### 📋 Historial Reciente:
- Últimas 50 sesiones (activas e inactivas)
- Filtrado entre exitosas y fallidas
- Información completa de cada sesión

### Acceder al Dashboard

**Opción 1: Localmente**
```bash
# Abre el archivo directamente
open supabase-dashboard.html
# o
python3 -m http.server 8000
# Luego ve a: http://localhost:8000/supabase-dashboard.html
```

**Opción 2: En GitHub Pages**
```
https://tuusuario.github.io/landing-page-con-supabase-v1/supabase-dashboard.html
```

---

## 🔍 Consultas Útiles en Supabase

### Ver sesiones activas ahora mismo:
```sql
SELECT * FROM active_sessions;
```

### Estadísticas del día de hoy:
```sql
SELECT * FROM daily_stats 
WHERE date = CURRENT_DATE;
```

### Top países por logins:
```sql
SELECT * FROM top_countries 
LIMIT 10;
```

### Sesiones de las últimas 24 horas:
```sql
SELECT 
    username,
    country,
    city,
    device_type,
    browser,
    login_time,
    session_duration
FROM session_logs
WHERE login_time > NOW() - INTERVAL '24 hours'
ORDER BY login_time DESC;
```

### Intentos fallidos de login:
```sql
SELECT 
    username,
    ip_address,
    country,
    login_time
FROM session_logs
WHERE login_successful = false
ORDER BY login_time DESC
LIMIT 20;
```

---

## 🛠️ Solución de Problemas

### ❌ Error: "Supabase not configured"

**Causa**: Las credenciales no están configuradas en `supabase-config.js`

**Solución**:
1. Verifica que hayas reemplazado `TU_SUPABASE_URL_AQUI` y `TU_SUPABASE_ANON_KEY_AQUI`
2. Asegúrate de haber guardado el archivo
3. Recarga la página en el navegador

### ❌ Error: "relation 'session_logs' does not exist"

**Causa**: No se ejecutó el schema SQL en Supabase

**Solución**:
1. Ve al SQL Editor en Supabase
2. Ejecuta el contenido completo de `supabase-schema.sql`
3. Verifica que no haya errores en la ejecución

### ❌ No se registran sesiones

**Causa**: Posiblemente un problema de CORS o RLS policies

**Solución**:
1. Ve a **Authentication > Policies** en Supabase
2. Verifica que las políticas "Allow anonymous insert" y "Allow anonymous select" estén activas
3. Si no existen, ejecútalas manualmente desde el SQL Editor

### ❌ Dashboard no muestra datos

**Causa**: Configuración de Supabase o falta de datos

**Solución**:
1. Verifica que `supabase-config.js` esté correctamente configurado
2. Abre la consola del navegador para ver errores
3. Verifica que haya al menos una sesión registrada en la base de datos

### ⚠️ Información geográfica no aparece

**Causa**: El servicio de geolocalización (ipapi.co) puede tener límites de tasa

**Solución**:
- El servicio gratuito tiene límite de 1000 requests/día
- Si necesitas más, considera usar un servicio pago o alternativo
- La aplicación funcionará normalmente sin esta info, solo aparecerá como "Desconocido"

---

## 🚀 Próximos Pasos Recomendados

### 1. Configurar GitHub Pages

Si aún no lo has hecho:

```bash
# En la configuración del repositorio en GitHub
# Ve a Settings > Pages
# Source: Deploy from a branch
# Branch: main / (root)
# Save
```

Tu dashboard estará en:
```
https://tuusuario.github.io/landing-page-con-supabase-v1/supabase-dashboard.html
```

### 2. Agregar más métricas

El sistema está diseñado para ser extensible. Puedes agregar:
- Tracking de eventos específicos
- Análisis de conversión
- Heatmaps de interacción
- Alertas por actividad sospechosa

### 3. Exportar datos

Desde Supabase puedes:
- Exportar a CSV para análisis en Excel
- Conectar con herramientas de BI (Tableau, Power BI)
- Crear backups automáticos

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [SQL Tutorial](https://supabase.com/docs/guides/database/overview)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 💡 Consejos de Seguridad

1. **Nunca** compartas tu `service_role` key públicamente
2. La `anon` key es segura para uso en el frontend
3. Las políticas RLS protegen tus datos automáticamente
4. Revisa regularmente los logs para detectar actividad sospechosa
5. Considera agregar autenticación adicional para el dashboard

---

## ✅ Checklist Final

Antes de considerar la configuración completa, verifica:

- [ ] Proyecto creado en Supabase
- [ ] Schema SQL ejecutado correctamente
- [ ] Credenciales configuradas en `supabase-config.js`
- [ ] Cambios subidos a GitHub
- [ ] Login registra sesión correctamente
- [ ] Dashboard muestra datos
- [ ] Auto-refresh funciona
- [ ] GitHub Pages configurado (opcional)

---

## 🎉 ¡Todo Listo!

Si completaste todos los pasos, ¡felicidades! Ahora tienes un sistema completo de tracking de sesiones que te permite:

- ✅ Ver quién está conectado en tiempo real
- ✅ Analizar patrones de uso
- ✅ Detectar intentos de acceso no autorizados
- ✅ Obtener insights sobre tu audiencia
- ✅ Exportar datos para reportes

**¿Necesitas ayuda?** Revisa la sección de [Solución de Problemas](#solución-de-problemas) o abre un issue en GitHub.
