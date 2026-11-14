import { useEffect, useRef, useState } from 'react'
import { wedding } from '../config/wedding'

// Nút nổi bật/tắt nhạc nền. Trình duyệt chặn autoplay có tiếng,
// nên mặc định tắt, chỉ phát sau khi khách bấm.
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) audio.play().catch(() => setPlaying(false))
    else audio.pause()
  }, [playing])

  if (!wedding.musicSrc) return null

  return (
    <>
      <audio ref={audioRef} src={wedding.musicSrc} loop preload="none" />
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
