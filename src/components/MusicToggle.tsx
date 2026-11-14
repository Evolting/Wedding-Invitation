import { useEffect, useRef, useState } from 'react'
import { wedding } from '../config/wedding'

// Nút nổi bật/tắt nhạc nền.
// Autoplay có tiếng bị trình duyệt chặn (nhất là mobile/iOS), nên khi
// musicAutoplay = true: thử phát ngay; nếu bị chặn, phát khi khách
// chạm/cuộn/bấm lần đầu bất kỳ đâu.
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  // Đồng bộ state -> thẻ audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) audio.play().catch(() => setPlaying(false))
    else audio.pause()
  }, [playing])

  // Thử autoplay + fallback theo thao tác đầu tiên
  useEffect(() => {
    if (!wedding.musicSrc || !wedding.musicAutoplay) return
    const audio = audioRef.current
    if (!audio) return

    let armed = true

    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Bị chặn -> chờ thao tác đầu tiên
        const start = () => {
          if (!armed) return
          armed = false
          setPlaying(true)
          remove()
        }
        const remove = () => {
          window.removeEventListener('pointerdown', start)
          window.removeEventListener('keydown', start)
          window.removeEventListener('touchstart', start)
          window.removeEventListener('scroll', start)
        }
        window.addEventListener('pointerdown', start, { once: true })
        window.addEventListener('keydown', start, { once: true })
        window.addEventListener('touchstart', start, { once: true })
        window.addEventListener('scroll', start, { once: true, passive: true })
      })

    return () => {
      armed = false
    }
  }, [])

  if (!wedding.musicSrc) return null

  return (
    <>
      <audio ref={audioRef} src={wedding.musicSrc} loop preload="auto" />
      <button
        type="button"
        className={`music-toggle ${playing ? 'is-playing' : ''}`}
        onClick={() => setPlaying((p) => !p)}
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
