import { wedding } from '../config/wedding'
import Reveal from './Reveal'

export default function Gallery() {
  const { gallery } = wedding

  return (
    <section className="section gallery">
      <Reveal>
        <h2 className="section__title">Khoảnh khắc</h2>
      </Reveal>

      {gallery.length === 0 ? (
        <Reveal>
          <p className="gallery__empty">
            Thêm ảnh vào <code>public/images/</code> rồi khai báo trong{' '}
            <code>src/config/wedding.ts</code>.
          </p>
        </Reveal>
      ) : (
        <div className="gallery__grid">
          {gallery.map((img, i) => (
            <Reveal key={img.src} delay={(i % 3) * 0.1} className="gallery__item">
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  )
}
