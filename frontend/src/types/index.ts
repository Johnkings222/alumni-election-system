export interface Candidate {
  id: string
  name: string
  position: Position
  bio?: string
  photoUrl?: string
}

export enum Position {
  PRESIDENT = 'President',
  VP = 'Vice President',
  GEN_SEC = 'General Secretary',
  FIN_SEC = 'Financial Secretary',
  TREASURER = 'Treasurer',
  AUDITOR = 'Auditor',
  PRO = 'Public Relations Officer'
}

export interface Vote {
  position: Position
  candidateId: string
}

export interface Voter {
  id: string
  code: string
  hasVoted: boolean
  votedAt?: string
}

export interface VoteSubmission {
  votingCode: string
  votes: Vote[]
}

export interface ElectionResults {
  position: Position
  candidates: {
    candidateId: string
    name: string
    voteCount: number
  }[]
}

export interface ElectionSettings {
  startTime: string
  endTime: string
  isActive: boolean
}
