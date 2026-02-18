import { useNavigate } from 'react-router-dom'

function ConfirmationPage() {
  const navigate = useNavigate()

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '5rem' }}>
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem',
          color: 'var(--success)'
        }}>
          ✓
        </div>

        <h1 style={{ marginBottom: '1rem', color: 'var(--success)' }}>
          Vote Submitted Successfully!
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          Thank you for participating in the Alumni Election 2003.
          Your vote has been recorded and cannot be changed.
        </p>

        <div style={{
          backgroundColor: 'var(--background)',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '2rem'
        }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Your voting code has been used and is no longer valid.
          </p>
        </div>

        <button
          onClick={() => navigate('/results')}
          className="btn btn-primary"
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          View Live Results
        </button>

        <a
          href="/"
          style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          Return to Home
        </a>
      </div>
    </div>
  )
}

export default ConfirmationPage
