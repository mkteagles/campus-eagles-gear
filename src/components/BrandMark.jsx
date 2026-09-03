export default function BrandMark({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`} aria-label="Eagles Digital Solutions">
      <img className="brand__logo brand__logo--dark" src="/eagles-digital-logo-dark.png" alt="" aria-hidden="true" />
      <img className="brand__logo brand__logo--light" src="/eagles-digital-logo-light.png" alt="" aria-hidden="true" />
    </div>
  )
}
