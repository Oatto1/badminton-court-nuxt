import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', {
    state: () => ({
        selectedSlots: [] as any[], // Array of { court_id, date, start_time, end_time, price }
        currentBooking: null as any | null,
        selectedCourt: null as any | null,
        bookedSlots: [] as any[],
    }),
    actions: {
        addSlot(slot: any) {
            // Check if exists
            const exists = this.selectedSlots.find(s =>
                s.court_id === slot.court_id &&
                s.date === slot.date &&
                s.start_time === slot.start_time
            );
            if (!exists) {
                this.selectedSlots.push(slot);
            }
        },
        removeSlot(slot: any) {
            this.selectedSlots = this.selectedSlots.filter(s =>
                !(s.court_id === slot.court_id &&
                    s.date === slot.date &&
                    s.start_time === slot.start_time)
            );
        },
        clearSlots() {
            this.selectedSlots = [];
        },
        setBooking(booking: any) {
            this.currentBooking = booking;
        },
        async fetchAvailability(courtId: string, date: string) {
            // This is for the single court view [id].vue
            try {
                // We might need a specific endpoint for single court availability or filter the general one
                // For now, let's assume we can hit the general availability and filter, 
                // OR we presume the existence of /courts/{id}/availability if strictly following REST.
                // But looking at BookingService, getAvailability returns all courts.
                // Let's use the general one and filter for now to avoid creating new backend endpoints if possible,
                // or just fetch general and find the court.

                const { data } = await useApi<any>(`/availability?date=${date}`);
                if (data.value) {
                    const courtData = data.value.find((c: any) => c.id === courtId);
                    if (courtData) {
                        this.selectedCourt = {
                            id: courtData.id,
                            name: courtData.name,
                            hourly_price: courtData.slots[0]?.price || 0, // estimate
                        };
                        // The backend returns "slots" with "is_booked" boolean.
                        // But [id].vue expects "bookedSlots" array of ranges.
                        // We need to map the backend response to what [id].vue expects 
                        // OR update [id].vue to use the same logic as index.vue.
                        // Updating [id].vue to match index.vue logic is better but [id].vue has "generateDaySlots" frontend logic.
                        // Let's map it here to satisfy [id].vue for now.

                        this.bookedSlots = courtData.slots
                            .filter((s: any) => s.is_booked)
                            .map((s: any) => ({
                                start_time: `${date}T${s.start}:00`,
                                end_time: `${date}T${s.end}:00`
                            }));
                    }
                }
            } catch (e) {
                console.error("Failed to fetch court availability", e);
            }
        }
    },
    getters: {
        totalPrice: (state) => state.selectedSlots.reduce((sum, slot) => sum + Number(slot.price), 0),
        count: (state) => state.selectedSlots.length,
    }
})
