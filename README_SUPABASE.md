# 🎯 Landing Page con Supabase V1

Sistema profesional de landing page con autenticación segura, widget ElevenLabs y **tracking completo de sesiones con Supabase**.

---

## 🆕 ¿Qué hay de nuevo?

Esta versión incluye **integración completa con Supabase** para el tracking y análisis de sesiones de usuario en tiempo real.

### ✨ Nuevas Características

- 📊 **Dashboard en tiempo real** con estadísticas de sesiones
- 🌍 **Geolocalización automática** de usuarios (país, ciudad, coordenadas)
- 💻 **Detección de dispositivos** (tipo, navegador, SO)
- ⏱️ **Tracking de duración** de sesiones con precisión de segundos
- 🔴 **Monitoreo de sesiones activas** en tiempo real
- 📈 **Estadísticas avanzadas** de uso y comportamiento
- 🔒 **Registro de intentos fallidos** para análisis de seguridad
- 💓 **Heartbeat automático** cada 30 segundos para tracking preciso

---

## 📋 Datos que se Registran Automáticamente

### 🕒 Información Temporal
- Día y hora exacta del login
- Última actividad (actualizada automáticamente)
- Hora de logout
- Duración total de la sesión

### 🌍 Geolocalización
- País (con bandera)
- Ciudad
- Región/Estado
- Coordenadas (latitud/longitud)
- Zona horaria
- ISP/Proveedor de internet

### 💻 Dispositivo y Navegador
- Tipo de dispositivo (Desktop, Mobile, Tablet)
- Navegador y versión
- Sistema operativo
- Resolución de pantalla
- Idioma del navegador

### 📊 Métricas de Interacción
- Estado de conexión (Activo/Inactivo)
- Duración de sesión en tiempo real
- Número de intentos fallidos
- Páginas visitadas

### 🔒 Seguridad
- Dirección IP
- Login exitoso vs fallido
- Origen del usuario (referrer)
- User Agent completo

---

## 🚀 Inicio Rápido

### 1. Configurar Supabase (5 minutos)

```bash
# 1. Crea una cuenta gratuita en supabase.com
# 2. Crea un nuevo proyecto
# 3. Ejecuta el schema SQL (supabase-schema.sql)
# 4. Configura las credenciales en supabase-config.js
```

👉 **[Guía Completa de Configuración](./SUPABASE_SETUP_GUIDE.md)**

### 2. Configurar Credenciales

Edita `supabase-config.js`:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://tuproyecto.supabase.co',
    anonKey: 'tu-anon-key-aqui',
    // ...
};
```

### 3. ¡Listo! Usa la Landing Page

Abre `index.html` y haz login. Los datos se registrarán automáticamente en Supabase.

---

## 📊 Dashboard de Visualización

### Acceder al Dashboard

**Localmente:**
```bash
open supabase-dashboard.html
```

**En producción:**
```
https://tuusuario.github.io/landing-page-con-supabase-v1/supabase-dashboard.html
```

### Características del Dashboard

#### 📈 Estadísticas en Tiempo Real:
- Sesiones activas ahora mismo
- Logins exitosos (últimos 7 días)
- Intentos fallidos
- Países únicos
- Duración promedio
- Usuarios únicos

#### 🔴 Monitoreo de Sesiones Activas:
- Lista en vivo de usuarios conectados
- Ubicación geográfica
- Tipo de dispositivo
- Duración en tiempo real
- Auto-refresh cada 10 segundos

#### 📋 Historial Completo:
- Últimas 50 sesiones
- Filtros por estado (activo/cerrado)
- Exportación de datos
- Búsqueda y análisis

---

## 🗂️ Archivos del Proyecto

### Nuevos Archivos de Supabase:

```
landing-page-con-supabase-v1/
├── 🆕 supabase-config.js              # Configuración de Supabase
├── 🆕 supabase-schema.sql             # Schema de base de datos
├── 🆕 supabase-session-tracker.js     # Sistema de tracking
├── 🆕 supabase-dashboard.html         # Dashboard de visualización
├── 🆕 SUPABASE_SETUP_GUIDE.md         # Guía de configuración
├── 🆕 README_SUPABASE.md              # Este archivo
│
├── index.html                         # Landing page principal (ACTUALIZADA)
├── script.js                          # Lógica de autenticación (ACTUALIZADA)
├── styles.css                         # Estilos
├── config.js                          # Configuración
├── security-protocol.js               # Protocolo de seguridad
└── ... (otros archivos existentes)
```

---

## 💡 Casos de Uso

### 1. Monitoreo en Tiempo Real

```
Escenario: Presentación en vivo a 20 personas
1. Comparte la URL de la landing page
2. Abre el dashboard en otra ventana
3. Ve en tiempo real quién está conectado
4. Monitorea duración y ubicación
5. Al terminar, usa el dashboard para ver estadísticas
```

### 2. Análisis de Seguridad

```
Escenario: Detectar intentos de acceso no autorizado
1. Revisa el dashboard regularmente
2. Filtra por "intentos fallidos"
3. Identifica IPs sospechosas
4. Analiza patrones de ataque
5. Exporta logs para auditoría
```

### 3. Análisis de Audiencia

```
Escenario: Entender mejor a tus usuarios
1. Revisa estadísticas de 7 días
2. Identifica países principales
3. Analiza tipos de dispositivos
4. Estudia duración promedio de sesiones
5. Optimiza la experiencia basándote en datos
```

---

## 🔍 Consultas SQL Útiles

### Ver sesiones activas ahora:
```sql
SELECT * FROM active_sessions;
```

### Top 10 países:
```sql
SELECT * FROM top_countries LIMIT 10;
```

### Estadísticas diarias:
```sql
SELECT * FROM daily_stats 
WHERE date >= CURRENT_DATE - INTERVAL '7 days';
```

### Intentos fallidos recientes:
```sql
SELECT username, ip_address, country, login_time
FROM session_logs
WHERE login_successful = false
ORDER BY login_time DESC
LIMIT 20;
```

---

## 🎨 Personalización

### Cambiar Intervalo de Heartbeat

En `supabase-session-tracker.js`:

```javascript
this.config = {
    heartbeatIntervalMs: 30000, // Cambiar a 60000 para 1 minuto
    // ...
};
```

### Agregar Campos Personalizados

1. Edita `supabase-schema.sql` para agregar columnas
2. Modifica `supabase-session-tracker.js` para capturar datos
3. Actualiza el dashboard para mostrar la nueva información

### Cambiar Servicio de Geolocalización

En `supabase-session-tracker.js`:

```javascript
this.config = {
    ipInfoService: 'https://api.ipgeolocation.io/ipgeo?apiKey=YOUR_KEY',
    // o usa otro servicio compatible
};
```

---

## 🔒 Seguridad y Privacidad

### Datos Sensibles

- ✅ **IP Address**: Se almacena para análisis de seguridad
- ✅ **Ubicación**: Solo ciudad/país, no dirección exacta
- ✅ **User Agent**: Información técnica del navegador
- ❌ **Passwords**: Nunca se almacenan en Supabase

### Row Level Security (RLS)

El schema incluye políticas de seguridad:

```sql
-- Permite INSERT anónimo (usuarios pueden registrar sesiones)
CREATE POLICY "Allow anonymous insert" ON session_logs
    FOR INSERT TO anon WITH CHECK (true);

