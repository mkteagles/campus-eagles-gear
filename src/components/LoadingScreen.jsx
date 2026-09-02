import BrandMark from './BrandMark'

export default function LoadingScreen() {
  return (
    <main className="loading-screen">
      <BrandMark />
      <div className="loading-line" aria-label="Cargando"><span /></div>
    </main>
  )
}
