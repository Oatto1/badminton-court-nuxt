<template>
  <div class="container mx-auto p-4 max-w-lg">
    <div v-if="pending" class="text-center p-10">Loading...</div>
    <div v-else-if="error" class="text-red-500 p-10">{{ error }}</div>
    <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white p-4 text-center relative">
        <h1 class="text-xl font-bold">Booking Details</h1>
        <div class="absolute right-4 top-4 text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
           {{ booking.booking_number }}
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Status Badge -->
        <div class="flex justify-center">
            <span :class="{
                'bg-yellow-100 text-yellow-800': booking.status === 'pending_payment',
                'bg-green-100 text-green-800': booking.status === 'paid',
                'bg-red-100 text-red-800': booking.status === 'expired',
                'bg-gray-100 text-gray-800': booking.status === 'cancelled',
            }" class="px-3 py-1 rounded-full text-sm font-semibold uppercase">
                {{ booking.status.replace('_', ' ') }}
            </span>
        </div>

        <!-- Timer -->
        <div v-if="booking.status === 'pending_payment'" class="text-center bg-red-50 border border-red-200 rounded p-4">
            <div class="text-red-600 font-bold text-xl">{{ timeLeft }}</div>
            <div class="text-xs text-red-400">Time remaining to pay</div>
        </div>

        <!-- Item List -->
        <div class="border rounded-lg overflow-hidden">
            <table class="w-full text-sm">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="p-3 text-left">Item</th>
                        <th class="p-3 text-right">Price</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <tr v-for="item in booking.items" :key="item.id">
                        <td class="p-3">
                            <div class="font-bold">{{ item.court.name }}</div>
                            <div class="text-gray-500 text-xs">
                                {{ item.date }} | {{ item.start_time.slice(0,5) }} - {{ item.end_time.slice(0,5) }}
                            </div>
                        </td>
                        <td class="p-3 text-right">
                            {{ Number(item.price).toLocaleString() }} THB
                        </td>
                    </tr>
                </tbody>
                <tfoot class="bg-gray-50 font-bold">
                    <tr>
                        <td class="p-3">Total</td>
                        <td class="p-3 text-right text-purple-600">
                            {{ Number(booking.total_price).toLocaleString() }} THB
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Payment Actions -->
        <div v-if="booking.status === 'pending_payment'" class="space-y-4">
            <div class="text-center">
                <img src="https://promptpay.io/0123456789/{{ booking.total_price }}.png" alt="PromptPay QR" class="mx-auto w-48 h-48 border p-2 rounded">
                <p class="text-xs text-gray-500 mt-2">Scan with any Bank App</p>
                <p class="text-xs text-gray-400 mt-1">Ref: {{ booking.booking_number }}</p>
            </div>
            
            <button @click="checkStatus" class="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-500/25 hover:from-violet-600 hover:to-purple-700 hover:shadow-xl transition-all active:scale-95">
                I have paid
            </button>
            <button @click="cancelBooking" class="w-full border border-gray-300 text-gray-600 py-3 rounded-lg font-bold hover:bg-gray-50 transition">
                Cancel Booking
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const code = route.params.code 

const { data: booking, pending, error, refresh } = await useApi(`/bookings/${code}`, {
    key: `booking-${code}`
})

// Timer Logic
const timeLeft = ref('00:00')
let timer = null

const updateTimer = () => {
    if (!booking.value || !booking.value.expires_at) return
    const expires = new Date(booking.value.expires_at).getTime()
    const now = new Date().getTime()
    const diff = expires - now

    if (diff <= 0) {
        timeLeft.value = 'Expired'
        if (booking.value.status === 'pending_payment') refresh()
        clearInterval(timer)
        return
    }

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    timeLeft.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
}

onMounted(() => {
    updateTimer()
    timer = setInterval(updateTimer, 1000)
})

onUnmounted(() => clearInterval(timer))

const checkStatus = async () => {
    try {
        await useApi('/payments/confirm', {
            method: 'POST',
            body: { booking_number: booking.value.booking_number }
        })
        refresh()
    } catch (e) {
        alert('Payment confirmation failed: ' + (e.message || 'Unknown error'))
    }
}

const cancelBooking = async () => {
    if(!confirm('Are you sure you want to cancel this booking?')) return
    
    try {
        await useApi(`/bookings/${code}/cancel`, {
            method: 'POST'
        })
        refresh()
    } catch (e) {
        alert(e.message)
    }
}
</script>
