import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { candidatesAPI, votesAPI } from '@/services/api'
import { Candidate, Position } from '@/types'

function VotingPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [votes, setVotes] = useState<Record<Position, string>>({} as Record<Position, string>)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const positions = Object.values(Position)

  useEffect(() => {
    const votingCode = sessionStorage.getItem('votingCode')
    if (!votingCode) {
      navigate('/')
      return
    }

    loadCandidates()
  }, [])

  const loadCandidates = async () => {
    try {
      const data = await candidatesAPI.getAll()
      setCandidates(data)
    } catch (err) {
      setError('Failed to load candidates')
    } finally {
      setLoading(false)
    }
  }

  const handleVoteChange = (position: Position, candidateId: string) => {
    setVotes({ ...votes, [position]: candidateId })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Object.keys(votes).length !== positions.length) {
      setError('Please vote for all positions before submitting')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const votingCode = sessionStorage.getItem('votingCode')!
      const voteSubmission = {
        votingCode,
        votes: Object.entries(votes).map(([position, candidateId]) => ({
          position: position as Position,
          candidateId,
        })),
      }

      await votesAPI.submit(voteSubmission)
      navigate('/confirmation')
    } catch (err) {
      setError('Failed to submit votes. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="container">Loading...</div>
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Cast Your Ballot</h1>

      <form onSubmit={handleSubmit}>
        {positions.map((position) => {
          const positionCandidates = candidates.filter(c => c.position === position)

          return (
            <div key={position} className="card" style={{ marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{position}</h2>

              {positionCandidates.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No candidates for this position</p>
              ) : (
                <div>
                  {positionCandidates.map((candidate) => (
                    <label
                      key={candidate.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem',
                        marginBottom: '0.5rem',
                        border: `2px solid ${votes[position] === candidate.id ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: votes[position] === candidate.id ? '#eff6ff' : 'transparent',
                      }}
                    >
                      <input
                        type="radio"
                        name={position}
                        value={candidate.id}
                        checked={votes[position] === candidate.id}
                        onChange={() => handleVoteChange(position, candidate.id)}
                        style={{ marginRight: '1rem' }}
                      />
                      <span style={{ fontWeight: '500' }}>{candidate.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '6px',
            marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {submitting ? 'Submitting...' : 'Submit Ballot'}
        </button>
      </form>
    </div>
  )
}

export default VotingPage
