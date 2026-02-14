<template>
  <div v-if="loading" class="flex justify-center h-screen items-center">Loading...</div>
  <div v-else-if="order" class="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
           <h3 class="text-lg leading-6 font-medium text-gray-900">
            Order Details (#{{ order.reference_no }})
           </h3>
           <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Status: {{ order.status }}
           </p>
        </div>
        <div v-if="order.status === 'pending'">
             <span class="text-sm text-red-600 font-bold animate-pulse">Payment Required</span>
        </div>
      </div>
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-bold">฿{{ order.total_amount }}</dd>
          </div>
          
           <!-- Items List -->
           <div class="px-4 py-5 sm:px-6">
             <h4 class="text-sm font-medium text-gray-900 mb-2">Items</h4>
             <ul class="divide-y divide-gray-200">
                 <li v-for="item in order.items" :key="item.id" class="py-3 flex justify-between">
                     <span class="text-sm text-gray-600">
                        {{ item.item_type.includes('Booking') ? 'Court Booking' : 'Product' }} 
                        (x{{ item.quantity }})
                     </span>
                     <span class="text-sm font-medium">฿{{ item.subtotal }}</span>
                 </li>
             </ul>
           </div>
        </dl>
      </div>
    
      <!-- Payment Section -->
      <div v-if="order.status === 'pending'" class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 class="text-lg font-bold text-gray-900 mb-4 text-center">Scan to Pay (PromptPay)</h4>
          
          <div v-if="qrCode" class="flex flex-col items-center">
             <!-- QR Code Display (Simulated with text/image for now, real app uses a QR library) -->
             <div class="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4 h-64 w-64 flex items-center justify-center">
                 <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCode}`" alt="QR Code" />
             </div>
             
             <p class="text-sm text-gray-500 mb-4">Ref: {{ order.reference_no }}</p>

             <button @click="simulatePayment" class="mt-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-sm">
                (Dev Only) Simulate Successful Payment
             </button>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const route = useRoute()
const auth = useAuthStore()
const order = ref<any>(null)
const loading = ref(true)
const qrCode = ref<string | null>(null)

const fetchOrder = async () => {
    try {
        const config = useRuntimeConfig()
        const { data } = await useFetch(`${config.public.apiBase}/orders/${route.params.id}`, {
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        order.value = data.value
        
        if (order.value.status === 'pending') {
            // Fetch QR
             const { data: qrData } = await useFetch(`${config.public.apiBase}/orders/${route.params.id}/payment-qr`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            })
            qrCode.value = (qrData.value as any).qr_code
        }
    } catch (e) {
        alert('Error fetching order')
    } finally {
        loading.value = false
    }
}

const simulatePayment = async () => {
    const config = useRuntimeConfig()
    try {
        await $fetch(`${config.public.apiBase}/payment/simulate`, {
            method: 'POST',
            body: { order_id: order.value.id },
            headers: { Authorization: `Bearer ${auth.token}` }
        })
        alert('Payment simulated! Refreshing...')
        window.location.reload()
    } catch (e) {
        alert('Payment simulation failed')
    }
}

onMounted(() => {
    fetchOrder()
})
</script>
