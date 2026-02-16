import { ref } from 'vue'

const loading = ref(false)

export const useNotification = () => {
    const { $api } = useNuxtApp()

    async function sendHrCampaignRequest(managerName: string): Promise<{ message: string }> {
        loading.value = true
        try {
            const response = await $api<{ message: string }>('/notifications/hr-campaign-request', {
                method: 'POST',
                body: { managerName },
            })
            return response
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        sendHrCampaignRequest,
    }
}
