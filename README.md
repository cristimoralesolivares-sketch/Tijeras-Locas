# Tijeras Locas — Barbería Universitaria 💈✂️

Sistema seguro de reservas universitarias en tiempo real. Rediseñado con **React**, **TypeScript**, **Vite**, **Express**, y **Supabase** como persistencia definitiva de datos en producción para despliegues de múltiples dispositivos.

---

## 🌟 Características Principales

- **Autenticación Segura (Supabase Auth)**: Registro público de alumnos (clientes) y acceso cerrado mediante roles (`cliente`, `barbero`, `admin`).
- **Cero Contraseñas Hardcodeadas**: Eliminación de datos sensibles en texto plano para el cumplimiento estricto de estándares de seguridad informática corporativos.
- **Agenda Dinámica**: Generación automática de los próximos 6 días laborables (Lunes a Sábado) ajustados dinámicamente a la zona horaria `America/Santiago` (Santiago, Chile).
- **Indicador de Sincronización Web**: Badge dinámico 🟢/🟡 que muestra si la aplicación está conectada a la base de datos central en la nube.
- **Reloj Central Universitario**: Reloj en tiempo real sincronizado con el huso horario oficial chileno (CLT).

---

## 🚀 Despliegue en Render

Para desplegar la aplicación en **Render.com** de manera 100% exitosa, configura tu servicio web con las siguientes especificaciones:

### ⚙️ Configuración del Entorno de Construcción
- **Environment**: `Node`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: `20.x` o superior (puedes añadir la variable `NODE_VERSION = 20` para asegurarlo)

### 🔑 Variables de Entorno (Environment Variables)
Agrega estas dos variables en la sección **Environment** en el panel de Render:

| Variable | Descripción | Valor de Ejemplo |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | URL de la API REST de tu proyecto Supabase | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Llave pública anónima de Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |

Una vez guardadas, Render reconstruirá y levantará la aplicación. Al entrar desde tu celular o computador, la app mostrará el indicador de base de datos como **Conectado** 🟢 y la sincronización entre dispositivos estará completamente activa de forma automática.

---

## 👥 Gestión de Usuarios e Inicialización del Staff (Supabase)

Los barberos y el administrador **no se registran desde la aplicación** para evitar intrusiones. Se crean manualmente en el Administrador de Supabase:

1. Entra a tu **Supabase Dashboard** -> **Authentication** -> **Users**.
2. Presiona **Add User** -> **Create User**.
3. Registra el email y la contraseña.
4. En la fila del nuevo usuario, edita la columna **User Metadata** (o `raw_user_meta_data`) con el siguiente JSON según el rol:

### 💼 Andrés (Dueño/Administrador)
```json
{
  "name": "Andrés",
  "phone": "+56911112222",
  "role": "admin"
}
```

### 💈 Lissy (Staff Barbero)
```json
{
  "name": "Lissy",
  "phone": "+56994151797",
  "role": "barbero"
}
```

### 💈 Meylin (Staff Barbera)
```json
{
  "name": "Meylin",
  "phone": "+56971088802",
  "role": "barbero"
}
```

*Los clientes estudiantes se registran solos desde la pantalla de login/registro de la app y reciben su rol de `cliente` de forma automática.*

---

## 💾 Esquema de Base de Datos PostgreSQL
Puedes inicializar y ejecutar el esquema en el compilador de SQL de Supabase utilizando el archivo `/supabase_setup.sql`.

---

## 💻 Desarrollo Local

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Compila y verifica el build de producción localmente:
   ```bash
   npm run build
   npm start
   ```
