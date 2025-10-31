# ⚡ Configuración Rápida - Tu Proyecto Supabase

## 🎯 Tu Proyecto Supabase

**Project ID**: `lazrjxgzkspyjhcszsum`  
**Project URL**: `https://lazrjxgzkspyjhcszsum.supabase.co`  
**Dashboard**: https://supabase.com/dashboard/project/lazrjxgzkspyjhcszsum

---

## 📝 Pasos Rápidos (5 minutos)

### ✅ Paso 1: Ejecutar el Schema SQL

1. Ve a tu proyecto: https://supabase.com/dashboard/project/lazrjxgzkspyjhcszsum
2. En el menú lateral izquierdo, haz clic en **"SQL Editor"** (icono `</>`)
3. Haz clic en **"+ New query"**
4. Abre el archivo `supabase-schema.sql` de este proyecto
5. **Copia TODO el contenido** del archivo
6. **Pega** en el SQL Editor de Supabase
7. Haz clic en **"RUN"** (botón ▶️ o presiona `Ctrl + Enter`)

**Deberías ver:**
```
✅ Schema creado exitosamente!
📊 Tabla: session_logs
📈 Vistas: active_sessions, daily_stats, top_countries
🔐 Políticas RLS habilitadas
```

### ✅ Paso 2: Obtener tu Anon Key

1. En el mismo proyecto, ve a **"Settings"** en el menú lateral (icono ⚙️)
2. Haz clic en **"API"** en el submenú
3. Busca la sección **"Project API keys"**
4. Copia el valor de **"anon" / "public"** (es una clave larga que empieza con `eyJ...`)

**Ejemplo de cómo se ve:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhenJqeGd6a3NweWpoY3N6c3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3NzAwMDAsImV4cCI6MjAxNDM0NjAwMH0...
```

### ✅ Paso 3: Actualizar el Archivo de Configuración

1. Abre el archivo `supabase-config.js` en tu editor
2. Encuentra esta línea:
   ```javascript
   anonKey: 'TU_SUPABASE_ANON_KEY_AQUI',
   ```
3. Reemplázala con tu clave real:
   ```javascript
   anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // ← Tu clave aquí
   ```
4. **Guarda el archivo**

**El archivo completo debería verse así:**
```javascript
const SUPABASE_CONFIG = {
    url: 'https://lazrjxgzkspyjhcszsum.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Tu clave real
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    }
};
```

### ✅ Paso 4: Commit y Push

```bash
cd /home/user/webapp/landing-page-con-supabase-v1
git add supabase-config.js
git commit -m "feat: Configure Supabase credentials for project lazrjxgzkspyjhcszsum"
git push origin main
```

### ✅ Paso 5: Probar el Sistema

1. **Abre tu landing page** (en local o GitHub Pages)
2. **Haz login** con las credenciales:
   - Usuario: `aizentekdemo`
   - Contraseña: `Demo12345!`
3. **Abre la consola del navegador** (F12)
4. Deberías ver mensajes como:
   ```
   ✅ Supabase client initialized successfully
   📍 IP Info retrieved: {...}
   ✅ Login tracked successfully
   💓 Heartbeat sent
   ```

### ✅ Paso 6: Verificar en Supabase

1. Ve a tu proyecto: https://supabase.com/dashboard/project/lazrjxgzkspyjhcszsum
2. En el menú lateral, haz clic en **"Table Editor"**
3. Selecciona la tabla **"session_logs"**
4. Deberías ver tu sesión registrada con todos los datos:
   - Fecha y hora
   - País y ciudad
   - Tipo de dispositivo
   - Navegador
   - Estado (activo)

### ✅ Paso 7: Ver el Dashboard

1. Abre el archivo `supabase-dashboard.html` en tu navegador
2. Deberías ver:
   - **Estadísticas generales** (sesiones activas, logins exitosos, etc.)
   - **Sesiones activas** en tiempo real
   - **Historial completo** de sesiones

**Acceso directo al dashboard:**
- Local: `file:///ruta/a/supabase-dashboard.html`
- GitHub Pages: `https://aizentek.github.io/landing-page-con-supabase-v1/supabase-dashboard.html`

---

## 🔍 Verificación Rápida

### Verificar que la tabla existe:

En SQL Editor de Supabase, ejecuta:
```sql
SELECT * FROM session_logs LIMIT 10;
```

### Verificar sesiones activas:

```sql
SELECT * FROM active_sessions;
```

### Ver estadísticas del día:

```sql
SELECT * FROM daily_stats WHERE date = CURRENT_DATE;
```

---

## 🎯 URLs Importantes

| Recurso | URL |
|---------|-----|
| **Proyecto Supabase** | https://supabase.com/dashboard/project/lazrjxgzkspyjhcszsum |
| **SQL Editor** | https://supabase.com/dashboard/project/lazrjxgzkspyjhcszsum/sql/new |
| **Table Editor** | https://supabase.com/dashboard/project/lazrjxgzkspyjhcszsum/editor |
| **API Settings** | https://supabase.com/dashboard/project/lazrjxgzkspyjhcszsum/settings/api |
| **Repositorio GitHub** | https://github.com/AIzentek/landing-page-con-supabase-v1 |

---

## ⚠️ Importante

### NO compartas públicamente:
- ❌ Tu `service_role` key (solo para backend)
- ❌ Tu database password

### SÍ puedes compartir:
- ✅ Tu `anon` key (es segura para frontend)
- ✅ Tu Project URL

---

## 🆘 Problemas Comunes

### ❌ Error: "Supabase not configured"
**Solución**: Verifica que hayas pegado tu anon key correctamente en `supabase-config.js`

### ❌ Error: "relation 'session_logs' does not exist"
**Solución**: Ejecuta el schema SQL completo en el SQL Editor de Supabase

### ❌ Error: "permission denied for table session_logs"
**Solución**: Verifica que las políticas RLS se hayan creado (están en el schema SQL)

### ❌ No aparece geolocalización
**Solución**: Normal en las primeras pruebas. El servicio gratuito tiene límite de 1000 requests/día

---

## ✅ Checklist Final

- [ ] Schema SQL ejecutado en Supabase
- [ ] Tabla `session_logs` visible en Table Editor
- [ ] Anon key copiada de Settings > API
- [ ] `supabase-config.js` actualizado con la anon key
- [ ] Cambios subidos a GitHub (git push)
- [ ] Login realizado en la landing page
- [ ] Sesión visible en Supabase Table Editor
- [ ] Dashboard muestra datos correctamente

---

## 🎉 ¡Siguiente Nivel!

Una vez que funcione todo:

### Configurar GitHub Pages (si no está activo):
1. Ve a: https://github.com/AIzentek/landing-page-con-supabase-v1/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **main** / **(root)**
4. Save

### URLs en producción:
- Landing Page: `https://aizentek.github.io/landing-page-con-supabase-v1/`
- Dashboard: `https://aizentek.github.io/landing-page-con-supabase-v1/supabase-dashboard.html`

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que el schema SQL se ejecutó sin errores
3. Confirma que la anon key está correcta
4. Consulta la [guía completa](./SUPABASE_SETUP_GUIDE.md)

---

**🚀 ¡Listo para trackear sesiones en tiempo real!**
