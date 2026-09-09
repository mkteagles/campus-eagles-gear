// ============================================================
// MATERIALES Y ENTREGABLES DEL CAMPUS
// ============================================================
// Los materiales pueden apuntar a archivos dentro de /public o a URLs
// externas (por ejemplo Google Drive). Cada curso mantiene su propia lista.
// ============================================================

export const courseMaterials = {
  'cvt-elite': [
    {
      id: 'cvt-elite-guia-diagnostico-codigos',
      group: 'JF011 / JF017',
      title: 'Guía técnica: diagnóstico de códigos de falla CVT',
      description: 'Guía de Eagles Gear Solutions con referencias de diagnóstico y códigos de falla comunes en transmisiones CVT.',
      type: 'PDF · Guía técnica',
      url: '/materiales/cvt-elite/jf011/guia-diagnostico-codigos-cvt-eagles.pdf',
    },
    {
      id: 'cvt-elite-p0777-jeep-compass',
      group: 'JF011E',
      title: 'Informe técnico P0777 · Jeep Compass',
      description: 'Documento técnico de referencia para el código P0777 en Jeep Compass 2009 con transmisión CVT JF011E.',
      type: 'PDF · Informe técnico',
      url: '/materiales/cvt-elite/jf011/informe-tecnico-p0777-jeep-compass-jf011e.pdf',
    },
    {
      id: 'cvt-elite-atb1551',
      group: 'JF011E',
      title: 'Boletín técnico #1551 · Cuerpo de válvulas',
      description: 'Boletín técnico de identificación y desglose del cuerpo de válvulas para CVT/JF011E.',
      type: 'PDF · Boletín técnico',
      url: '/materiales/cvt-elite/jf011/boletin-tecnico-1551-cuerpo-valvulas-jf011e.pdf',
    },
    {
      id: 'cvt-elite-manual-jf010-jf011e',
      group: 'JF011E',
      title: 'Manual CVT JF010 / JF011E',
      description: 'Manual técnico de operación, pruebas, especificaciones, desarmado y armado de la familia JF010/JF011E.',
      type: 'PDF · Manual técnico',
      url: '/materiales/cvt-elite/jf011/manual-cvt-jf010-jf011e-2015.pdf',
    },
    {
      id: 'cvt-elite-manual-jf011e-techtran',
      group: 'JF011E',
      title: 'Manual técnico CVT JF011E',
      description: 'Manual de referencia para JF011E/CVT2, F1CJA y RE0F10A con información técnica de servicio.',
      type: 'PDF · Manual técnico',
      url: '/materiales/cvt-elite/jf011/manual-cvt-jf011e-techtran.pdf',
    },
    {
      id: 'cvt-elite-jf011e-esquemas',
      group: 'JF011E',
      title: 'JF011E · Guía fotográfica y esquemas',
      description: 'Documento visual de apoyo con fotografías y esquemas técnicos para consulta durante la capacitación.',
      type: 'PDF · Material visual',
      url: '/materiales/cvt-elite/jf011/jf011e-guia-fotografica-esquemas.pdf',
    },
    {
      id: 'cvt-elite-jf016e-jf017e-desgaste',
      group: 'JF016E / JF017E',
      title: 'Áreas críticas de desgaste y pruebas de vacío',
      description: 'Referencia técnica para JF016E y JF017E con puntos de desgaste y ubicaciones de prueba de vacío.',
      type: 'PDF · Diagnóstico',
      url: '/materiales/cvt-elite/jf017/jf016e-jf017e-areas-desgaste-pruebas-vacio.pdf',
    },
    {
      id: 'cvt-elite-material-apoyo-jf017',
      group: 'JF017E',
      title: 'Material de apoyo JF017',
      description: 'Material complementario de consulta para el módulo y las sesiones relacionadas con la transmisión JF017.',
      type: 'PDF · Material de apoyo',
      url: '/materiales/cvt-elite/jf017/material-de-apoyo-jf017.pdf',
    },
    {
      id: 'cvt-elite-manual-servicio-jf017e',
      group: 'JF017E / RE0F10D',
      title: 'Manual de servicio JF017E / RE0F10D',
      description: 'Manual técnico de servicio y control CVT para la familia RE0F10D/JF017E.',
      type: 'PDF · Manual de servicio',
      url: '/materiales/cvt-elite/jf017/manual-servicio-jf017e-re0f10d.pdf',
    },
    {
      id: 'cvt-elite-manual-referencia-jf017',
      group: 'JF017E',
      title: 'Manual de referencia gráfica JF017',
      description: 'Documento gráfico complementario entregado dentro del paquete de materiales de JF017.',
      type: 'PDF · Manual',
      url: '/materiales/cvt-elite/jf017/manual-referencia-grafica-jf017.pdf',
    },
  ],

  // El curso nuevo ya tiene lista la sección de entregables. Cuando lleguen
  // sus PDFs/Drive links, solamente se reemplazan estas URLs vacías.
  'seminario-empresarial': [
    {
      id: 'transmisiones-cero-manuales',
      group: 'Curso nuevo',
      title: 'Manuales de apoyo',
      description: 'Manuales y material de consulta del curso Transmisiones Automáticas desde Cero.',
      type: 'PDF · Manual',
      url: '',
    },
    {
      id: 'transmisiones-cero-material-tecnico',
      group: 'Curso nuevo',
      title: 'Material técnico complementario',
      description: 'PDFs, diagramas y documentación complementaria del curso.',
      type: 'PDF · Material técnico',
      url: '',
    },
    {
      id: 'transmisiones-cero-entregables',
      group: 'Curso nuevo',
      title: 'Entregables del curso',
      description: 'Archivos adicionales que forman parte de la capacitación.',
      type: 'Archivos',
      url: '',
    },
  ],
}

export function getCourseMaterials(courseId) {
  return courseMaterials[courseId] || []
}
