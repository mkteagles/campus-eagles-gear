import { Play } from 'lucide-react'

function buildVideoUrl(videoId, provider) {
  if (!videoId) return ''

  if (provider === 'youtube') {
    return `https://www.youtube-nocookie.com/embed/${videoId}`
  }

  if (provider === 'drive') {
    return `https://drive.google.com/file/d/${videoId}/preview`
  }

  return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`
}

export default function VideoPlayer({ videoId, title, provider = 'vimeo', sourceHint = 'courseData.js' }) {
  const videoUrl = buildVideoUrl(videoId, provider)

  if (videoUrl) {
    return (
      <div className="video-frame">
        <iframe
          src={videoUrl}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="video-placeholder">
      <span className="video-placeholder__glow" />
      <div className="video-placeholder__content">
        <span className="play-button"><Play fill="currentColor" /></span>
        <strong>Video de la lección</strong>
        <small>Agrega el ID del video en {sourceHint}</small>
      </div>
    </div>
  )
}
