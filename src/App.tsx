import { wedding } from './config/wedding'
import './App.css'

function App() {
  return (
    <main className="card">
      <p className="eyebrow">Save the Date</p>
      <h1>
        {wedding.groomName}
        <span className="amp">&amp;</span>
        {wedding.brideName}
      </h1>
      <p className="placeholder">
        Trang thiệp cưới đang được xây dựng — Phase 1 (baseline deploy).
      </p>
    </main>
  )
}

export default App
