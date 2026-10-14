import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Minimal from './pages/Minimal'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Minimal />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