-- Permite SELECT anónimo (para dashboard público)
CREATE POLICY "Allow anonymous select" ON session_logs
    FOR SELECT TO anon USING (true);
```

### Mejores Prácticas

1. **Usa HTTPS** en producción (GitHub Pages lo hace automáticamente)
2. **Revisa logs regularmente** para detectar actividad sospechosa
3. **Limita acceso al dashboard** si contiene información sensible
4. **Exporta backups** periódicamente desde Supabase
5. **Actualiza credenciales** si sospechas de compromiso

---

## 📈 Análisis y Reportes

### Exportar Datos

Desde Supabase:
1. Ve a Table Editor > session_logs
2. Click en "Export" (arriba a la derecha)
3. Selecciona formato (CSV, JSON)
4. Descarga el archivo

### Integrar con Herramientas de BI

Supabase es compatible con:
- Tableau
- Power BI
- Google Data Studio
- Metabase
- Grafana

Usa las credenciales de conexión desde Settings > Database.

### Crear Reportes Personalizados

Ejemplo: Reporte semanal por email

```javascript
// Función para generar reporte
async function generateWeeklyReport() {
    const stats = await window.sessionTracker.getStats(7);
    
    const report = {
        period: '7 days',
        total_logins: stats.successful_logins,
        unique_users: stats.unique_users,
        top_country: stats.top_countries[0].name,
        avg_duration: stats.avg_session_duration
    };
    
    // Enviar por email, webhook, etc.
    return report;
}
```

---

## 🛠️ Solución de Problemas

### ❌ "Supabase not configured"

**Solución**: Verifica que hayas actualizado las credenciales en `supabase-config.js`

### ❌ Dashboard no muestra datos

**Solución**: 
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Verifica que el schema SQL se haya ejecutado correctamente

### ❌ Geolocalización no funciona

**Solución**: El servicio gratuito tiene límite de 1000 requests/día. La app funciona normalmente sin esta info.

### ⚠️ Heartbeat no se envía

**Solución**: Verifica que `enableHeartbeat` esté en `true` en la configuración.

---

## 📚 Documentación Adicional

- 📖 **[Guía Completa de Configuración](./SUPABASE_SETUP_GUIDE.md)**
- 📖 **[README Original](./README.md)**
- 🌐 **[Documentación de Supabase](https://supabase.com/docs)**
- 🔗 **[Repositorio en GitHub](https://github.com/AIzentek/landing-page-con-supabase-v1)**

---

## 🎯 Roadmap

### Versión Actual (v1.0)
- ✅ Tracking básico de sesiones
- ✅ Dashboard en tiempo real
- ✅ Geolocalización automática
- ✅ Detección de dispositivos

### Próximas Versiones
- ⏳ Alertas por email/SMS
- ⏳ Análisis predictivo con IA
- ⏳ Integración con Google Analytics
- ⏳ Heatmaps de interacción
- ⏳ A/B testing automático

---

## 🤝 Contribuir

¿Tienes ideas para mejorar el sistema? 

1. Fork este repositorio
2. Crea una rama con tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

## 🙏 Créditos

- **ElevenLabs**: Widget conversacional de IA
- **Supabase**: Base de datos y backend
- **ipapi.co**: Servicio de geolocalización
- **UAParser.js**: Detección de dispositivos

---

## 💬 Soporte

¿Necesitas ayuda?

- 📧 Abre un [issue en GitHub](https://github.com/AIzentek/landing-page-con-supabase-v1/issues)
- 📖 Consulta la [guía de configuración](./SUPABASE_SETUP_GUIDE.md)
- 💡 Revisa [ejemplos de consultas SQL](#consultas-sql-útiles)

---

<div align="center">

**🚀 Desarrollado con ❤️ por AIzentek**

[Ver Demo](https://aizentek.github.io/landing-page-con-supabase-v1) • 
[Reportar Bug](https://github.com/AIzentek/landing-page-con-supabase-v1/issues) • 
[Solicitar Feature](https://github.com/AIzentek/landing-page-con-supabase-v1/issues)

</div>
