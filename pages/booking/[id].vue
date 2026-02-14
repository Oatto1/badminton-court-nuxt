<!-- <template>
  <div v-if="loading" class="flex justify-center py-20">
    <svg class="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
  <div v-else>
    <div class="mb-4">
        <NuxtLink to="/booking" class="text-primary-600 hover:text-primary-800 font-medium flex items-center">
            &larr; Back to Courts
        </NuxtLink>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-2xl leading-6 font-bold text-gray-900">
          {{ bookingStore.selectedCourt?.name }}
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Price: ฿{{ bookingStore.selectedCourt?.hourly_price }}/hour
        </p>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <label for="date" class="block text-sm font-medium text-gray-700">Select Date</label>
          <input type="date" v-model="date" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md" :min="today">
      </div>
    </div>

    <div class="bg-white shadow sm:rounded-lg p-6">
        <h4 class="text-lg font-medium text-gray-900 mb-4">Available Slots ({{ date }})</h4>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <button 
                v-for="slot in generatedSlots" 
                :key="slot.start"
                :disabled="!slot.available"
                @click="toggleSlot(slot)"
                :class="[
                    slot.available 
                        ? (isSelected(slot) ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white ring-2 ring-offset-2 ring-purple-400' : 'bg-white text-gray-900 border-gray-300 hover:bg-purple-50 hover:text-purple-700') 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed',
                    'border rounded-md py-3 px-4 text-sm font-medium focus:outline-none transition'
                ]"
            >
                {{ formatTime(slot.start) }} - {{ formatTime(slot.end) }}
            </button>
        </div>

        <div class="mt-8 border-t border-gray-200 pt-6 flex justify-between items-center">
            <div>
                <p class="text-lg font-medium text-gray-900">Selected: {{ selectedSlots.length }} hours</p>
                <p class="text-xl font-bold text-purple-600">Total: ฿{{ totalCost }}</p>
            </div>
            <button 
                @click="proceedToBook" 
                :disabled="selectedSlots.length === 0"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all shadow-purple-500/25 hover:shadow-xl active:scale-95"
            >
                Book Now
            </button>
        </div>
    </div>
  </div>
</template> -->

<script setup lang="ts">
import { useBookingStore } from '~/stores/booking';
import { useAuthStore } from '~/stores/auth';

const route = useRoute()
const bookingStore = useBookingStore()
const authStore = useAuthStore()

// Redirect if ID looks like a booking code (BK-...)
const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
if (id && id.startsWith('BK-')) {
    navigateTo(`/booking/payment/${id}`)
}

const today = new Date().toISOString().split('T')[0]
const date = ref(today)
const loading = ref(false)
const selectedSlots = ref<any[]>([])

// Helper to generate slots from 09:00 to 22:00
const generateDaySlots = () => {
    const slots = []
    const startHour = 9
    const endHour = 22
    const now = new Date()
    const isToday = date.value === today

    for (let i = startHour; i < endHour; i++) {
        const start = `${i.toString().padStart(2, '0')}:00`
        const end = `${(i + 1).toString().padStart(2, '0')}:00`
        
        // If today, mark past slots as unavailable
        const isPast = isToday && i <= now.getHours()

        const isBooked = isPast || bookingStore.bookedSlots.some((b: any) => {
            const bookedStart = new Date(b.start_time).getHours()
            const bookedEnd = new Date(b.end_time).getHours()
            return i >= bookedStart && i < bookedEnd
        })

        slots.push({
            start: start,
            end: end,
            available: !isBooked
        })
    }
    return slots
}

const generatedSlots = computed(() => generateDaySlots())

const fetchData = async () => {
    loading.value = true
    try {
        const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
        if (id) await bookingStore.fetchAvailability(id, date.value!)
        selectedSlots.value = [] // clear selection on date change
    } finally {
        loading.value = false
    }
}

watch(date, () => fetchData())

onMounted(() => fetchData())

const formatTime = (time: string) => time

const isSelected = (slot: any) => {
    return selectedSlots.value.some(s => s.start === slot.start)
}

const toggleSlot = (slot: any) => {
    if (isSelected(slot)) {
        selectedSlots.value = selectedSlots.value.filter(s => s.start !== slot.start)
    } else {
        selectedSlots.value.push(slot)
    }
}

const totalCost = computed(() => {
    return (bookingStore.selectedCourt?.hourly_price || 0) * selectedSlots.value.length
})

const proceedToBook = async () => {
    if (!authStore.isAuthenticated) {
        navigateTo('/login')
        return
    }

    // Direct booking call via BookingController
    // Construct items payload
    const items = selectedSlots.value.map(slot => {
        return {
            court_id: route.params.id,
            date: date.value,
            start_time: slot.start,
            end_time: slot.end
        }
    })

    try {
        loading.value = true
        const config = useRuntimeConfig()
        const { data, error } = await useFetch(`${config.public.apiBase}/bookings`, {
            method: 'POST',
            body: { items },
            headers: { Authorization: `Bearer ${authStore.token}` }
        })

        if (error.value) throw error.value

        const booking = data.value as any
        alert('Booking created successfully! Redirecting to payment...')
        
        // Navigate to booking confirmation page
        navigateTo(`/booking/payment/${booking.booking_number}`)
        
    } catch (e: any) {
        alert('Booking failed: ' + (e.data?.message || e.message))
    } finally {
        loading.value = false
    }
}
</script>
