<template>
    <div>

        <div>
            <AppHeaderMenu />
            <!-- Header -->
            <div class="mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Évaluation des compétences</h1>
                    <p class="mt-2 text-sm text-gray-600">Évaluez les compétences d'un membre de votre équipe sur son
                        emploi
                    </p>
                </div>
            </div>

            <!-- Step 1: Ensure Selected Team Member exists (redirect if not) -->
            <div v-if="!selectedUser" class="bg-white shadow rounded-lg p-6">
                <div class="text-center py-8">
                    <p class="text-gray-500">Redirection vers la sélection d'utilisateur...</p>
                </div>
            </div>

            <!-- Step 2: Evaluate Skills -->
            <div v-else>
                <div class="mb-6">
                    <UCard class="p-6 w-full">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex-shrink-0 h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center">
                                    <span class="text-white font-semibold text-2xl">
                                        {{ selectedUser.firstName[0] }}{{ selectedUser.lastName[0] }}
                                    </span>
                                </div>
                                <div>
                                    <h2 class="text-xl font-semibold text-gray-900">
                                        {{ selectedUser.firstName }} {{ selectedUser.lastName }}
                                    </h2>
                                    <p class="text-sm text-gray-500">{{ selectedUser.email }}</p>
                                </div>
                            </div>
                            <div class="p-4">
                                <span class="text-6xl font-semibold text-primary-500">
                                    {{ evaluatedSkillsCount }}
                                </span>
                                <span class="text-4xl font-semibold text-gray-600">/{{ jobSkills.length }}</span>
                            </div>
                        </div>
                    </UCard>
                </div>

                <!-- Loading Skills -->
                <div v-if="loadingSkills" class="flex justify-center py-12">
                    <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-primary-500" />
                </div>

                <!-- No Job Assigned -->
                <div v-else-if="!selectedUser.jobId"
                    class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                    <p class="text-yellow-800 font-medium">Cet utilisateur n'a pas d'emploi assigné</p>
                </div>

                <!-- No Skills for Job -->
                <div v-else-if="jobSkills.length === 0"
                    class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <UIcon name="i-heroicons-information-circle" class="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p class="text-blue-800 font-medium">Aucune compétence définie pour cet emploi</p>
                </div>

                <!-- Skills List -->
                <div v-else>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <SkillsEvaluationSkillCard v-for="jobSkill in jobSkills" :key="jobSkill.skill._id"
                            :job-skill="jobSkill" :is-evaluated="isSkillEvaluated(jobSkill.skill._id)"
                            :evaluation-score="skillEvaluations[jobSkill.skill._id]" :clickable="true"
                            @click="openEvaluationModal" />
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-center">
                        <UButton :disabled="evaluatedSkillsCount === 0 || submitting" class="px-8 py-3 rounded-full"
                            @click="submitEvaluation">
                            <span v-if="submitting" class="flex items-center gap-2">
                                <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
                                Envoi en cours...
                            </span>
                            <span v-else>
                                Terminer l'évaluation ({{ evaluatedSkillsCount }}/{{ jobSkills.length }})
                            </span>
                        </UButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Evaluation Modal -->
        <SkillsEvaluationModal v-model:open="isModalOpen" :job-skill="currentSkill" :level="observedLevel"
            @save="saveEvaluation" @update:open="onModalOpenUpdate" />

    </div>
</template>

<script setup lang="ts">
import type { JobSkillWithLevel } from '~/types/evaluation'

definePageMeta({
    middleware: ['auth'],
    requiresAuth: true
})

const { getJobSkills, createCompleteEvaluation, selectedEvaluationUser, setSelectedEvaluationUser } = useEvaluation()
const { getCurrentUser, currentUser } = useUsers()
const { getJobs, jobs } = useJobs()
const { getSkills, skills, getMacroSkillTypes, getMacroSkills, macroSkills, macroSkillTypes } = useSkills()

const toast = useToast()
const router = useRouter()

// State
const jobSkills = ref<JobSkillWithLevel[]>([])
const loadingSkills = ref(false)
const isModalOpen = ref(false)
const currentSkill = ref<JobSkillWithLevel | null>(null)

const observedLevel = ref(3)
const submitting = ref(false)

// Store evaluations as { skillId: observedLevel }
const skillEvaluations = ref<Record<string, number>>({})
const selectedUser = computed(() => selectedEvaluationUser.value)

// Computed
const evaluatedSkillsCount = computed(() => Object.keys(skillEvaluations.value).length)

// Load current user and job skills for selected team member
onMounted(async () => {
    try {
        if (!skills.value)
            await getSkills()
        if (!macroSkillTypes.value)
            await getMacroSkillTypes()
        if (!jobs.value)
            await getJobs()
        if (!macroSkills.value)
            await getMacroSkills()
        if (!currentUser.value)
            await getCurrentUser()
    } catch {
        toast.add({
            title: 'Erreur',
            description: 'Impossible de charger votre profil',
            color: 'error'
        })
    }

    if (!selectedUser.value) {
        router.push('/')
        return
    }

    await loadJobSkillsForSelectedUser()
})

async function loadJobSkillsForSelectedUser() {
    const user = selectedUser.value
    if (!user) return
    skillEvaluations.value = {}
    if (!user.jobId) {
        jobSkills.value = []
        return
    }
    loadingSkills.value = true
    try {
        jobSkills.value = await getJobSkills(user.jobId)
    } catch {
        toast.add({
            title: 'Erreur',
            description: 'Impossible de charger les compétences de l\'emploi',
            color: 'error'
        })
    } finally {
        loadingSkills.value = false
    }
}

// Open modal to evaluate a skill
function openEvaluationModal(jobSkill: JobSkillWithLevel) {
    currentSkill.value = jobSkill

    observedLevel.value = skillEvaluations.value[jobSkill.skill._id] ?? 3
    isModalOpen.value = true
}

// Close modal
function closeModal() {
    isModalOpen.value = false
    currentSkill.value = null
}

// Save evaluation
function saveEvaluation(level: number) {
    if (currentSkill.value) {
        skillEvaluations.value[currentSkill.value.skill._id] = level
        closeModal()
    }
}

function onModalOpenUpdate(value: boolean) {
    isModalOpen.value = value
    if (!value) {
        currentSkill.value = null
    }
}

// Check if skill is evaluated
function isSkillEvaluated(skillId: string): boolean {
    return skillId in skillEvaluations.value
}

// (removed) getObservedLevel helper was unused

// Submit complete evaluation
async function submitEvaluation() {
    if (!selectedUser.value || !currentUser.value) return

    submitting.value = true
    try {
        const evaluationData = {
            evaluation: {
                userId: selectedUser.value._id,
                userJobId: selectedUser.value.jobId || undefined,
                managerUserId: currentUser.value._id,
            },
            skills: jobSkills.value
                .filter(js => isSkillEvaluated(js.skill._id))
                .map(js => ({
                    skillId: js.skill._id,
                    expectedLevel: js.levelExpected,
                    observedLevel: skillEvaluations.value[js.skill._id] ?? null
                }))
        }

        await createCompleteEvaluation(evaluationData)
        router.push('/evaluation-success')
        setSelectedEvaluationUser(null)
    } catch {
        toast.add({
            title: 'Erreur',
            description: 'Impossible de créer l\'évaluation',
            color: 'error'
        })
    } finally {
        submitting.value = false
    }
}
</script>
