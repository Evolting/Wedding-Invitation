import { motion, useReducedMotion } from 'motion/react'
import { wedding } from '../config/wedding'

export default function Hero() {
  const reduce = useReducedMotion()
  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1, ease: 'easeOut' as const },
      }

  return (
    <section
      className="hero"
      style={
        wedding.heroImage
          ? { backgroundImage: `url(${wedding.heroImage})` }
          : undefined
      }
    >
      <div className="hero__overlay" />
      <motion.div className="hero__content" {...fade}>
        <p className="eyebrow">Save the Date</p>
        <h1 className="hero__names">
          {wedding.groomName}
          <span className="amp">&amp;</span>
          {wedding.brideName}
        </h1>
        <p className="hero__date">{wedding.dateText}</p>
      </motion.div>
      <div className="hero__scroll" aria-hidden="true">
        ↓
      </div>
    </section>
  )
}
