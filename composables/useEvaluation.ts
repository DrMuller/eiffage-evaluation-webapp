import { ref } from 'vue'
import type { User } from '~/types/auth'
import type {
    Evaluation,
    CreateCompleteEvaluationRequest,
    JobSkillWithLevel
} from '~/types/evaluation'

// Hoisted shared state
const evaluations = ref<Evaluation[]>([])
const currentEvaluation = ref<Evaluation | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export const useEvaluation = () => {
    const { $api } = useNuxtApp()

    // Selected team member for current evaluation flow (persisted via useState)
    const selectedEvaluationUser = useState<User | null>('evaluation-selected-team-member', () => null)

    function setSelectedEvaluationUser(user: User | null) {
        selectedEvaluationUser.value = user
    }

    function clearSelectedEvaluationUser() {
        selectedEvaluationUser.value = null
    }

    // Get all evaluations
    async function getEvaluations(): Promise<Evaluation[]> {
        loading.value = true
        error.value = null

        try {
            const response = await $api<Evaluation[]>('/evaluations', {
                method: 'GET'
            })

            evaluations.value = response
            return response
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch evaluations'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Get evaluation by ID
    async function getEvaluationById(id: string): Promise<Evaluation> {
        loading.value = true
        error.value = null

        try {
            const response = await $api<Evaluation>(`/evaluations/${id}`, {
                method: 'GET'
            })

            currentEvaluation.value = response
            return response
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch evaluation'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Create complete evaluation (evaluation + skills)
    async function createCompleteEvaluation(data: CreateCompleteEvaluationRequest): Promise<Evaluation> {
        loading.value = true
        error.value = null

        try {
            const response = await $api<Evaluation>('/evaluations/complete', {
                method: 'POST',
                body: data
            })

            evaluations.value.push(response)
            currentEvaluation.value = response
            return response
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create evaluation'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Get job skills for a specific job
    async function getJobSkills(jobId: string): Promise<JobSkillWithLevel[]> {
        loading.value = true
        error.value = null

        try {
            const response = await $api<JobSkillWithLevel[]>(`/jobs/${jobId}/skills`, {
                method: 'GET'
            })

            return response
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch job skills'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        evaluations,
        currentEvaluation,
        selectedEvaluationUser,
        setSelectedEvaluationUser,
        clearSelectedEvaluationUser,
        loading,
        error,
        getEvaluations,
        getEvaluationById,
        createCompleteEvaluation,
        getJobSkills
    }
}

