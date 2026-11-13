import type { VercelRequest, VercelResponse } from '@vercel/node'

// Biến môi trường (đặt trong Vercel, KHÔNG prefix VITE_, KHÔNG commit):
//   APPS_SCRIPT_WEB_APP_URL   - URL /exec của Apps Script Web App
//   APPS_SCRIPT_SHARED_SECRET - chuỗi bí mật, khớp với hằng trong Code.gs

const MAX_GUESTS = 10

interface Payload {
  fullName: string
  attendance: 'yes' | 'no'
  guestCount: number
  message: string
  submissionId: string
}

function fail(res: VercelResponse, code: number) {
  return res
    .status(code)
    .json({ success: false, message: 'Chưa thể gửi xác nhận. Vui lòng thử lại.' })
}

function asString(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return fail(res, 405)

  const url = process.env.APPS_SCRIPT_WEB_APP_URL
  const secret = process.env.APPS_SCRIPT_SHARED_SECRET
  if (!url || !secret) {
    console.error('Missing APPS_SCRIPT_WEB_APP_URL / APPS_SCRIPT_SHARED_SECRET')
    return fail(res, 500)
  }

  // Validate + normalize server-side (không tin client).
  const body = (req.body ?? {}) as Record<string, unknown>

  const fullName = asString(body.fullName).trim().slice(0, 100)
  const attendance = body.attendance === 'no' ? 'no' : body.attendance === 'yes' ? 'yes' : null
  const message = asString(body.message).trim().slice(0, 500)
  const submissionId = asString(body.submissionId).trim().slice(0, 64)

  let guestCount = 0
  if (attendance === 'yes') {
    const n = Math.floor(Number(body.guestCount))
    if (!Number.isFinite(n) || n < 1 || n > MAX_GUESTS) return fail(res, 400)
    guestCount = n
  }

  if (!fullName || !attendance || !submissionId) return fail(res, 400)

  const payload: Payload = { fullName, attendance, guestCount, message, submissionId }

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Apps Script dùng redirect -> follow để lấy response cuối.
      redirect: 'follow',
      body: JSON.stringify({ ...payload, secret }),
    })

    const data = (await r.json().catch(() => null)) as { success?: boolean } | null

    // Chỉ thành công khi Apps Script xác nhận append xong.
    if (r.ok && data?.success) {
      return res.status(200).json({ success: true, message: 'Xác nhận của bạn đã được ghi nhận' })
    }
    return fail(res, 502)
  } catch (err) {
    console.error('RSVP forward error:', err)
    return fail(res, 502)
  }
}
