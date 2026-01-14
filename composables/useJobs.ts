import { ref } from 'vue'
import type { Job } from '~/types/jobs'
import type { Skill } from '~/types/skills'

export const useJobs = () => {
    const { $api } = useNuxtApp()

    const jobs = useState<Job[]>('jobs:all', () => [])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function getJobs(query: string = ''): Promise<Job[]> {
        loading.value = true
        error.value = null

        try {
            const url = query && query.trim().length > 0 ? `/jobs?q=${encodeURIComponent(query)}` : '/jobs'
            const response = await $api<Job[]>(url, { method: 'GET' })
            jobs.value = response
            return response
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch jobs'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function getJobSkills(jobId: string): Promise<Skill[]> {
        loading.value = true
        error.value = null

        try {
            const response = await $api<Skill[]>(`/jobs/${jobId}/skills`, { method: 'GET' })
            return response
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch job skills'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        jobs,
        loading,
        error,
        getJobs,
        getJobSkills,
    }
}


