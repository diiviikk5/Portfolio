import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Iso from './pages/Iso'

// the previous dark one-column page, kept around at /v1
const Home = lazy(() => import('./pages/Home'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Iso />} />
        <Route path="/v1" element={<Suspense fallback={null}><Home /></Suspense>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
