export default defineNuxtPlugin(async (nuxtApp) => {
    const auth = useAuthStore()

    console.log('Auth Plugin - Is Authenticated:', auth.isAuthenticated)
    console.log('Auth Plugin - User:', auth.user)

    // Check if there's a token but no user loaded (e.g. on refresh)
    if (auth.isAuthenticated && !auth.user) {
        console.log('Restoring user session...')
        await auth.fetchUser()
    }
})
