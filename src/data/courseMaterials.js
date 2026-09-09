// ============================================================
// MATERIALES Y ENTREGABLES DEL CAMPUS
// ============================================================
// Aquí se controlan los PDFs, manuales, diagramas y archivos de
// cada curso. Puedes usar una URL de Google Drive o un archivo
// guardado dentro de /public/materiales/<curso>/.
//
// Cuando el archivo todavía no está cargado deja url: ''.
// El Campus mostrará el material como "Pendiente de cargar".
// ============================================================

export const courseMaterials = {
  'cvt-elite': [
    {
      id: 'cvt-elite-manuales',
      title: 'Manuales de apoyo',
      description: 'Manuales y documentos técnicos complementarios de CVT Elite.',
      type: 'PDF / Manual',
      url: '',
    },
    {
      id: 'cvt-elite-material-tecnico',
      title: 'Material técnico complementario',
      description: 'PDFs, diagramas y documentación de apoyo del programa CVT Elite.',
      type: 'PDF / Material técnico',
      url: '',
    },
    {
      id: 'cvt-elite-entregables',
      title: 'Entregables del programa',
      description: 'Archivos adicionales incluidos dentro de la capacitación CVT Elite.',
      type: 'Archivos',
      url: '',
    },
  ],

  'seminario-empresarial': [
    {
      id: 'transmisiones-cero-manuales',
      title: 'Manuales de apoyo',
      description: 'Manuales y material de consulta del curso Transmisiones Automáticas desde Cero.',
      type: 'PDF / Manual',
      url: '',
    },
    {
      id: 'transmisiones-cero-material-tecnico',
      title: 'Material técnico complementario',
      description: 'PDFs, diagramas y documentación complementaria del curso.',
      type: 'PDF / Material técnico',
      url: '',
    },
    {
      id: 'transmisiones-cero-entregables',
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
