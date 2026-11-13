import Hero from './components/Hero'
import WeddingDetails from './components/WeddingDetails'
import Countdown from './components/Countdown'
import Gallery from './components/Gallery'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Hero />
      <WeddingDetails />
      <Countdown />
      <Gallery />
      {/* RSVP form — Phase 3 */}
      <Footer />
    </>
  )
}

export default App
