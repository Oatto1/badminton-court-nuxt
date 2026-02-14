export const useApi = async <T>(request: string, opts?: any) => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    return useFetch<T>(request, {
        baseURL: config.public.apiBase || 'http://localhost:8000/api', // Fallback
        ...opts,
        headers: {
            ...opts?.headers,
            Authorization: authStore.token ? `Bearer ${authStore.token}` : '',
            Accept: 'application/json',
        },
        onResponseError({ response }) {
            if (response.status === 401) {
                authStore.logout()
                navigateTo('/login')
            }
        }
    })
}
