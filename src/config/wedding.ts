// Nội dung thiệp cưới. Chỉnh sửa tại đây — KHÔNG hard-code trong component.
// Giá trị để trống / placeholder cho tới khi có dữ liệu thật.

export interface WeddingConfig {
  groomName: string
  brideName: string
  // ISO 8601 kèm offset múi giờ, ví dụ: "2026-12-20T17:00:00+07:00"
  weddingDate: string
  timezone: string
  venueName: string
  venueAddress: string
  // Link Google Maps, để trống nếu chưa có
  mapsUrl: string
}

export const wedding: WeddingConfig = {
  groomName: 'Chú Rể',
  brideName: 'Cô Dâu',
  weddingDate: '2026-12-20T17:00:00+07:00',
  timezone: 'Asia/Ho_Chi_Minh',
  venueName: 'Tên địa điểm',
  venueAddress: 'Địa chỉ cụ thể',
  mapsUrl: '',
}
