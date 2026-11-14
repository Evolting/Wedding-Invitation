import { useEffect, useRef, useState } from 'react'
import { wedding } from '../config/wedding'

// Nút nổi bật/tắt nhạc nền.
// Autoplay có tiếng bị trình duyệt chặn (desktop chặn mạnh hơn mobile),
// nên khi musicAutoplay = true: thử phát ngay; nếu bị chặn, phát khi khách
// chạm/cuộn/bấm lần đầu bất kỳ đâu (trừ chính nút nhạc).
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const userControlled = useRef(false) // khách đã tự bấm nút -> ngừng auto
  const [playing, setPlaying] = useState(false)

  function play() {
    const a = audioRef.current
    if (!a) return
    a.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }

  function pause() {
    audioRef.current?.pause()
    setPlaying(false)
  }

  // Nút bấm tay: luôn thắng auto
  function toggle() {
    userControlled.current = true
    if (audioRef.current?.paused) play()
    else pause()
  }

  // Autoplay + fallback theo thao tác đầu tiên
  useEffect(() => {
    if (!wedding.musicSrc || !wedding.musicAutoplay) return
    const a = audioRef.current
    if (!a) return

    a.play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Bị chặn -> chờ thao tác đầu (bỏ qua click vào nút nhạc)
        const start = (e: Event) => {
          if (userControlled.current) return remove()
          if (btnRef.current && e.target instanceof Node && btnRef.current.contains(e.target))
            return // để nút tự xử lý
          play()
          remove()
        }
        const remove = () => {
          window.removeEventListener('pointerdown', start)
          window.removeEventListener('keydown', start)
          window.removeEventListener('scroll', start)
        }
        window.addEventListener('pointerdown', start)
        window.addEventListener('keydown', start)
        window.addEventListener('scroll', start, { passive: true })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!wedding.musicSrc) return null

  return (
    <>
      <audio ref={audioRef} src={wedding.musicSrc} loop preload="auto" />
      <button
        ref={btnRef}
        type="button"
        className={`music-toggle ${playing ? 'is-playing' : ''}`}
        onClick={toggle}
        aria-label={playing ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
        aria-pressed={playing}
      >
        <span className="music-toggle__icon" aria-hidden="true">
          {playing ? '♪' : '♫'}
        </span>
      </button>
    </>
  )
}
