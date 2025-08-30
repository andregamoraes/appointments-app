'use client'
import { useRouter } from 'next/navigation'
import { useBooking, Plan } from '@/lib/bookingStore'

type PlanMeta = {
  key: Plan
  title: string
  subtitle: string
  price: string
  per?: '/mês'
}

const PLANS: PlanMeta[] = [
  { key: 'AVULSO',    title: 'PLANO AVULSO',  subtitle: '1 Consulta, 40min',  price: 'R$ 50,00' },
  { key: 'QUINZENAL', title: 'PLANO QUINZENAL',  subtitle: '2 Consultas, 40min', price: 'R$ 100,00', per: '/mês' },
  { key: 'SEMANAL',   title: 'PLANO SEMANAL',  subtitle: '4 Consultas, 40min', price: 'R$ 200,00', per: '/mês' },
]

export default function PlanPage() {
  const router = useRouter()
  const { plan, setPlan, therapistId, dateISO, time } = useBooking()

  if (!therapistId || !dateISO || !time) {
    router.replace('/book/date');
    return null
  }

  const pick = (p: Plan) => {
    setPlan(p)
    router.push('/book/review')
  }

  return (
    <main className="min-h-screen bg-[#1E2030] text-white pb-28">
      <div className="mx-auto max-w-sm px-4 pt-6">
        <h1 className="text-center text-lg font-semibold mb-4">Planos</h1>

        <div className="space-y-4">
          {PLANS.map(p => {
            const isSelected = plan === p.key
            return (
              <button
                key={p.key}
                onClick={() => pick(p.key)}
                className={[
                  'w-full text-left bg-white rounded-2xl px-4 py-4 shadow transition border cursor-pointer hover:bg-gray-100',
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:shadow-md'
                ].join(' ')}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold tracking-wide text-gray-400">
                      {p.title}
                    </p>
                    <p className="text-gray-900 font-semibold mt-1">
                      {p.subtitle}
                    </p>
                  </div>

                  <div className="text-right leading-none">
                    <p className="text-pink-600 font-bold">{p.price}</p>
                    {!!p.per && (
                      <span className="text-[10px] text-gray-400">{p.per}</span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Botão voltar, se quiser igual ao mock */}
        <div className="mt-6">
          <button
            onClick={() => router.back()}
            className="w-full bg-white/90 text-gray-800 py-3 rounded-2xl font-semibold hover:bg-white cursor-pointer transition"
          >
            Voltar
          </button>
        </div>
      </div>
    </main>
  )
}
