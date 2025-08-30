'use client'

import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { useRouter } from 'next/navigation'
import { useBooking } from '@/lib/bookingStore'
import { Api } from '@/services/api'

const ymd = (d: Date) => d.toISOString().slice(0, 10) // YYYY-MM-DD

const initialDate = (() => {
  const d = new Date()
  const dow = d.getDay()
  if (dow === 0) d.setDate(d.getDate() + 1)
  if (dow === 6) d.setDate(d.getDate() + 2)
  return d
})()

export default function PickDatePage() {
  const router = useRouter()
  const { therapistId, therapistName, setSlot } = useBooking()

  const [date, setDate] = useState<Date>(initialDate)
  const [times, setTimes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadSlots = (d: Date) => {
    if (!therapistId) return
    setLoading(true)
    setError('')

    const filter = {
        therapist_id: therapistId, date: ymd(d)
    };

    Api.appointments.slots(filter).then(res => {
      setTimes(res.available ?? [])
    }).catch(e => {
      setError('Falha ao carregar horários.')
      setTimes([])
    }).finally(() => {
      setLoading(false)
    })
  }


  useEffect(() => {
    if (!therapistId) {
      router.replace('/therapists')
      return
    }
    loadSlots(date)
  }, [])

  const chooseDate = (value: unknown) => {
    const d = Array.isArray(value) ? value[0] : (value as Date)
    setDate(d)
    loadSlots(d)
  }

  const chooseTime = (t: string) => {
    const iso = ymd(date)
    setSlot(iso, t)
    router.push('/book/plan')
  }

  return (
    <main className="max-w-sm mx-auto p-4">
      <h1 className="text-lg font-semibold mb-1">Escolher Horário</h1>
      <p className="text-sm text-gray-600 mb-3">Com {therapistName}</p>

      <div className="bg-white rounded-2xl shadow p-2">
        <Calendar
          onChange={chooseDate}
          value={date}
          minDate={new Date()}
          locale="pt-BR"
          tileDisabled={({ date }) => [0, 6].includes(date.getDay())}
        />
      </div>

      {loading && <p className="mt-4 text-gray-500">Carregando horários…</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {!loading && !!times.length && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {times.map(t => (
            <button
              key={t}
              onClick={() => chooseTime(t)}
              className="px-3 py-2 bg-green-200 rounded cursor-pointer hover:bg-green-300 text-sm font-medium"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {!loading && !error && !times.length && (
        <p className="mt-4 text-gray-500">Sem horários para o dia selecionado.</p>
      )}

      <div className="mt-6">
        <button
          onClick={() => router.back()}
          className="w-full bg-gray text-gray-800 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition cursor-pointer"
        >
          Voltar
        </button>
      </div>
    </main>
  )
}
