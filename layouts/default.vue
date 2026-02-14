<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900">
    <!-- Navbar -->
    <nav class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-lg">
              🏸 
            </div>
            <span class="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BadmintonHub
            </span>
          </NuxtLink>

        

          <!-- Right Side -->
          <div class="flex items-center gap-3">
            <template v-if="auth.isAuthenticated">
              <div class="relative group">
                <button class="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                  <div class="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {{ auth.user?.name?.charAt(0) || 'U' }}
                  </div>
                  <span class="hidden sm:inline">{{ auth.user?.name }}</span>
                  <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                </button>
                <!-- Dropdown -->
                <div class="hidden group-hover:block absolute right-0 mt-1 w-52 rounded-xl bg-white shadow-xl ring-1 ring-slate-200/60 py-2 z-50">
                  <NuxtLink to="/dashboard" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z"/></svg>
                    Dashboard
                  </NuxtLink>
                  <NuxtLink to="/files" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12"/></svg>
                    Order History
                  </NuxtLink>
                  <div class="my-1 border-t border-slate-100"></div>
                  <a href="#" @click.prevent="auth.logout()" class="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>
                    Sign out
                  </a>
                </div>
              </div>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                Log in
              </NuxtLink>
              <NuxtLink to="/register" class="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 active:scale-95">
                Sign up
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Bottom Nav -->
    <div class="sm:hidden fixed bottom-0 left-0 z-40 w-full border-t border-slate-200 bg-white/90 backdrop-blur-xl">
      <div class="flex justify-around py-2">
        <NuxtLink to="/" class="flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium text-slate-500 transition hover:text-indigo-600">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"/></svg>
          Home
        </NuxtLink>
        <NuxtLink to="/dashboard" class="flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium text-slate-500 transition hover:text-indigo-600">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z"/></svg>
          Dashboard
        </NuxtLink>
      </div>
    </div>

    <main class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore();

onMounted(() => {
    if (!auth.user && auth.token) {
        auth.fetchUser();
    }
})
</script>

<style scoped>
/* .router-link-active {
    @apply bg-indigo-50 text-indigo-700;
} */
</style>
