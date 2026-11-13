import { useEffect, useState } from 'react'
import { wedding } from '../config/wedding'
import Reveal from './Reveal'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

function calc(target: number): TimeLeft {
  const diff = target - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  }
  const s = Math.floor(diff / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: false,
  }
}

export default function Countdown() {
  // weddingDate có offset +07:00 nên getTime() đúng mốc tuyệt đối,
  // không phụ thuộc múi giờ máy khách.
  const target = new Date(wedding.weddingDate).getTime()
  const [t, setT] = useState<TimeLeft>(() => calc(target))

  useEffect(() => {
    const id = setInterval(() => setT(calc(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const units: [number, string][] = [
    [t.days, 'Ngày'],
    [t.hours, 'Giờ'],
    [t.minutes, 'Phút'],
    [t.seconds, 'Giây'],
  ]

  return (
    <section className="section countdown">
      <Reveal>
        <h2 className="section__title">Đếm ngược</h2>
        {t.done ? (
          <p className="countdown__done">Hôm nay là ngày trọng đại ❤</p>
        ) : (
          <div className="countdown__grid">
            {units.map(([value, label]) => (
              <div className="countdown__unit" key={label}>
                <span className="countdown__num">
                  {String(value).padStart(2, '0')}
                </span>
                <span className="countdown__label">{label}</span>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  )
}
