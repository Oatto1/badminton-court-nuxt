import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] as any[],
    }),
    getters: {
        totalItems: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),
        totalPrice: (state) => state.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
    },
    actions: {
        addToCart(product: any) {
            const existing = this.items.find(i => i.product.id === product.id)
            if (existing) {
                existing.quantity++
            } else {
                this.items.push({ product, quantity: 1 })
            }
        },
        removeFromCart(productId: string) {
            this.items = this.items.filter(i => i.product.id !== productId)
        },
        clearCart() {
            this.items = []
        },
        async checkout() {
            const authStore = useAuthStore()
            if (!authStore.isAuthenticated) {
                navigateTo('/login')
                return
            }

            const itemsPayload = this.items.map(item => ({
                type: 'product',
                id: item.product.id,
                quantity: item.quantity
            }))

            try {
                const config = useRuntimeConfig()
                const { data, error } = await useFetch(`${config.public.apiBase}/orders`, {
                    method: 'POST',
                    body: { items: itemsPayload },
                    headers: { Authorization: `Bearer ${authStore.token}` }
                })

                if (error.value) throw error.value

                this.clearCart()
                const order = data.value as any
                navigateTo(`/orders/${order.id}`)
                return true
            } catch (e: any) {
                alert('Checkout failed: ' + (e.data?.message || e.message))
                return false
            }
        }
    }
})
