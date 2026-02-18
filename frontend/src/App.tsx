import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import VotingPage from './pages/VotingPage'
import ResultsPage from './pages/ResultsPage'
import ConfirmationPage from './pages/ConfirmationPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/vote" element={<VotingPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App
