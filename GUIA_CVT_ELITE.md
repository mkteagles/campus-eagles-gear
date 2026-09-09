# CVT Elite · Campus Eagles Gear Solutions

## Contenido cargado al 09/09/2026

El curso `cvt-elite` queda organizado en dos módulos:

### Módulo 01 · Grabaciones en Vivo — CVT JF011 y JF017
- 11 videos de Vimeo.
- Cada video aparece como `Grabación 01`, `Grabación 02`, etc.
- Cada lección incluye un bloque de introducción antes del reproductor y un resumen debajo del video.

### Módulo 02 · Mentoría Elite — CVT JF015
- 7 espacios de video de Vimeo.
- Cada video aparece como `Mentoría 01`, `Mentoría 02`, etc.
- El enlace recibido para la Mentoría 07 repite el ID de la Mentoría 02: `1123980579`.
- Se conserva el enlace repetido para respetar exactamente el listado recibido. Cuando llegue el ID correcto, solo cambia el último valor en `src/data/cvtEliteData.js`.

## Archivo principal de contenido

`src/data/cvtEliteData.js`

Ahí se encuentran:
- IDs de Vimeo.
- Títulos de módulos.
- Títulos de cada video.
- Introducciones.
- Resúmenes.

No es necesario modificar Supabase para cambiar títulos o videos.

## Acceso de alumnos

El alumno debe tener una inscripción activa en `course_enrollments` con:

```text
course_id = cvt-elite
status = active
```

El progreso se guarda en `lesson_progress` usando el mismo `course_id`.

## Supabase

Si aún no se ha ejecutado la migración de CVT Elite, correr una sola vez:

`Migracion_CVT_Elite.sql`

No volver a ejecutar toda la base original si el Campus ya está funcionando.

## Descarga de materiales

Los materiales disponibles muestran dos acciones: **Ver PDF** abre el documento en una pestaña nueva y **Descargar PDF** descarga el archivo directamente desde el Campus.

