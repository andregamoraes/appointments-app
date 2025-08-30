'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Plan = 'AVULSO' | 'QUINZENAL' | 'SEMANAL';

type BookingState = {
	therapistId?: number;
	therapistName?: string;
	dateISO?: string;
	time?: string;
	plan?: Plan;

	setTherapist: (id: number, name: string) => void;
	setSlot: (dateISO: string, time: string) => void;
	setPlan: (plan: Plan) => void;
	reset: () => void;
};

export const useBooking = create<BookingState>()(
	persist(
		set => ({
			therapistId: undefined,
			therapistName: undefined,
			dateISO: undefined,
			time: undefined,
			plan: undefined,

			setTherapist: (id, name) => set({ therapistId: id, therapistName: name }),
			setSlot: (dateISO, time) => set({ dateISO, time }),
			setPlan: plan => set({ plan }),
			reset: () =>
				set({
					therapistId: undefined,
					therapistName: undefined,
					dateISO: undefined,
					time: undefined,
					plan: undefined
				})
		}),
		{
			name: 'booking',
			storage: createJSONStorage(() => sessionStorage)
		}
	)
);
