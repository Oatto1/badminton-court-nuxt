import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any | null,
        token: useCookie<string | null>('auth_token', { maxAge: 60 * 60 * 24 * 7 }).value || null,
        loading: false,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(credentials: any) {
            this.loading = true
            try {
                const { data, error } = await useApi('/auth/login', {
                    method: 'POST',
                    body: credentials
                })

                if (error.value) throw error.value

                const response = data.value as any
                this.setToken(response.token)
                this.user = response.user
                return true
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        },

        async register(data: any) {
            this.loading = true
            try {
                const { data: res, error } = await useApi('/auth/register', {
                    method: 'POST',
                    body: data
                })

                if (error.value) throw error.value

                const response = res.value as any
                this.setToken(response.token)
                this.user = response.user
                return true
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        },

        async fetchUser() {
            if (!this.token) {
                console.log('No token found during fetchUser')
                return
            }
            console.log('Fetching user with token:', this.token)
            this.loading = true
            try {
                const { data, error } = await useApi('/auth/me')

                if (error.value) {
                    console.error('Fetch user error:', error.value)
                    this.logout()
                    return
                }

                console.log('User fetched:', data.value)
                this.user = data.value
            } catch (e) {
                console.error('Fetch user exception:', e)
                this.logout()
            } finally {
                this.loading = false
            }
        },

        async logout() {
            // Client side logout
            this.setToken(null)
            this.user = null
            return navigateTo('/login')
        },

        setToken(token: string | null) {
            this.token = token
            const cookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 })
            cookie.value = token
        }
    }
})
