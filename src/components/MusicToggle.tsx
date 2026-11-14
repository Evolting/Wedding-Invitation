import { useEffect, useRef, useState } from 'react'
import { wedding } from '../config/wedding'

// Nút nổi bật/tắt nhạc nền.
// Autoplay có tiếng bị chặn trên desktop, nên khi musicAutoplay = true:
//  1) thử phát ngay (mobile thường cho),
//  2) ĐỒNG THỜI gắn ngay listener: thao tác đầu tiên (chạm/cuộn/bấm) -> phát.
// Gắn listener ngay từ đầu (không chờ play() reject) để không mất thao tác
// trong lúc file nhạc còn đang tải.
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const userControlled = useRef(false) // khách tự bấm nút -> ngừng auto
  const [playing, setPlaying] = useState(false)

  function play() {
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }

  function pause() {
    audioRef.current?.pause()
    setPlaying(false)
  }

  function toggle() {
    userControlled.current = true
    if (audioRef.current?.paused) play()
    else pause()
  }

  useEffect(() => {
    if (!wedding.musicSrc || !wedding.musicAutoplay) return

    // 1) thử phát ngay (mobile)
    play()

    // 2) fallback: thao tác đầu tiên -> phát (bỏ qua bấm vào nút nhạc)
    const start = (e: Event) => {
      if (userControlled.current) return remove()
      if (
        btnRef.current &&
        e.target instanceof Node &&
        btnRef.current.contains(e.target)
      )
        return // để nút tự xử lý
      // Luôn gọi play() vì đây là user gesture thật -> bỏ qua cờ paused
      // (play() lúc mở đã đặt paused=false dù bị chặn).
      play()
      remove()
    }
    const remove = () => {
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
      window.removeEventListener('scroll', start)
      window.removeEventListener('touchstart', start)
    }
    window.addEventListener('pointerdown', start)
    window.addEventListener('keydown', start)
    window.addEventListener('scroll', start, { passive: true })
    window.addEventListener('touchstart', start, { passive: true })

    return remove
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
