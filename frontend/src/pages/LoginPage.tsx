import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '@/services/api'

function LoginPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await authAPI.verifyCode(code)
      if (result.success) {
        sessionStorage.setItem('votingCode', code)
        navigate('/vote')
      } else {
        setError('Invalid or already used voting code')
      }
    } catch (err) {
      setError('Unable to verify code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '5rem' }}>
      <div className="card">
        <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>
          Alumni Election 2003
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
          Enter your unique voting code to cast your ballot
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="code" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Voting Code
            </label>
            <input
              id="code"
              type="text"
              className="input"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter your code"
              required
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          {error && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '6px',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Verifying...' : 'Continue to Vote'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a
            href="/results"
            style={{ color: 'var(--primary)', textDecoration: 'none' }}
          >
            View Live Results
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
