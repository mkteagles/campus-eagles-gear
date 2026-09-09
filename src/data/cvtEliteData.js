// ============================================================
// CVT ELITE · EAGLES GEAR SOLUTIONS
// ============================================================
// Videos recibidos el 09/09/2026.
//
// Estructura actual:
//   Módulo 01 · Grabaciones en Vivo — CVT JF011 y JF017 (11 videos)
//   Módulo 02 · Mentoría Elite — CVT JF015 (7 videos)
//
// IMPORTANTE:
// El video 07 del módulo JF015 llegó con el mismo ID que el video 02
// (1123980579). Se conserva exactamente como fue enviado para no perder
// ningún lugar del temario. Cuando llegue el ID correcto, cambia únicamente
// ese videoId.
// ============================================================

export const CVT_ELITE_COURSE_ID = 'cvt-elite'

const liveJf011Jf017 = [
  '1074691006',
  '1074794599',
  '1074963068',
  '1074974361',
  '1075165504',
  '1075543141',
  '1075675695',
  '1075678976',
  '1075167409',
  '1075692750',
  '1075701026',
]

const mentorshipJf015 = [
  '1123971353',
  '1123980579',
  '1123981975',
  '1123979509',
  '1123975455',
  '1123980000',
  '1123980579', // Duplicado recibido por WhatsApp; reemplazar cuando llegue el ID correcto.
]

function buildLessons({ prefix, label, titlePrefix, videoIds, intro, summary }) {
  return videoIds.map((videoId, index) => {
    const lessonNumber = index + 1
    const padded = String(lessonNumber).padStart(2, '0')

    return {
      id: `${prefix}-${padded}`,
      label: `${label} ${padded}`,
      title: `${titlePrefix} · Parte ${padded}`,
      duration: '',
      videoId,
      videoProvider: 'vimeo',
      sourceHint: 'cvtEliteData.js',
      intro: `${intro} Esta es la parte ${lessonNumber} de la serie.`,
      summary,
    }
  })
}

export const cvtEliteCourse = {
  id: CVT_ELITE_COURSE_ID,
  title: 'CVT Elite',
  eyebrow: 'Eagles Gear Solutions',
  description: 'Programa Elite de capacitación técnica en transmisiones CVT con grabaciones en vivo y mentorías especializadas.',
  instructor: 'Eagles Gear Solutions',
  theme: 'elite',
  modules: [
    {
      id: 'grabaciones-vivo-jf011-jf017',
      number: '01',
      title: 'Grabaciones en Vivo — CVT JF011 y JF017',
      description: 'Serie de grabaciones en vivo enfocadas en el trabajo técnico, diagnóstico y análisis de las transmisiones CVT JF011 y JF017.',
      lessons: buildLessons({
        prefix: 'elite-jf011-jf017',
        label: 'Grabación',
        titlePrefix: 'JF011 y JF017',
        videoIds: liveJf011Jf017,
        intro: 'Contenido exclusivo de CVT Elite correspondiente a las grabaciones en vivo del módulo JF011 y JF017.',
        summary: 'Revisa con atención el desarrollo técnico de la sesión y toma nota de los procedimientos, criterios de diagnóstico y recomendaciones explicadas durante la clase.',
      }),
    },
    {
      id: 'mentoria-elite-jf015',
      number: '02',
      title: 'Mentoría Elite — CVT JF015',
      description: 'Mentoría exclusiva enfocada en el análisis técnico y resolución de dudas alrededor de la transmisión CVT JF015.',
      lessons: buildLessons({
        prefix: 'elite-jf015',
        label: 'Mentoría',
        titlePrefix: 'Mentoría Elite JF015',
        videoIds: mentorshipJf015,
        intro: 'Mentoría exclusiva de CVT Elite enfocada en la transmisión JF015, con explicación técnica y acompañamiento aplicado.',
        summary: 'Utiliza esta sesión para reforzar el diagnóstico, comprender criterios de reparación y repasar los puntos técnicos revisados durante la mentoría.',
      }),
    },
  ],
}
