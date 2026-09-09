import { course as seminarioCourse } from './courseData'
import { cvtEliteCourse } from './cvtEliteData'

export const courses = [seminarioCourse, cvtEliteCourse]

export function getCourse(courseId) {
  return courses.find((item) => item.id === courseId) || null
}

export function getCourseLessons(courseId) {
  const course = getCourse(courseId)
  if (!course) return []

  return course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title,
    })),
  )
}

export function getCourseLesson(courseId, lessonId) {
  return getCourseLessons(courseId).find((lesson) => lesson.id === lessonId) || null
}

export function getFirstLessonIdForCourse(courseId) {
  return getCourseLessons(courseId)[0]?.id || null
}

export function getLessonNeighborsForCourse(courseId, lessonId) {
  const lessons = getCourseLessons(courseId)
  const index = lessons.findIndex((lesson) => lesson.id === lessonId)

  return {
    previous: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 ? lessons[index + 1] || null : null,
  }
}
