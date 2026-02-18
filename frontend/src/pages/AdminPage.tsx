import { useState, useEffect } from 'react'
import { adminAPI, candidatesAPI, votesAPI } from '@/services/api'
import { Candidate, Position, ElectionResults } from '@/types'

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'candidates' | 'voters' | 'results'>('candidates')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [candidateName, setCandidateName] = useState('')
  const [candidatePosition, setCandidatePosition] = useState<Position>(Position.PRESIDENT)
  const [candidateBio, setCandidateBio] = useState('')

  const [voters, setVoters] = useState<{ id: string; code: string; has_voted: boolean; voted_at?: string }[]>([])
  const [showGenerateForm, setShowGenerateForm] = useState(false)
  const [voterCount, setVoterCount] = useState(10)
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([])

  const [results, setResults] = useState<ElectionResults[]>([])

  useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuth')
    if (adminAuth === 'true') {
      setIsLoggedIn(true)
      loadCandidates()
      loadVoters()
      loadResults()
    }
  }, [])

  const loadCandidates = async () => {
    try {
      const data = await candidatesAPI.getAll()
      setCandidates(data)
    } catch (err) {
      console.error('Failed to load candidates', err)
    }
  }

  const loadVoters = async () => {
    try {
      const data = await adminAPI.getVoters()
      setVoters(data)
    } catch (err) {
      console.error('Failed to load voters', err)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await adminAPI.login(username, password)
      if (response.success) {
        setIsLoggedIn(true)
        sessionStorage.setItem('adminAuth', 'true')
        loadCandidates()
        loadVoters()
        loadResults()
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    }
  }

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await adminAPI.addCandidate({
        name: candidateName,
        position: candidatePosition,
        bio: candidateBio || undefined,
      })
      setSuccess(`${candidateName} added successfully!`)
      setCandidateName('')
      setCandidateBio('')
      setShowAddForm(false)
      loadCandidates()
    } catch (err) {
      setError('Failed to add candidate')
    }
  }

  const handleRemoveCandidate = async (candidate: Candidate) => {
    if (!window.confirm(`Remove ${candidate.name} from ${candidate.position}?`)) return
    setError('')
    setSuccess('')

    try {
      await adminAPI.removeCandidate(candidate.id)
      setSuccess(`${candidate.name} removed successfully!`)
      loadCandidates()
    } catch (err) {
      setError('Failed to remove candidate')
    }
  }

  const handleGenerateVoters = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await adminAPI.generateVoterCodes(voterCount)
      setGeneratedCodes(response.codes)
      setSuccess(`Generated ${response.codes.length} voting codes!`)
      loadVoters()
    } catch (err) {
      setError('Failed to generate voter codes')
    }
  }

  const loadResults = async () => {
    try {
      const data = await votesAPI.getResults()
      setResults(data)
    } catch (err) {
      console.error('Failed to load results', err)
    }
  }

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const blob = await adminAPI.exportResults(format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `election-results.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(`Failed to export to ${format}`)
    }
  }

  const downloadCodes = () => {
    const content = generatedCodes.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'voting-codes.txt'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ maxWidth: '500px', marginTop: '5rem' }}>
        <div className="card">
          <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Admin Login</h1>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Username
              </label>
              <input
                type="text"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Password
              </label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                borderRadius: '6px',
                marginBottom: '1rem',
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <button
          onClick={() => {
            setIsLoggedIn(false)
            sessionStorage.removeItem('adminAuth')
          }}
          className="btn btn-secondary"
        >
          Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--border)' }}>
        <button
          onClick={() => { setActiveTab('candidates'); loadCandidates() }}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            borderBottom: activeTab === 'candidates' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'candidates' ? 'var(--primary)' : 'var(--text-secondary)',
          }}
        >
          Manage Candidates
        </button>
        <button
          onClick={() => { setActiveTab('voters'); loadVoters() }}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            borderBottom: activeTab === 'voters' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'voters' ? 'var(--primary)' : 'var(--text-secondary)',
          }}
        >
          Manage Voters
        </button>
        <button
          onClick={() => {
            setActiveTab('results')
            loadResults()
          }}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            borderBottom: activeTab === 'results' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'results' ? 'var(--primary)' : 'var(--text-secondary)',
          }}
        >
          Results & Export
        </button>
      </div>

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

      {success && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#d1fae5',
          color: '#065f46',
          borderRadius: '6px',
          marginBottom: '1rem',
        }}>
          {success}
        </div>
      )}

      {activeTab === 'candidates' && (
        <div>
          {/* Header with Add button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>Candidates ({candidates.length})</h2>
            <button
              className="btn btn-primary"
              onClick={() => { setShowAddForm(!showAddForm); setError(''); setSuccess('') }}
            >
              {showAddForm ? '✕ Cancel' : '+ Add Candidate'}
            </button>
          </div>

          {/* Add Candidate Form */}
          {showAddForm && (
            <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ marginBottom: '1.25rem' }}>New Candidate</h3>
              <form onSubmit={handleAddCandidate}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. John Adeyemi"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>
                      Position
                    </label>
                    <select
                      className="input"
                      value={candidatePosition}
                      onChange={(e) => setCandidatePosition(e.target.value as Position)}
                    >
                      {Object.values(Position).map((pos) => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>
                    Bio <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>(optional)</span>
                  </label>
                  <textarea
                    className="input"
                    value={candidateBio}
                    onChange={(e) => setCandidateBio(e.target.value)}
                    rows={2}
                    style={{ resize: 'vertical' }}
                    placeholder="Brief description..."
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Add Candidate
                </button>
              </form>
            </div>
          )}

          {/* Candidates list grouped by position */}
          {Object.values(Position).map((pos) => {
            const group = candidates.filter((c) => c.position === pos)
            if (group.length === 0) return null
            return (
              <div key={pos} className="card" style={{ marginBottom: '1rem', padding: '1.25rem' }}>
                <h3 style={{ marginBottom: '0.75rem', color: 'var(--primary)', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {pos} <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>({group.length})</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {group.map((candidate) => (
                    <div
                      key={candidate.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.65rem 0.75rem',
                        backgroundColor: 'var(--background)',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: '500' }}>{candidate.name}</span>
                        {candidate.bio && (
                          <span style={{ marginLeft: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {candidate.bio}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveCandidate(candidate)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          border: '1px solid #ef4444',
                          borderRadius: '6px',
                          background: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          flexShrink: 0,
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {candidates.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              No candidates yet. Click "Add Candidate" to get started.
            </div>
          )}
        </div>
      )}

      {activeTab === 'voters' && (
        <div>
          {/* Header with Generate button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>
              Voting Codes ({voters.length})
              {voters.length > 0 && (
                <span style={{ marginLeft: '1rem', fontSize: '0.85rem', fontWeight: '400', color: 'var(--text-secondary)' }}>
                  {voters.filter(v => v.has_voted).length} used &nbsp;·&nbsp; {voters.filter(v => !v.has_voted).length} active
                </span>
              )}
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {generatedCodes.length > 0 && (
                <button onClick={downloadCodes} className="btn btn-secondary">
                  Download Last Batch
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={() => { setShowGenerateForm(!showGenerateForm); setError(''); setSuccess('') }}
              >
                {showGenerateForm ? '✕ Cancel' : '+ Generate Codes'}
              </button>
            </div>
          </div>

          {/* Generate Form */}
          {showGenerateForm && (
            <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ marginBottom: '1.25rem' }}>Generate New Codes</h3>
              <form onSubmit={async (e) => { await handleGenerateVoters(e); setShowGenerateForm(false) }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>
                      Number of Codes
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={voterCount}
                      onChange={(e) => setVoterCount(Number(e.target.value))}
                      min="1"
                      max="1000"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                    Generate
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* All codes list */}
          {voters.length > 0 ? (
            <div className="card" style={{ padding: '1.25rem' }}>
              {/* Legend */}
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }} />
                  Active
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
                  Used
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.5rem',
                maxHeight: '500px',
                overflowY: 'auto',
              }}>
                {voters.map((voter, index) => (
                  <div
                    key={voter.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      border: `1px solid ${voter.has_voted ? '#fecaca' : '#bbf7d0'}`,
                      backgroundColor: voter.has_voted ? '#fff5f5' : '#f0fdf4',
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
                      {index + 1}.
                    </span>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: '600',
                      letterSpacing: '0.05em',
                      color: voter.has_voted ? '#ef4444' : '#16a34a',
                      flex: 1,
                    }}>
                      {voter.code}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: voter.has_voted ? '#ef4444' : '#16a34a', fontWeight: '500' }}>
                      {voter.has_voted ? 'Used' : 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              No voting codes yet. Click "+ Generate Codes" to create some.
            </div>
          )}
        </div>
      )}

      {activeTab === 'results' && (
        <div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button onClick={() => handleExport('csv')} className="btn btn-primary">
              Export as CSV
            </button>
            <button onClick={() => handleExport('pdf')} className="btn btn-secondary">
              Export as PDF
            </button>
          </div>

          {results.map((positionResult) => {
            const totalVotes = positionResult.candidates.reduce((sum, c) => sum + c.voteCount, 0)
            const sortedCandidates = [...positionResult.candidates].sort((a, b) => b.voteCount - a.voteCount)

            return (
              <div key={positionResult.position} className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>{positionResult.position}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Total votes: {totalVotes}
                </p>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Rank</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem' }}>Candidate</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem' }}>Votes</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem' }}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCandidates.map((candidate, index) => {
                      const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0

                      return (
                        <tr key={candidate.candidateId} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '0.75rem', fontWeight: index === 0 ? '600' : '400' }}>
                            {index + 1}
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: index === 0 ? '600' : '400' }}>
                            {candidate.name}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            {candidate.voteCount}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            {percentage.toFixed(1)}%
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminPage
