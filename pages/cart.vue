<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg max-w-4xl mx-auto">
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Shopping Cart
      </h3>
      <NuxtLink to="/shop" class="text-sm font-medium text-primary-600 hover:text-primary-500">
        Continue Shopping &rarr;
      </NuxtLink>
    </div>
    
    <div v-if="cartStore.items.length === 0" class="px-4 py-10 text-center text-gray-500">
        Your cart is empty.
    </div>

    <div v-else class="border-t border-gray-200">
      <ul class="divide-y divide-gray-200">
        <li v-for="item in cartStore.items" :key="item.product.id" class="px-4 py-4 sm:px-6 flex items-center">
             <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img :src="item.product.image_url || 'https://via.placeholder.com/150'" alt="" class="h-full w-full object-cover object-center">
             </div>
             <div class="ml-4 flex-1 flex flex-col">
                <div>
                  <div class="flex justify-between text-base font-medium text-gray-900">
                    <h3><a href="#">{{ item.product.name }}</a></h3>
                    <p class="ml-4">฿{{ item.product.price * item.quantity }}</p>
                  </div>
                </div>
                <div class="flex-1 flex items-end justify-between text-sm">
                  <p class="text-gray-500">Qty {{ item.quantity }}</p>
                  <div class="flex">
                    <button type="button" @click="cartStore.removeFromCart(item.product.id)" class="font-medium text-red-600 hover:text-red-500">Remove</button>
                  </div>
                </div>
             </div>
        </li>
      </ul>
      
      <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div class="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>฿{{ cartStore.totalPrice }}</p>
        </div>
        <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
        <div class="mt-6">
          <button @click="cartStore.checkout" class="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-purple-500/25 hover:shadow-xl transition-all active:scale-95">Checkout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore()
</script>
