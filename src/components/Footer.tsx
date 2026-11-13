import { wedding } from '../config/wedding'
import Reveal from './Reveal'

export default function Footer() {
  return (
    <footer className="footer">
      <Reveal>
        <p className="footer__thanks">{wedding.thankYou}</p>
        <p className="footer__names">
          {wedding.groomName} &amp; {wedding.brideName}
        </p>
      </Reveal>
    </footer>
  )
}
