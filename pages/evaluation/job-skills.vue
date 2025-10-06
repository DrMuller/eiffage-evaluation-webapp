<template>
    <div class="bg-gray-50">
        <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Évaluation des compétences</h1>
                <p class="mt-2 text-sm text-gray-600">Évaluez les compétences d'un membre de votre équipe sur son emploi
                </p>
            </div>

            <!-- Step 1: Ensure Selected Team Member exists (redirect if not) -->
            <div v-if="!selectedUser" class="bg-white shadow rounded-lg p-6">
                <div class="text-center py-8">
                    <p class="text-gray-500">Redirection vers la sélection d'utilisateur...</p>
                </div>
            </div>

            <!-- Step 2: Evaluate Skills -->
            <div v-else>
                <!-- Selected User Info -->
                <div class="bg-white shadow rounded-lg p-6 mb-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div
                                class="flex-shrink-0 h-16 w-16 bg-red-600 rounded-full flex items-center justify-center">
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
                        <button
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            @click="resetSelection">
                            Changer d'utilisateur
                        </button>
                    </div>
                </div>

                <!-- Loading Skills -->
                <div v-if="loadingSkills" class="flex justify-center py-12">
                    <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-red-600" />
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
                    <div class="mb-4">
                        <p class="text-sm text-gray-600">
                            Cliquez sur une compétence pour l'évaluer.
                            {{ evaluatedSkillsCount }}/{{ jobSkills.length }} compétences évaluées
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <UCard v-for="jobSkill in jobSkills" :key="jobSkill.skill._id"
                            class="rounded-lg hover:shadow-md active:shadow-md transition-all text-left relative cursor-pointer"
                            :class="isSkillEvaluated(jobSkill.skill._id) ? 'border-1 border-green-500 bg-green-50' : 'border-gray-200'"
                            :ui="{ body: 'h-full' }" @click="openEvaluationModal(jobSkill)">

                            <div class="p-4 h-full space-y-2 flex flex-col justify-between">
                                <div class="flex items-start gap-3">
                                    <div class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg font-bold text-sm"
                                        :class="isSkillEvaluated(jobSkill.skill._id) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'">
                                        {{ isSkillEvaluated(jobSkill.skill._id) ?
                                            `${skillEvaluations[jobSkill.skill._id]}/5` : '-/5' }}
                                    </div>
                                    <h3 class="text-sm font-semibold text-gray-900 flex-1">{{ jobSkill.skill.name
                                    }}
                                    </h3>
                                </div>
                                <div class="flex items-center justify-between pt-2 border-t border-gray-200">
                                    <p class="text-xs text-gray-500">
                                        <span class="font-medium">Niveau attendu:</span>
                                        {{ jobSkill.levelExpected || 'Non défini' }}
                                    </p>
                                </div>
                            </div>
                        </UCard>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-center">
                        <button :disabled="evaluatedSkillsCount === 0 || submitting"
                            class="px-8 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            @click="submitEvaluation">
                            <span v-if="submitting" class="flex items-center gap-2">
                                <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
                                Envoi en cours...
                            </span>
                            <span v-else>
                                Terminer l'évaluation ({{ evaluatedSkillsCount }}/{{ jobSkills.length }})
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Evaluation Modal -->
        <UModal v-model:open="isModalOpen" title="Évaluation">
            <template #body>
                <div class="p-6">
                    <div v-if="currentSkill" class="space-y-6">
                        <!-- Skill Details -->
                        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                            <p class="text-sm text-gray-600">
                                <span class="font-medium">{{ currentSkill.skill.name }}</span>
                            </p>
                            <p class="text-sm text-gray-600">
                                <span class="font-medium">Niveau attendu:</span>
                                {{ currentSkill.levelExpected || 'Non défini' }}
                            </p>
                        </div>

                        <!-- Slider -->
                        <div class="space-y-4">
                            <label class="block text-sm font-medium text-gray-700">
                                Niveau observé: <span class="text-red-600 font-bold text-lg">{{ observedLevel }}</span>
                            </label>
                            <USlider v-model="observedLevel" :min="0" :max="5" :step="1" />
                            <div class="flex justify-between text-xs text-gray-500">
                                <span>0</span>
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex justify-end gap-3 pt-4">
                            <button
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                @click="closeModal">
                                Annuler
                            </button>
                            <button
                                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                @click="saveEvaluation">
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import type { JobSkillWithLevel } from '~/types/evaluation'

definePageMeta({
    middleware: ['auth'],
    requiresAuth: true
})

const { getJobSkills, createCompleteEvaluation, selectedEvaluationUser, clearSelectedEvaluationUser } = useEvaluation()
const { getCurrentUser, currentUser } = useUsers()
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

// Reset selection
function resetSelection() {
    clearSelectedEvaluationUser()
    jobSkills.value = []
    skillEvaluations.value = {}
    router.push('/')
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
function saveEvaluation() {
    if (currentSkill.value) {
        skillEvaluations.value[currentSkill.value.skill._id] = observedLevel.value
        closeModal()
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
                    observedLevel: skillEvaluations.value[js.skill._id]
                }))
        }

        await createCompleteEvaluation(evaluationData)

        toast.add({
            title: 'Succès',
            description: 'L\'évaluation a été créée avec succès',
            color: 'success'
        })

        // Redirect to home or evaluations list
        router.push('/')
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
