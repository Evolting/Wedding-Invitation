import { useRef, useState } from 'react'
import Reveal from './Reveal'

type Attendance = 'yes' | 'no'
type Status = 'idle' | 'submitting' | 'success' | 'error'

const MAX_GUESTS = 10

interface FieldErrors {
  fullName?: string
  attendance?: string
  guestCount?: string
}

export default function RSVPForm() {
  // submissionId ổn định suốt vòng đời form -> chống ghi trùng khi retry.
  const submissionId = useRef(crypto.randomUUID())
  const honeypot = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState('')
  const [attendance, setAttendance] = useState<Attendance | ''>('')
  const [guestCount, setGuestCount] = useState(1)
  const [message, setMessage] = useState('')

  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>('idle')

  function validate(): FieldErrors {
    const e: FieldErrors = {}
    if (!fullName.trim()) e.fullName = 'Vui lòng nhập họ tên.'
    else if (fullName.trim().length > 100) e.fullName = 'Họ tên quá dài.'
    if (attendance !== 'yes' && attendance !== 'no')
      e.attendance = 'Vui lòng chọn.'
    if (attendance === 'yes') {
      if (!Number.isInteger(guestCount) || guestCount < 1)
        e.guestCount = 'Số người phải ≥ 1.'
      else if (guestCount > MAX_GUESTS)
        e.guestCount = `Tối đa ${MAX_GUESTS} người.`
    }
    return e
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (status === 'submitting') return // chặn double submit

    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    // Honeypot: bot điền field ẩn -> giả thành công, không gửi.
    if (honeypot.current?.value) {
      setStatus('success')
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          attendance,
          guestCount: attendance === 'yes' ? guestCount : 0,
          message: message.trim(),
          submissionId: submissionId.current,
        }),
      })
      const data = await res.json().catch(() => ({ success: false }))
      // CHỈ báo thành công khi server xác nhận đã ghi.
      if (res.ok && data.success) setStatus('success')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section className="section rsvp" id="rsvp">
        <Reveal>
          <h2 className="section__title">Cảm ơn bạn</h2>
          <p className="rsvp__done">
            Xác nhận của bạn đã được ghi nhận ❤
          </p>
        </Reveal>
      </section>
    )
  }

  return (
    <section className="section rsvp" id="rsvp">
      <Reveal>
        <h2 className="section__title">Xác nhận tham dự</h2>
        <form className="rsvp__form" onSubmit={handleSubmit} noValidate>
          {/* honeypot ẩn với người, bot hay điền */}
          <input
            ref={honeypot}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="rsvp__honeypot"
          />

          <label className="rsvp__field">
            <span>Họ và tên *</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={100}
              autoComplete="name"
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && (
              <em className="rsvp__err">{errors.fullName}</em>
            )}
          </label>

          <fieldset className="rsvp__field">
            <span>Bạn sẽ tham dự chứ? *</span>
            <div className="rsvp__radios">
              <label>
                <input
                  type="radio"
                  name="attendance"
                  checked={attendance === 'yes'}
                  onChange={() => setAttendance('yes')}
                />
                Có, tôi sẽ đến
              </label>
              <label>
                <input
                  type="radio"
                  name="attendance"
                  checked={attendance === 'no'}
                  onChange={() => setAttendance('no')}
                />
                Rất tiếc, không thể
              </label>
            </div>
            {errors.attendance && (
              <em className="rsvp__err">{errors.attendance}</em>
            )}
          </fieldset>

          {attendance === 'yes' && (
            <label className="rsvp__field">
              <span>Số người tham dự</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_GUESTS}
                value={guestCount}
                onChange={(e) =>
                  setGuestCount(parseInt(e.target.value, 10) || 1)
                }
                aria-invalid={!!errors.guestCount}
              />
              {errors.guestCount && (
                <em className="rsvp__err">{errors.guestCount}</em>
              )}
            </label>
          )}

          <label className="rsvp__field">
            <span>Lời nhắn gửi cô dâu chú rể</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </label>

          {status === 'error' && (
            <p className="rsvp__err rsvp__err--form">
              Chưa thể gửi xác nhận. Vui lòng thử lại.
            </p>
          )}

          <button
            type="submit"
            className="btn rsvp__submit"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Đang gửi…' : 'Gửi xác nhận'}
          </button>
        </form>
      </Reveal>
    </section>
  )
}
