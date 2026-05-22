import { useState } from 'react'
import Header from './components/Header'
import HomePage from './components/HomePage'
import DashboardPage from './components/DashboardPage'
import HowItWorks from './components/HowItWorks'
import FloatingLeaves3D from './components/FloatingLeaves3D'
import Footer from './components/Footer'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="app">
      <div className="bg-animated" />
      <FloatingLeaves3D count={14} />
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div style={{ display: currentPage === 'home' ? 'block' : 'none' }}>
        <main className="container" style={{ paddingBottom: 60 }}>
          <HomePage onNavigate={setCurrentPage} />
        </main>
      </div>

      <div style={{ display: currentPage === 'dashboard' ? 'block' : 'none' }}>
        <DashboardPage />
      </div>

      <div style={{ display: currentPage === 'howItWorks' ? 'block' : 'none' }}>
        <main className="container" style={{ paddingBottom: 60 }}>
          <HowItWorks />
        </main>
      </div>

      <Footer />
    </div>
  )
}
