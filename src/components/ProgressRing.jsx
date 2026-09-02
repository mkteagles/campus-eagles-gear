export default function ProgressRing({ value }) {
  const safeValue = Math.max(0, Math.min(100, value))
  return (
    <div className="progress-ring" style={{ '--progress': `${safeValue * 3.6}deg` }}>
      <span>{safeValue}%</span>
    </div>
  )
}
