export default function BrandMark({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`} aria-label="Eagles Digital Solutions">
      <span className="brand__logo-crop" aria-hidden="true">
        <img src="/eagles-digital-brand.jpeg" alt="" />
      </span>
    </div>
  )
}
