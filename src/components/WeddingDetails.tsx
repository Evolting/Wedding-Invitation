import { wedding } from '../config/wedding'
import Reveal from './Reveal'

export default function WeddingDetails() {
  return (
    <section className="section details">
      <Reveal>
        <h2 className="section__title">Thông tin lễ cưới</h2>
        <div className="details__card">
          <p className="details__date">{wedding.dateText}</p>
          <p className="details__time">Vào lúc {wedding.timeText}</p>
          <p className="details__venue">{wedding.venueName}</p>
          <p className="details__address">{wedding.venueAddress}</p>
          {wedding.mapsUrl && (
            <a
              className="btn"
              href={wedding.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem bản đồ
            </a>
          )}
        </div>
      </Reveal>
    </section>
  )
}
