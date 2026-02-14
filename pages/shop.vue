<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Pro Shop</h1>
            <p class="mt-2 text-gray-600">High-quality badminton equipment.</p>
        </div>
        <div class="relative">
             <NuxtLink to="/cart" class="flex items-center text-purple-600 hover:text-purple-800 font-medium">
                <svg class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart ({{ cartStore.totalItems }})
             </NuxtLink>
        </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-20">
        Loading...
    </div>

    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="product in products" :key="product.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100 group">
            <div class="h-48 bg-gray-200 relative overflow-hidden">
                 <img :src="product.image_url || 'https://images.unsplash.com/photo-1622629797619-c100e3e67e2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'" alt="Product" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            </div>
            <div class="p-4">
                <h3 class="text-lg font-bold text-gray-900 truncate">{{ product.name }}</h3>
                <p class="text-gray-500 text-sm mt-1 line-clamp-2 h-10">{{ product.description }}</p>
                <div class="mt-4 flex justify-between items-center">
                    <span class="text-lg font-bold text-purple-600">฿{{ product.price }}</span>
                    <button @click="cartStore.addToCart(product)" class="p-2 rounded-full bg-purple-50 text-purple-600 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-600 hover:text-white transition">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore()
const products = ref<any[]>([])
const loading = ref(false)

onMounted(async () => {
    loading.value = true
    try {
        const config = useRuntimeConfig()
        const { data } = await useFetch(`${config.public.apiBase}/products`)
        products.value = data.value as any[] || []
    } finally {
        loading.value = false
    }
})
</script>
