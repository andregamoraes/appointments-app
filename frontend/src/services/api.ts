'use client'

import { http } from '@/lib/api'

export type LoginPayload = { email: string; password: string }
export type LoginResponse = {
  access: string
  user: { id: number; name: string; type: 'PATIENT' | 'THERAPIST'; email: string }
}

export type User = {
  id: number
  name: string
  email: string
  description?: string
  type: 'PATIENT' | 'THERAPIST'
}

export type SlotsResponse = {
  date: string
  therapist_id: number
  available: string[]
}

export type AppointmentSummary = {
  active_plan: null | {
    id: number
    type: 'AVULSO' | 'QUINZENAL' | 'SEMANAL'
    therapist_name: string
  }
  next_appointments: Array<{
    id: number
    start: string
  }>
}

export const Api = {
  auth: {
    login(data: LoginPayload) {
      return http.post<LoginResponse>('/api/auth/login/', data).then(r => r.data)
    },
  },

  users: {
    list(params?: { type?: string }) {
      return http.get<User[]>('/api/users/', { params }).then(r => r.data)
    },
    get(id: number) {
      return http.get<User>(`/api/users/${id}/`).then(r => r.data)
    },
  },

  appointments: {
    slots(params? : { therapist_id: number, date: string }) {
      return http
        .get<SlotsResponse>('/api/appointments/slots/', { params })
        .then(r => r.data)
    },
    create(data: { therapist_id: number, start: string, plan: string }) {
      return http.post('/api/appointments/', data).then(r => r.data)
    },
    summary() {
      return http.get<AppointmentSummary>('/api/appointments/summary/').then(r => r.data)
    }
  },
}
