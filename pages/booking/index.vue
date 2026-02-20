<template>
  <div class="space-y-8">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 px-8 py-10 text-white shadow-xl">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30"></div>
      <div class="relative">
        <h1 class="text-3xl font-extrabold tracking-tight">🏸 Book a Court</h1>
        <p class="mt-2 text-indigo-200">Select a date and pick your preferred time slots</p>
      </div>
      <!-- Date Picker -->
      <div class="relative mt-6 flex items-center gap-4">
        <div class="relative">
          <input
            type="date"
            v-model="selectedDate"
            :min="minDate"
            class="rounded-xl border-0 bg-white/20 backdrop-blur-sm px-5 py-3 text-white placeholder-white/60 shadow-inner ring-1 ring-white/30 focus:ring-2 focus:ring-white/60 focus:outline-none transition text-base font-medium"
          />
        </div>
        <button
          @click="fetchAvailability"
          :disabled="loading"
          class="rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Loading...
          </span>
          <span v-else>Check Availability</span>
        </button>
      </div>
    </div>

    <!-- Court Grid -->
    <div v-if="schedules.length > 0" class="space-y-6">
      <div
        v-for="court in schedules"
        :key="court.id"
        class="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
      >
        <!-- Court Name -->
        <div class="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15"/></svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-800">{{ court.name }}</h3>
              <p class="text-xs text-slate-500 mt-0.5" v-if="court.open_time">Hours: {{ court.open_time }} - {{ court.close_time }}</p>
            </div>
          </div>
          <span class="sm:ml-auto w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            ฿{{ court.slots[0]?.price || 0 }}/hr
          </span>
        </div>

        <!-- Time Slots Grid -->
        <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-[repeat(auto-fit,minmax(72px,1fr))] gap-2">
          <button
            v-for="slot in court.slots"
            :key="slot.start"
            @click="toggleSlot(court, slot)"
            :disabled="slot.is_booked"
            class="relative rounded-xl px-2 py-3 text-center text-sm font-semibold transition-all duration-200"
            :class="[
              slot.is_booked
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed line-through'
                : isSelected(court.id, slot.start)
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-105 ring-2 ring-green-400 ring-offset-2'
                  : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md hover:scale-[1.02] ring-1 ring-slate-200'
            ]"
          >
            <div class="text-xs font-bold">{{ slot.start }}</div>
            <div class="mt-0.5 text-[10px] opacity-70">{{ slot.end }}</div>
            <!-- Selected checkmark -->
            <div
              v-if="isSelected(court.id, slot.start)"
              class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-green-600 shadow"
            >
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && hasSearched" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16">
      <svg class="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
      <p class="mt-4 text-lg font-semibold text-slate-400">No schedules found</p>
      <p class="text-sm text-slate-300">Try selecting a different date</p>
    </div>

    <!-- Booking Summary Bar -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div v-if="selectedSlots.length > 0" class="fixed bottom-0 left-0 z-50 w-full">
        <div class="border-t border-slate-200 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-900/10">
          <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div class="flex items-center gap-6">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 font-bold text-lg">
                {{ selectedSlots.length }}
              </div>
              <div>
                <p class="text-sm font-medium text-slate-500">{{ selectedSlots.length }} slot{{ selectedSlots.length > 1 ? 's' : '' }} selected</p>
                <p class="text-2xl font-extrabold text-slate-800">฿{{ totalAmount.toLocaleString() }}</p>
              </div>
            </div>
            <button
              @click="proceedToBooking"
              :disabled="processing"
              class="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 active:scale-95 disabled:opacity-50"
            >
              <span v-if="processing" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Processing...
              </span>
              <span v-else>Book Now →</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Bottom spacer when summary bar is visible -->
    <div v-if="selectedSlots.length > 0" class="h-24"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'

const selectedDate = ref(new Date().toISOString().split('T')[0])
const minDate = new Date().toISOString().split('T')[0]
const schedules = ref<any>({})
const loading = ref(false)
const hasSearched = ref(false)
const processing = ref(false)

const selectedSlots = ref<any[]>([])

const totalAmount = computed(() => {
  return selectedSlots.value.reduce((sum: number, slot: any) => sum + Number(slot.price), 0)
})

const fetchAvailability = async () => {
  loading.value = true
  schedules.value = {}
  selectedSlots.value = []

  try {
    const { data } = await useApi<any>(`/booking/availability?date=${selectedDate.value}`)
    if (data.value) {
      schedules.value = data.value
    }
  } catch (e) {
    alert('Failed to load schedules')
  } finally {
    loading.value = false
    hasSearched.value = true
  }
}

const isSelected = (courtId: string, startTime: string) => {
  return selectedSlots.value.some(s => s.court_id === courtId && s.start_time === startTime)
}

const toggleSlot = (court: any, slot: any) => {
  if (isSelected(court.id, slot.start)) {
    selectedSlots.value = selectedSlots.value.filter(s => !(s.court_id === court.id && s.start_time === slot.start))
  } else {
    selectedSlots.value.push({
      court_id: court.id,
      date: selectedDate.value,
      start_time: slot.start,
      end_time: slot.end,
      price: slot.price
    })
  }
}

const proceedToBooking = async () => {
  if (selectedSlots.value.length === 0) return

  processing.value = true
  try {
    const { data, error } = await useApi<any>('/booking/hold', {
      method: 'POST',
      body: {
        items: selectedSlots.value
      }
    })

    if (error.value) throw error.value

    const booking = data.value
    navigateTo(`/booking/payment/${booking.booking_number}`)

  } catch (e: any) {
    alert(e.data?.message || 'Booking failed. Slots might be taken.')
    fetchAvailability()
  } finally {
    processing.value = false
  }
}
</script>
