// ============================================================
// NUEVOS CURSOS · EAGLES GEAR SOLUTIONS
// ============================================================
// Estructuras preparadas el 18/09/2026.
// El contenido todavía no ha sido entregado, por eso cada curso
// muestra un módulo de "Contenido en preparación" sin inventar videos.
// Cuando lleguen los videos/PDFs se sustituyen estos placeholders.
// ============================================================

function pendingCourse({ id, title, eyebrow, description, theme = 'default' }) {
  return {
    id,
    title,
    eyebrow,
    description,
    instructor: 'Eagles Gear Solutions',
    theme,
    contentStatus: 'coming-soon',
    modules: [
      {
        id: `${id}-contenido`,
        number: '01',
        title: 'Contenido en preparación',
        description: 'Este espacio ya está creado en el Campus. Los videos, clases y materiales se cargarán cuando estén disponibles.',
        status: 'coming-soon',
        lessons: [],
      },
    ],
  }
}

export const jf011Course = pendingCourse({
  id: 'cvt-jf011',
  title: 'CVT JF011',
  eyebrow: 'Curso técnico CVT',
  description: 'Capacitación especializada en la transmisión CVT JF011. Estructura lista para recibir módulos, videos y material técnico.',
  theme: 'elite',
})

export const jf017Course = pendingCourse({
  id: 'cvt-jf017',
  title: 'CVT JF017',
  eyebrow: 'Curso técnico CVT',
  description: 'Capacitación especializada en la transmisión CVT JF017. Estructura lista para recibir módulos, videos y material técnico.',
  theme: 'elite',
})

export const jf015Course = pendingCourse({
  id: 'cvt-jf015',
  title: 'CVT JF015',
  eyebrow: 'Curso técnico CVT',
  description: 'Capacitación especializada en la transmisión CVT JF015. Estructura lista para recibir módulos, videos y material técnico.',
  theme: 'elite',
})

export const dq200Course = pendingCourse({
  id: 'dsg-dq200',
  title: 'DSG DQ200',
  eyebrow: 'Curso técnico DSG',
  description: 'Capacitación especializada en DSG DQ200. El espacio ya está listo para agregar clases, grabaciones, manuales y entregables.',
})

export const dq250Course = pendingCourse({
  id: 'dsg-dq250',
  title: 'DSG DQ250',
  eyebrow: 'Curso técnico DSG',
  description: 'Capacitación especializada en DSG DQ250. El espacio ya está listo para agregar clases, grabaciones, manuales y entregables.',
})

export const programacionGmCourse = pendingCourse({
  id: 'programacion-gm',
  title: 'Programación GM',
  eyebrow: 'Programación automotriz',
  description: 'Curso enfocado en programación GM. Se deja preparado para integrar el contenido técnico y los recursos del curso.',
})

export const sixL80Course = pendingCourse({
  id: '6l80',
  title: '6L80',
  eyebrow: 'Curso técnico GM',
  description: 'Capacitación especializada en la transmisión automática GM 6L80. El Campus ya está preparado para cargar posteriormente videos, módulos y materiales.',
})

export const businessCourse = pendingCourse({
  id: 'curso-empresarial',
  title: 'Curso Empresarial',
  eyebrow: 'Gestión y crecimiento',
  description: 'Capacitación empresarial de Eagles Gear Solutions. Espacio preparado para integrar sus módulos, grabaciones y entregables.',
})

export const newCourses = [
  jf011Course,
  jf017Course,
  jf015Course,
  dq200Course,
  dq250Course,
  programacionGmCourse,
  sixL80Course,
  businessCourse,
]
