<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-extrabold text-slate-800">Dashboard</h1>
      <p class="mt-1 text-sm text-slate-500">Welcome back, {{ auth.user?.name }}! Here's your booking overview.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75"/></svg>
          </div>
          <div>
            <p class="text-2xl font-extrabold text-slate-800">{{ stats.total }}</p>
            <p class="text-xs font-medium text-slate-400">Total Bookings</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-extrabold text-slate-800">{{ stats.confirmed }}</p>
            <p class="text-xs font-medium text-slate-400">Confirmed</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-extrabold text-slate-800">{{ stats.pending }}</p>
            <p class="text-xs font-medium text-slate-400">Pending</p>
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"/></svg>
          </div>
          <div>
            <p class="text-2xl font-extrabold text-slate-800">฿{{ stats.totalSpent.toLocaleString() }}</p>
            <p class="text-xs font-medium text-slate-400">Total Spent</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Bookings -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-800">Recent Bookings</h2>
        <NuxtLink to="/files" class="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">
          View all →
        </NuxtLink>
      </div>

      <div v-if="pending" class="flex items-center justify-center py-16 text-slate-400">
        <svg class="animate-spin h-7 w-7 mr-3 text-indigo-500" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
      </div>

      <div v-else-if="!bookings || bookings.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400">
        <svg class="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75"/></svg>
        <p class="font-medium">No bookings yet</p>
        <p class="text-sm mt-1">Your bookings will appear here</p>
        <NuxtLink to="/" class="mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:shadow-xl">
          Book a Court
        </NuxtLink>
      </div>

      <ul v-else class="divide-y divide-slate-50">
        <li
          v-for="booking in bookings.slice(0, 5)"
          :key="booking.id"
          @click="navigateTo(`/booking/payment/${booking.booking_number}`)"
          class="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
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
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-bold text-slate-800 truncate">{{ booking.booking_number }}</p>
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                :class="{
                  'bg-green-100 text-green-700': booking.status === 'confirmed',
                  'bg-amber-100 text-amber-700': booking.status === 'pending_payment',
                  'bg-red-100 text-red-700': booking.status === 'cancelled' || booking.status === 'expired',
                }"
              >
                {{ booking.status?.replace('_', ' ') }}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ booking.items?.length || 0 }} court{{ (booking.items?.length || 0) > 1 ? 's' : '' }}
              · {{ new Date(booking.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) }}
            </p>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-sm font-extrabold text-slate-800">฿{{ Number(booking.total_price).toLocaleString() }}</p>
          </div>
          <svg class="h-4 w-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
        </li>
      </ul>
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
    key: 'dashboard-bookings',
    default: () => [],
})

const stats = computed(() => {
  const all = bookings.value || []
  return {
    total: all.length,
    confirmed: all.filter((b: any) => b.status === 'confirmed').length,
    pending: all.filter((b: any) => b.status === 'pending_payment').length,
    totalSpent: all.filter((b: any) => b.status === 'confirmed').reduce((sum: number, b: any) => sum + Number(b.total_price || 0), 0),
  }
})
</script>
