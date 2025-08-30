'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useBooking } from '@/lib/bookingStore'

type Props = {
  therapist: {
    id: number
    name: string
    description?: string
  }
}

export default function TherapistCard({ therapist }: Props) {
  const router = useRouter()
  const { id, name, description } = therapist
  const { setTherapist } = useBooking()

  const handleChoose = () => {
    setTherapist(id, name)
    router.push('/book/date')
  }

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="p-3 flex gap-3">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
          <Image src="/avatar.png" alt={name} fill className="object-cover" sizes="80px" />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 truncate">{name}</h2>

          {description && (
            <div className="mt-2">
              <p className="text-[11px] font-semibold text-gray-500">Sobre mim</p>
              <p className="text-xs text-gray-700 line-clamp-2">{description}</p>
            </div>
          )}
        </div>
      </div>

      <button
        className="w-full py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
        onClick={handleChoose}
      >
        Agendar
      </button>
    </div>
  )
}
