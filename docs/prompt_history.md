# BITÁCORA DE PROMPTS Y CONTROL DE ASISTENCIA IA
**Proyecto:** Tijeras Locas - Sistema de Agenda y Business Intelligence (BI)  
**Curso:** Sistemas de Información - Ingeniería Comercial  
**Herramientas Auxiliares:** Google AI Studio (Gemini)  
**Fecha de Entrega:** 19 de Junio de 2026  

---

## 1. Estrategia General de Prompt Engineering
Se utilizaron técnicas avanzadas de *Prompt Engineering* para iterar en el diseño y codificación del sistema, asegurando modularidad (separación de concerns en React), manejo robusto de base de datos relacionales PostgreSQL (Supabase) y diagnóstico en producción.

Las técnicas aplicadas fueron:
*   **Role Playing (Asignación de Rol):** Definir a la IA como un *Arquitecto Senior de Software* y de *Business Intelligence*.
*   **Contexto de Negocio Primero:** Explicar el segmento de clientes de la barbería (estudiantes universitarios de bajo presupuesto y necesidad de agilidad) para enfocar los servicios (como el *"Degradado Humilde"* o *"VIP + Toalla de Vapor"*).
*   **Iteración Incremental:** Primero se generó el motor básico de calendario, luego el panel analítico y finalmente la capa de base de datos e integración con el servidor Express en producción.

---

## 2. Registro de Prompts Clave y de Conversación Iterativa

### Prompt 1: Creación del Modelo de Datos (Types y Catálogo)
> **Usuario:** *"Hola, necesito crear un sistema Web interactivo para la barbería del barrio universitario 'Tijeras Locas'. Debe tener una agenda fácil para los clientes y un panel analítico muy completo para los administradores. Primero ayudame a conceptualizar las interfaces y los tipos de datos en TypeScript para servicios, usuarios y citas, tomando en cuenta precios en pesos chilenos y servicios enfocados para universitarios."*  
>   
> **Resultados Obtenidos:**  
> La IA diseñó el archivo `/src/types.ts` estableciendo la interfaz de `Appointment` con estados específicos (`pending`, `completed`, `cancelled`, `no-show`) y la estructura de `Service`. Esto dio sustento científico para después crear las tablas relacionales SQL.

---

### Prompt 2: Robustez del Dashboard de Analítica (BI)
> **Usuario:** *"Ahora desarrollemos la vista de Administración. Necesitamos un Dashboard con indicadores clave (KPIs) financieros y de servicio: tasa de No-show, mejores barberos por ingreso, distribución de servicios preferidos y proyección de ganancias. Usa componentes visuales llamativos y gráficos interactivos con Recharts."*  
>   
> **Resultados Obtenidos:**  
> Se implementó un panel analítico integral en `/src/components/ProDashboard.tsx` con filtros de rangos temporales dinámicos, cálculo automático de ingresos reales frente a pérdidas por cancelaciones, y vistas interactivas con gráficos de barras recopilando datos relacionales grupales.

---

### Prompt 3: Solución de Seguridad Iframe (`localStorage` blocks)
> **Usuario:** *"Al probar la aplicación en ciertos entornos de simulación y sandbox (iframes de previsualización), recibo errores del navegador debido a que las políticas de seguridad bloquean el acceso directo a localStorage. ¿Cómo puedo asegurar la continuidad operacional y que no se rompa la aplicación?"*  
>   
> **Solución Técnica Aplicada:**  
> La IA propuso crear envoltorios de protección (*try-catch wrappers*) en `/src/App.tsx` para interceptar las excepciones `SecurityError`. Si el navegador web bloquea el almacenamiento persistente, la aplicación se recupera silenciosamente en memoria en lugar de colapsar con una pantalla blanca en blanco.
> 
```typescript
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn('localStorage.getItem blocked by browser policy:', e);
    return null;
  }
};
```

---

### Prompt 4: Configuración del Servidor Express para Producción (Render)
> **Usuario:** *"Cuando despliego en Render, el servidor Express arroja fallas al buscar la carpeta 'dist' porque el comando de compilación une los archivos en 'dist/server.cjs' dentro de la misma carpeta compilada. Ayúdame a corregir el ruteo del directorio estático."*  
>   
> **Solución Técnica Aplicada:**  
> Se modificó `/server.ts` con una estrategia multi-ruta dinámica de validación recursiva de directorios:
> 
```typescript
const possiblePaths = [
  path.join(process.cwd(), 'dist'),
  path.join(__dirname),
  path.join(__dirname, '..'),
  path.join(__dirname, '../dist'),
  path.join(__dirname, 'dist'),
  process.cwd()
];
```
Esto garantiza compatibilidad cross-platform perfecta (desarrollo local fluido con Vite y producción consolidada en la nube).

---

## 3. Conclusión de la Ayuda Generativa de IA
La IA actuó como un copiloto de excelencia reduciendo la latencia de desarrollo a minutos. Permitió validar el cumplimiento del stack tecnológico solicitado por la universidad (TypeScript/React en Front-end, Express en Back-end y PostgreSQL de base relacional).
