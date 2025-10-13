import { ref } from 'vue'
import type { EvaluationCampaign } from '~/types/evaluationCampaign'

// Hoisted state to ensure a single shared instance across the app
const campaigns = ref<EvaluationCampaign[]>([])
const currentCampaign = ref<EvaluationCampaign | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export const useEvaluationCampaign = () => {
    const { $api } = useNuxtApp()

    async function getCurrentEvaluationCampaign(): Promise<EvaluationCampaign | null> {
        loading.value = true
        error.value = null
        try {
            currentCampaign.value = await $api<EvaluationCampaign>('/evaluation-campaigns/current', { method: 'GET' })
        } catch (err) {
            currentCampaign.value = null
            if (err instanceof Error) error.value = err.message
        } finally {
            loading.value = false
        }
        return currentCampaign.value
    }

    return {
        campaigns,
        currentCampaign,
        loading,
        error,
        getCurrentEvaluationCampaign,
    }
}


