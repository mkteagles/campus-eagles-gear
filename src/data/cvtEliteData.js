// ============================================================
// CVT ELITE · EAGLES GEAR SOLUTIONS
// ============================================================
// ESTE ES EL ARCHIVO QUE VAS A EDITAR CUANDO TENGAS LOS VIDEOS.
//
// 1) Si al final son menos de 25 módulos, cambia MODULE_COUNT.
// 2) Pega cada ID de Vimeo en CVT_ELITE_VIDEO_IDS.
// 3) Si quieres cambiar los nombres, edita CVT_ELITE_MODULE_TITLES.
//
// Ejemplo Vimeo:
// https://vimeo.com/123456789  -> ID = 123456789
// ============================================================

export const CVT_ELITE_COURSE_ID = 'cvt-elite'

export const CVT_ELITE_MODULE_COUNT = 25

export const CVT_ELITE_VIDEO_IDS = {
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: '',
  9: '',
  10: '',
  11: '',
  12: '',
  13: '',
  14: '',
  15: '',
  16: '',
  17: '',
  18: '',
  19: '',
  20: '',
  21: '',
  22: '',
  23: '',
  24: '',
  25: '',
}

export const CVT_ELITE_MODULE_TITLES = {
  1: 'Módulo 1',
  2: 'Módulo 2',
  3: 'Módulo 3',
  4: 'Módulo 4',
  5: 'Módulo 5',
  6: 'Módulo 6',
  7: 'Módulo 7',
  8: 'Módulo 8',
  9: 'Módulo 9',
  10: 'Módulo 10',
  11: 'Módulo 11',
  12: 'Módulo 12',
  13: 'Módulo 13',
  14: 'Módulo 14',
  15: 'Módulo 15',
  16: 'Módulo 16',
  17: 'Módulo 17',
  18: 'Módulo 18',
  19: 'Módulo 19',
  20: 'Módulo 20',
  21: 'Módulo 21',
  22: 'Módulo 22',
  23: 'Módulo 23',
  24: 'Módulo 24',
  25: 'Módulo 25',
}

const modules = Array.from({ length: CVT_ELITE_MODULE_COUNT }, (_, index) => {
  const number = index + 1
  const padded = String(number).padStart(2, '0')
  const title = CVT_ELITE_MODULE_TITLES[number] || `Módulo ${number}`

  return {
    id: `cvt-elite-modulo-${padded}`,
    number: padded,
    title,
    description: `Contenido exclusivo CVT Elite · Módulo ${number}.`,
    lessons: [
      {
        id: `cvt-elite-video-${padded}`,
        label: `Video ${number}`,
        title,
        duration: '',
        videoId: CVT_ELITE_VIDEO_IDS[number] || '',
        videoProvider: 'vimeo',
        sourceHint: 'cvtEliteData.js',
        summary: `Clase exclusiva del programa CVT Elite · Módulo ${number}.`,
      },
    ],
  }
})

export const cvtEliteCourse = {
  id: CVT_ELITE_COURSE_ID,
  title: 'CVT Elite',
  eyebrow: 'Eagles Gear Solutions',
  description: 'Programa Elite de capacitación en transmisiones CVT. Acceso exclusivo para alumnos inscritos.',
  instructor: 'Eagles Gear Solutions',
  theme: 'elite',
  modules,
}
