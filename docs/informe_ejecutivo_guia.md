# GUÍA DE ESTRUCTURACIÓN: INFORME EJECUTIVO (NOTEBOOKLM)
**Proyecto:** Tijeras Locas - Sistema de Gestión e Inteligencia de Negocio  
**Curso:** Sistemas de Información - Ingeniería Comercial  

Esta guía contiene la síntesis técnica y comercial lista para subir a **NotebookLM** y generar el informe ejecutivo en formato PDF que solicita la cátedra de los profesores Boris Bugueño y Alejandro Paolini.

---

## 1. Identificación del Dolor del Cliente (Pain Points)
La barbería "Tijeras Locas", ubicada en el barrio universitario, enfrentaba grandes deficiencias operacionales antes de esta solución:
1.  **Fútbol de Citas Informal:** Las reservas se manejaban por conversaciones informales de WhatsApp desestructuradas, generando saturación, dobles reservas y descuidos horables.
2.  **Ausencia a Citas (Tasa de No-Show Elevada):** Los estudiantes universitarios olvidaban los turnos por falta de recordatorios. Eso causaba tiempos muertos para barberos como Andrés, Lissy y Meylin.
3.  **Cero Visibilidad Financiera (Métrica Ciega):** El dueño no conocía qué barbero era más productivo, qué categoría reportaba más margen (ej. de teñidos frente a cortes simples), ni cuánta plata se perdía por citas anuladas.

---

## 2. Requerimientos del Sistema Extraídos para la IA

### Requerimientos Funcionales (RF):
*   **Gestión de Agendamiento Activo (RF-01):** El sistema permite al cliente seleccionar un servicio específico de un menú categorizado, elegir su barbero de preferencia (Andrés, Lissy, Meylin), y reservar en el calendario con horarios validados en tiempo real.
*   **Visualización de Turnos (RF-02):** Visualización mediante tarjetas interactivas clasificadas por estado de cita (`pendiente`, `completada`, `no-asistió`, `cancelada`).
*   **Dashboard de Control de BI (RF-03):** Secciones de analítica ejecutiva exclusiva con KPIs automatizados (Ingresos Totales, Tasa de No-show, Ocupación Promedio de Sillas).
*   **Gestor de Estados (RF-04):** Permite cambiar los estados de cita mediante interacción interactiva en un solo clic, actualizando los flujos de caja del negocio al instante.

### Requerimientos No Funcionales (RNF):
*   **Operabilidad Segura en Iframe (RNF-01):** Mitigación de errores locales implementando envolturas tolerantes de almacenamiento (`safeGetItem`/`safeSetItem`).
*   **Velocidad de Carga Elevada (RNF-02):** Optimización estática mediante bundler Vite + React 19 y estilizado atómico instantáneo con Tailwind CSS.
*   **Persistencia Híbrida (RNF-03):** Conexión directa a base de datos externa relacional PostgreSQL (vía Supabase JS client) y local storage como respaldo de fallback automático offline.

---

## 3. Justificación del Stack Tecnológico Elegido
*   **Frontend (React + Vite):** Elegido por sobre Angular u otras opciones por su renderizado reactivo ultraligero y ecosistema maduro de dashboards analíticos (Recharts).
*   **Servidor Backend (Express + Node.js - tsx/esbuild):** Para centralizar lógicas de negocio, validaciones y proveer un proxy seguro hacia la base de datos sin exponer secretos sensibles en el navegador.
*   **Base de Datos (SQL Relacional - Supabase / PostgreSQL):** Los datos de citas, clientes y servicios son intrínsecamente estructurados y relacionales (un cliente pertenece a una cita, una cita referencia a un servicio). Cumple cabalmente con la norma de integridad referencial.
