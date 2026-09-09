# Materiales y entregables · Campus Eagles Gear

Esta versión del Campus ya incluye una sección **Entregables y manuales** dentro de los dashboards de:

- CVT Elite (`cvt-elite`)
- Transmisiones Automáticas desde Cero (`seminario-empresarial`)

## Mientras no estén los archivos

Los materiales aparecen como **Archivo pendiente de cargar**. Esto es intencional: permite subir el cambio hoy y agregar los PDFs después sin rediseñar el Campus.

## Opción A · Google Drive

1. Sube el PDF/manual a Drive.
2. Configura el acceso del archivo según la política que vayas a usar.
3. Copia su enlace.
4. Abre `src/data/courseMaterials.js`.
5. Pega el enlace en `url` del material correspondiente.

Ejemplo:

```js
{
  id: 'cvt-elite-manual-jf017',
  title: 'Manual JF017',
  description: 'Manual de apoyo.',
  type: 'PDF / Manual',
  url: 'https://drive.google.com/...',
}
```

## Opción B · Archivo dentro del proyecto

Guarda los PDFs en:

- `public/materiales/cvt-elite/`
- `public/materiales/seminario-empresarial/`

Luego usa una ruta como:

```js
url: '/materiales/cvt-elite/manual-jf017.pdf'
```

## Cuando tengas los PDFs

Puedes pasar los archivos y se puede generar otro ZIP con todos los documentos colocados, nombres ordenados y enlaces ya configurados.

## Nota de acceso

Los materiales se muestran dentro del dashboard de un curso al que el alumno ya debe tener acceso. Si usas enlaces públicos de Google Drive o archivos dentro de `public/`, la URL directa puede compartirse fuera del Campus. Si más adelante necesitas impedirlo, conviene migrar los entregables a un bucket privado de Supabase Storage y generar URLs firmadas para cada alumno autenticado.
