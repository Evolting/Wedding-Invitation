import { useEffect, useRef, useState } from 'react'
import { wedding } from '../config/wedding'

// Nút nổi bật/tắt nhạc nền.
// Autoplay có tiếng bị chặn (desktop chặn mạnh). Khi musicAutoplay = true:
// phát ở thao tác ĐẦU TIÊN của khách (chạm/cuộn/bấm bất kỳ đâu, trừ nút nhạc).
// KHÔNG gọi play() lúc mở để tránh promise pending gây interrupt gesture sau.
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const userControlled = useRef(false)
  const [playing, setPlaying] = useState(false)

  // Trạng thái lấy từ chính thẻ audio -> luôn đúng
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)
    return () => {
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
    }
  }, [])

  function toggle() {
    userControlled.current = true
    const a = audioRef.current
    if (!a) return
    console.log('[music] toggle, paused=', a.paused)
    if (a.paused) a.play().then(() => console.log('[music] toggle play OK')).catch((err) => console.log('[music] toggle play FAIL', err?.name, err?.message))
    else a.pause()
  }

  // Fallback: thao tác đầu tiên -> phát
  useEffect(() => {
    if (!wedding.musicSrc || !wedding.musicAutoplay) return
    console.log('[music] listeners armed')

    const start = (e: Event) => {
      console.log('[music] gesture:', e.type, 'target=', (e.target as HTMLElement)?.tagName)
      if (userControlled.current) return remove()
      if (
        btnRef.current &&
        e.target instanceof Node &&
        btnRef.current.contains(e.target)
      ) {
        console.log('[music] target is button -> skip, let onClick handle')
        return // nút tự xử lý, giữ listener
      }
      const a = audioRef.current
      console.log('[music] calling play(), readyState=', a?.readyState, 'paused=', a?.paused)
      a?.play().then(() => console.log('[music] gesture play OK')).catch((err) => console.log('[music] gesture play FAIL', err?.name, err?.message))
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
