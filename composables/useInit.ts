import { ref } from 'vue'

export const useInit = () => {
    const { getSkills, skills, getMacroSkills, macroSkills, getMacroSkillTypes, macroSkillTypes } = useSkills()
    const { getJobs, jobs } = useJobs()
    const { getCurrentUser, currentUser, getTeamMembers } = useUsers()
    const { getCurrentEvaluationCampaign, currentCampaign } = useEvaluationCampaign()
    const toast = useToast()
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function init() {
        loading.value = true
        error.value = null

        try {
            const tasks: Promise<unknown>[] = []
            if (!skills.value.length) tasks.push(getSkills())
            if (!macroSkillTypes.value.length) tasks.push(getMacroSkillTypes())
            if (!jobs.value.length) tasks.push(getJobs())
            if (!macroSkills.value.length) tasks.push(getMacroSkills())
            if (!currentUser.value) tasks.push(getCurrentUser())
            if (!currentCampaign.value) tasks.push(getCurrentEvaluationCampaign())
            if (tasks.length > 0) {
                await Promise.all(tasks)
            }
            if (currentUser.value) await getTeamMembers()
        } catch {
            toast.add({
                title: 'Erreur',
                description: 'Impossible de charger les données nécessaires',
                color: 'error'
            })
        } finally {
            loading.value = false
        }
    }

    return {
        skills,
        macroSkillTypes,
        jobs,
        macroSkills,
        currentUser,
        currentCampaign,
        loading,
        error,
        init,
    }
}
