// Nội dung thiệp cưới. Chỉnh sửa TẤT CẢ tại đây — không hard-code trong component.
// Giá trị để placeholder cho tới khi có dữ liệu thật.

export interface GalleryImage {
  src: string // đường dẫn trong public/, ví dụ "/images/1.webp"
  alt: string
}

export interface WeddingConfig {
  groomName: string
  brideName: string
  // ISO 8601 kèm offset múi giờ: "2026-12-20T17:00:00+07:00"
  weddingDate: string
  timezone: string
  // Hiển thị cho khách (tự do định dạng tiếng Việt)
  dateText: string
  timeText: string
  venueName: string
  venueAddress: string
  mapsUrl: string // link Google Maps, rỗng = ẩn nút
  heroImage: string // ảnh chính hero, rỗng = dùng nền gradient
  gallery: GalleryImage[]
  thankYou: string
  musicSrc: string // file nhạc nền trong public/music/, rỗng = ẩn nút nhạc
}

export const wedding: WeddingConfig = {
  groomName: 'Evolting',
  brideName: 'Vbinf',
  weddingDate: '2026-12-24T17:00:00+07:00',
  timezone: 'Asia/Ho_Chi_Minh',
  dateText: 'Thứ 5, 24 tháng 12, 2026',
  timeText: '08:00',
  venueName: 'Tên nhà hàng / địa điểm',
  venueAddress: 'Số nhà, đường, phường, quận, thành phố',
  mapsUrl: '',
  heroImage: '/images/01-hero-couple.webp',
  gallery: [
    { src: '/images/02-bride-bouquet-detail.webp', alt: 'Cô dâu và bó hoa' },
    { src: '/images/03-garden-walk.webp', alt: 'Dạo bước trong vườn' },
    { src: '/images/04-white-roses.webp', alt: 'Hoa hồng trắng' },
    { src: '/images/05-garden-couple.webp', alt: 'Cặp đôi trong vườn' },
    { src: '/images/06-reception-decoration.webp', alt: 'Trang trí tiệc cưới' },
    { src: '/images/07-bride-closeup.webp', alt: 'Cô dâu cận cảnh' },
    { src: '/images/08-ceremony-venue.webp', alt: 'Không gian lễ cưới' },
    { src: '/images/09-wedding-rings.webp', alt: 'Nhẫn cưới' },
    { src: '/images/10-wedding-celebration.webp', alt: 'Khoảnh khắc chung vui' },
  ],
  thankYou: 'Sự hiện diện của bạn là niềm vinh hạnh của chúng tôi.',
  musicSrc: '', // ví dụ "/music/bg.mp3"
}
