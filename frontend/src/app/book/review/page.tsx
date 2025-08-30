'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, Clock, UserRound, CreditCard, CheckCircle2} from 'lucide-react'
import { useBooking } from '@/lib/bookingStore'
import { Api } from '@/services/api'

function fmtDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export default function ReviewPage() {
  const router = useRouter()
  const { therapistId, therapistName, dateISO, time, plan } = useBooking()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)

  if (!therapistId || !dateISO || !time || !plan) {
    router.replace('/book/therapist')
    return null
  }

  const confirm = () => {
    setError('')
    setSubmitting(true)
    const data = {
        therapist_id: therapistId!,
        start: `${dateISO}T${time}:00Z`,
        plan: plan!,
    };

    Api.appointments.create(data)
      .then(() => {
        setSuccess(true)
        setTimeout(() => {
            router.replace('/home')
        }, 2000)
      })
      .catch((error) => {
        setError(error.response?.data?.detail || 'Erro ao confirmar consulta. Tente novamente.')
        setSubmitting(false)
      })
  }

  return (
    <main className="min-h-screen bg-[#1E2030] text-white pb-28 flex items-center justify-center">
      <div className="mx-auto max-w-sm px-4 pt-6 w-full">
        {!success ? (
          <>
            <h1 className="text-2xl font-extrabold mb-5">Revisar</h1>

            <div className="bg-white text-gray-900 rounded-2xl shadow p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100">
                  <UserRound className="w-5 h-5 text-gray-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-500">TERAPEUTA</p>
                  <p className="font-semibold truncate">{therapistName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100">
                  <CalendarDays className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">DATA</p>
                  <p className="font-semibold">{fmtDate(dateISO)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100">
                  <Clock className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">HORÁRIO</p>
                  <p className="font-semibold">{time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-100">
                  <CreditCard className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500">PLANO</p>
                  <p className="font-semibold">{plan}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-100 text-red-700 text-sm px-4 py-2 rounded-xl">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={confirm}
                disabled={submitting}
                className={`w-full py-3 rounded-2xl font-semibold transition cursor-pointer
                  ${submitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                `}
              >
                {submitting ? 'Confirmando...' : 'Confirmar'}
              </button>

              <button
                onClick={() => router.back()}
                className="w-full py-3 rounded-2xl font-semibold bg-white/90 text-gray-800 hover:bg-white transition cursor-pointer"
              >
                Voltar
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white text-gray-900 rounded-2xl shadow p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold">Consulta confirmada!</h2>
            <p className="text-sm text-gray-600 mt-2">Você será redirecionado para a Home.</p>
          </div>
        )}
      </div>
    </main>
  )
}
