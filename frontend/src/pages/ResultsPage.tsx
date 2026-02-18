import { useState, useEffect } from 'react'
import { votesAPI } from '@/services/api'
import { ElectionResults } from '@/types'

function ResultsPage() {
  const [results, setResults] = useState<ElectionResults[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResults()
    const interval = setInterval(loadResults, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const loadResults = async () => {
    try {
      const data = await votesAPI.getResults()
      setResults(data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load results', err)
    }
  }

  if (loading) {
    return <div className="container">Loading results...</div>
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1rem' }}>Live Election Results</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Results update automatically every 5 seconds
      </p>

      {results.map((positionResult) => {
        const totalVotes = positionResult.candidates.reduce((sum, c) => sum + c.voteCount, 0)
        const sortedCandidates = [...positionResult.candidates].sort((a, b) => b.voteCount - a.voteCount)

        return (
          <div key={positionResult.position} className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{positionResult.position}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Total votes: {totalVotes}
            </p>

            {sortedCandidates.map((candidate, index) => {
              const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0

              return (
                <div key={candidate.candidateId} style={{ marginBottom: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontWeight: index === 0 ? '600' : '500' }}>
                      {candidate.name}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {candidate.voteCount} votes ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--border)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: index === 0 ? 'var(--success)' : 'var(--primary)',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
          Back to Home
        </a>
      </div>
    </div>
  )
}

export default ResultsPage
