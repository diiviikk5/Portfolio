import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Pixel from './pages/Pixel'

// the previous dark one-column page, kept around at /v1
const Home = lazy(() => import('./pages/Home'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pixel />} />
        <Route path="/v1" element={<Suspense fallback={null}><Home /></Suspense>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
