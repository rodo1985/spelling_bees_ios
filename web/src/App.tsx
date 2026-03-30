import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WelcomeScreen from './screens/WelcomeScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
      </Routes>
    </BrowserRouter>
  )
}
