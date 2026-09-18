# Nuevos cursos preparados en el Campus · 18/09/2026

Esta actualización agrega al catálogo y al panel de administración los siguientes cursos, todavía sin contenido técnico inventado:

- CVT JF011 (`cvt-jf011`)
- CVT JF017 (`cvt-jf017`)
- CVT JF015 (`cvt-jf015`)
- DSG DQ200 (`dsg-dq200`)
- DSG DQ250 (`dsg-dq250`)
- Programación GM (`programacion-gm`)
- 6L80 (`6l80`)
- Curso Empresarial (`curso-empresarial`)

## Qué ya funciona

- Los cursos aparecen en **/cursos** para administradores.
- Desde **/admin** se pueden crear alumnos y asignar cualquiera de estos cursos.
- También se puede activar o retirar el acceso de alumnos existentes.
- Cada curso tiene su dashboard y muestra **Contenido en preparación** hasta recibir clases.
- Cada curso ya tiene la sección de **Manuales / Diagramas / Entregables** preparada.
- La API privada del Campus y la integración CRM aceptan estos IDs de curso.

## Paso obligatorio en Supabase

En el proyecto Supabase del **Campus**, abre **SQL Editor** y ejecuta:

`Migracion_Nuevos_Cursos_18SEP.sql`

Esto registra los cursos en `public.courses`. Sin esta migración, Supabase rechazará nuevas inscripciones por la llave foránea de `course_enrollments.course_id`.

## Cuando lleguen los contenidos

Los placeholders están en:

`src/data/newCoursesData.js`

Los materiales se configuran en:

`src/data/courseMaterials.js`

Y las carpetas para PDFs ya están creadas dentro de:

`public/materiales/`

No es necesario volver a construir el sistema de usuarios ni el panel admin; solamente se agregan módulos, videos y archivos a cada curso.

## Curso 6L80

El curso queda registrado definitivamente como **6L80**, con identificador interno `6l80`. La migración incluida también corrige automáticamente un registro previo `gl80` si alcanzó a ejecutarse la versión anterior.
