# Materiales y entregables del Campus

## CVT Elite

El dashboard de CVT Elite ya incluye 10 archivos PDF reales dentro del proyecto, organizados por familia técnica:

### JF011 / JF011E
1. Guía técnica: diagnóstico de códigos de falla CVT
2. Informe técnico P0777 · Jeep Compass
3. Boletín técnico #1551 · Cuerpo de válvulas
4. Manual CVT JF010 / JF011E
5. Manual técnico CVT JF011E
6. JF011E · Guía fotográfica y esquemas

### JF016E / JF017E
7. Áreas críticas de desgaste y pruebas de vacío
8. Material de apoyo JF017
9. Manual de servicio JF017E / RE0F10D
10. Manual de referencia gráfica JF017

Los archivos están dentro de:

```text
public/materiales/cvt-elite/jf011/
public/materiales/cvt-elite/jf017/
```

Las tarjetas y URLs se administran desde:

```text
src/data/courseMaterials.js
```

> Nota: uno de los documentos recibidos como `MANUAL.pdf` tiene el mismo contenido binario que el archivo recibido como `jf011e-rukovodstvo-photo-schemi.pdf`. Se conservaron ambos porque llegaron en carpetas/paquetes diferentes y el usuario indicó que el total esperado era de 10 entregables.

## Transmisiones Automáticas desde Cero

Este curso ya muestra la sección **Entregables y manuales** en su dashboard. Sus tres espacios continúan como pendientes hasta recibir los PDFs correspondientes. Cuando lleguen, basta con copiar los archivos a `public/materiales/...` y completar sus URLs en `src/data/courseMaterials.js`.

## Descarga de materiales

Los materiales disponibles muestran dos acciones: **Ver PDF** abre el documento en una pestaña nueva y **Descargar PDF** descarga el archivo directamente desde el Campus.

