<template>
  <div class="space-y-5 pb-28">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-6 sm:p-8 text-white shadow-xl">
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%);"></div>
      <div class="relative">
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">🏸 Badminton Booking</h1>
        <p class="mt-1 text-indigo-200 text-sm">Select date and pick your preferred time slots</p>
        <div v-if="user" class="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
          <div class="h-5 w-5 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold">{{ user.name?.charAt(0) || 'U' }}</div>
          {{ user.name }}
        </div>
        <!-- Date + Search -->
        <div class="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="date"
            v-model="selectedDate"
            :min="today"
            class="flex-1 sm:flex-none rounded-xl border-0 bg-white/20 backdrop-blur-sm px-4 py-2.5 text-white shadow-inner ring-1 ring-white/30 focus:ring-2 focus:ring-white/60 focus:outline-none transition text-sm font-medium"
          />
          <button
            @click="fetchAvailability"
            class="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50 hover:shadow-xl active:scale-95"
          >
            Search
          </button>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-medium text-slate-500">
      <div class="flex items-center gap-1.5">
        <span class="inline-block h-3.5 w-3.5 rounded bg-emerald-50 ring-1 ring-emerald-200"></span> Available
      </div>
      <div class="flex items-center gap-1.5">
        <span class="inline-block h-3.5 w-3.5 rounded bg-gradient-to-br from-green-500 to-emerald-600"></span> Selected
      </div>
      <div class="flex items-center gap-1.5">
        <span class="inline-block h-3.5 w-3.5 rounded bg-slate-100 ring-1 ring-slate-200"></span> Booked
      </div>
    </div>

    <!-- Schedule Table -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div v-if="pending" class="flex items-center justify-center py-16 text-slate-400">
        <svg class="animate-spin h-7 w-7 mr-3 text-indigo-500" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        <span class="text-sm">Loading schedule...</span>
      </div>
      <div v-else class="overflow-x-auto">
        <div class="sm:hidden text-center text-xs text-slate-400 py-2">← Scroll horizontally →</div>
        <table class="w-full border-collapse" style="min-width: 920px;">
          <thead>
            <tr class="border-b border-slate-100">
              <th class="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider" style="width:90px;">
                Court
              </th>
              <th
                v-for="slot in (availability?.length ? availability[0].slots : [])"
                :key="slot.start"
                class="px-1.5 py-2 text-center align-middle"
                style="min-width: 76px;"
              >
                <div class="text-xs font-bold text-slate-700">{{ slot.start }}</div>
                <div class="text-[10px] font-medium text-slate-400 mt-0.5">{{ slot.end }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="court in availability" :key="court.id" class="group hover:bg-indigo-50/30 transition border-b border-slate-50">
              <td class="sticky left-0 z-10 bg-white group-hover:bg-indigo-50/30 px-4 py-3 border-r border-slate-100 transition">
                <span class="font-bold text-sm text-slate-700 whitespace-nowrap">{{ court.name }}</span>
              </td>
              <td
                v-for="slot in court.slots"
                :key="slot.start"
                class="px-1.5 py-2 text-center"
              >
                <button
                  @click="toggleSlot(court, slot)"
                  :disabled="slot.is_booked"
                  class="w-full rounded-xl py-4 text-xs font-bold transition-all duration-200"
                  :class="{
                    'bg-slate-50 text-slate-300 cursor-not-allowed': slot.is_booked,
                    'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/25 ring-2 ring-green-400/50': isSelected(court, slot),
                    'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:shadow-sm ring-1 ring-emerald-200/60': !slot.is_booked && !isSelected(court, slot)
                  }"
                >
                  <span v-if="isSelected(court, slot)" class="text-sm">✓</span>
                  <span v-else-if="slot.is_booked" class="line-through opacity-40 text-[10px]">Booked</span>
                  <span v-else>{{ slot.price }}</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Floating Footer -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div v-if="store.count > 0" class="fixed bottom-0 left-0 w-full z-50">
        <div class="border-t border-slate-200 bg-white/90 backdrop-blur-xl shadow-2xl">
          <div class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div class="flex items-center gap-3 sm:gap-5">
              <div class="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-600 font-extrabold text-base sm:text-lg">
                {{ store.count }}
              </div>
              <div>
                <p class="text-xs sm:text-sm font-medium text-slate-500">{{ store.count }} slot{{ store.count > 1 ? 's' : '' }}</p>
                <p class="text-lg sm:text-2xl font-extrabold text-slate-800">฿{{ store.totalPrice.toLocaleString() }}</p>
              </div>
            </div>
            <button
              @click="bookNow"
              :disabled="bookingPending"
              class="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 sm:px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-xl active:scale-95 disabled:opacity-50"
            >
              <span v-if="bookingPending" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Processing...
              </span>
              <span v-else>Book Now →</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useBookingStore } from '~/stores/booking'
import { useAuthStore } from '~/stores/auth'

const store = useBookingStore()
const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)
const today = new Date().toISOString().split('T')[0]
const selectedDate = ref(today)

const { data: availability, pending, refresh } = await useApi('/availability', {
    query: { date: selectedDate },
    watch: [selectedDate]
})

const fetchAvailability = () => refresh()

const isSelected = (court, slot) => {
    return store.selectedSlots.some(s =>
        s.court_id === court.id &&
        s.start_time === slot.start
    )
}

const toggleSlot = (court, slot) => {
    if (slot.is_booked) return
    const slotData = {
        court_id: court.id,
        court_name: court.name,
        date: selectedDate.value,
        start_time: slot.start,
        end_time: slot.end,
        price: slot.price
    }
    if (isSelected(court, slot)) {
        store.removeSlot(slotData)
    } else {
        store.addSlot(slotData)
    }
}

const bookingPending = ref(false)

const bookNow = async () => {
    if (!authStore.isAuthenticated) {
        alert('Please login to book')
        router.push('/login')
        return
    }
    bookingPending.value = true
    try {
        const { data } = await useApi('/bookings', {
            method: 'POST',
            body: { items: store.selectedSlots }
        })
        store.clearSlots()
        router.push(`/booking/${data.value.booking_number}`)
    } catch (e) {
        alert(e.data?.message || 'Booking failed')
    } finally {
        bookingPending.value = false
    }
}
</script>
