<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-800">Order History</h1>
        <p class="mt-1 text-sm text-slate-500">All your bookings and their details</p>
      </div>
      <NuxtLink to="/" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:shadow-xl active:scale-95">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
        New Booking
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center py-20 text-slate-400">
      <svg class="animate-spin h-8 w-8 mr-3 text-indigo-500" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
      <span class="text-sm">Loading orders...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="!bookings || bookings.length === 0" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20">
      <svg class="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
      <p class="mt-4 text-lg font-semibold text-slate-400">No orders yet</p>
      <p class="text-sm text-slate-300">Start by booking a court</p>
    </div>

    <!-- Booking Cards -->
    <div v-else class="space-y-4">
      <div
        v-for="booking in bookings"
        :key="booking.id"
        class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md"
      >
        <!-- Card Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
          <div class="flex items-center gap-3">
            <div
              class="flex h-9 w-9 items-center justify-center rounded-xl"
              :class="{
                'bg-green-100 text-green-600': booking.status === 'confirmed',
                'bg-amber-100 text-amber-600': booking.status === 'pending_payment',
                'bg-red-100 text-red-600': booking.status === 'cancelled' || booking.status === 'expired',
              }"
            >
              <svg v-if="booking.status === 'confirmed'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <svg v-else-if="booking.status === 'pending_payment'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800">{{ booking.booking_number }}</p>
              <p class="text-xs text-slate-400">
                {{ new Date(booking.created_at).toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) }}
                · {{ new Date(booking.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
              :class="{
                'bg-green-100 text-green-700': booking.status === 'confirmed',
                'bg-amber-100 text-amber-700': booking.status === 'pending_payment',
                'bg-red-100 text-red-700': booking.status === 'cancelled' || booking.status === 'expired',
              }"
            >
              {{ booking.status?.replace('_', ' ') }}
            </span>
            <p class="text-lg font-extrabold text-slate-800">฿{{ Number(booking.total_price).toLocaleString() }}</p>
          </div>
        </div>

        <!-- Items -->
        <div class="divide-y divide-slate-50">
          <div
            v-for="item in booking.items"
            :key="item.id"
            class="flex items-center gap-4 px-6 py-3"
          >
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 flex-shrink-0">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15"/></svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-700">{{ item.court?.name || 'Court' }}</p>
              <p class="text-xs text-slate-400">{{ item.date }} · {{ item.start_time?.slice(0,5) }} - {{ item.end_time?.slice(0,5) }}</p>
            </div>
            <p class="text-sm font-bold text-slate-600 flex-shrink-0">฿{{ Number(item.price).toLocaleString() }}</p>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="flex items-center justify-end gap-2 px-6 py-3 bg-slate-50/30 border-t border-slate-50">
          <button
            v-if="booking.status === 'pending_payment'"
            @click="navigateTo(`/booking/payment/${booking.booking_number}`)"
            class="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow transition hover:shadow-lg active:scale-95"
          >
            Pay Now
          </button>
          <button
            @click="navigateTo(`/booking/payment/${booking.booking_number}`)"
            class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

if (!auth.isAuthenticated) {
    navigateTo('/login')
}

const { data: bookings, pending } = await useApi<any[]>('/bookings', {
    key: 'order-history',
    default: () => [],
})
</script>
