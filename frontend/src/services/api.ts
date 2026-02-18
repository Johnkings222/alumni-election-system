import axios from 'axios'
import { Candidate, VoteSubmission, ElectionResults, ElectionSettings } from '@/types'

const API_BASE: string = (import.meta as any).env?.VITE_API_URL ?? '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authAPI = {
  verifyCode: async (code: string) => {
    const response = await api.post('/auth/verify', { code })
    return response.data
  },
}

export const candidatesAPI = {
  getAll: async (): Promise<Candidate[]> => {
    const response = await api.get('/candidates')
    return response.data
  },
}

export const votesAPI = {
  submit: async (submission: VoteSubmission) => {
    const response = await api.post('/votes/submit', submission)
    return response.data
  },
  getResults: async (): Promise<ElectionResults[]> => {
    const response = await api.get('/votes/results')
    return response.data
  },
}

export const electionAPI = {
  getSettings: async (): Promise<ElectionSettings> => {
    const response = await api.get('/election/settings')
    return response.data
  },
}

export const adminAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/admin/login', { username, password })
    return response.data
  },
  getVoters: async () => {
    const response = await api.get('/admin/voters')
    return response.data
  },
  addCandidate: async (candidate: Omit<Candidate, 'id'>) => {
    const response = await api.post('/admin/candidates', candidate)
    return response.data
  },
  removeCandidate: async (id: string) => {
    const response = await api.delete(`/admin/candidates/${id}`)
    return response.data
  },
  generateVoterCodes: async (count: number) => {
    const response = await api.post('/admin/voters/generate', { count })
    return response.data
  },
  exportResults: async (format: 'csv' | 'pdf') => {
    const response = await api.get(`/admin/export/${format}`, {
      responseType: 'blob',
    })
    return response.data
  },
}
