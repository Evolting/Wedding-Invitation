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
}

export const wedding: WeddingConfig = {
  groomName: 'Chú Rể',
  brideName: 'Cô Dâu',
  weddingDate: '2026-12-20T17:00:00+07:00',
  timezone: 'Asia/Ho_Chi_Minh',
  dateText: 'Chủ Nhật, 20 tháng 12, 2026',
  timeText: '17:00',
  venueName: 'Tên nhà hàng / địa điểm',
  venueAddress: 'Số nhà, đường, phường, quận, thành phố',
  mapsUrl: '',
  heroImage: '', // ví dụ "/images/hero.webp"
  gallery: [
    // Thêm ảnh thật vào public/images/ rồi liệt kê ở đây:
    // { src: '/images/1.webp', alt: 'Ảnh cưới 1' },
  ],
  thankYou: 'Sự hiện diện của bạn là niềm vinh hạnh của chúng tôi.',
}
