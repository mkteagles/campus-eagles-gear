import { Play } from 'lucide-react'

export default function VideoPlayer({ videoId, title }) {
  if (videoId) {
    return (
      <div className="video-frame">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
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
        <small>Agrega el ID de Vimeo en courseData.js</small>
      </div>
    </div>
  )
}
