<template>
    <div>

        <div>
            <AppHeaderMenu />
            <!-- Header -->
            <div class="mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Évaluation des compétences</h1>
                    <p class="mt-2 text-sm text-gray-600">Evaluer librement les compétences d'un membre de votre équipe
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
                            <div class="flex items-center gap-3">
                                <div>
                                    <UButton variant="subtle" class="px-8 py-3 rounded-full"
                                        @click="openAddSkillsModal">
                                        Ajouter des compétences
                                    </UButton>
                                </div>
                                <div class="p-4 flex items-center gap-6">
                                    <div>
                                        <span class="text-6xl font-semibold text-primary-500">
                                            {{ evaluatedSkillsCount }}
                                        </span>
                                        <span class="text-4xl font-semibold text-gray-600">/{{ selectedSkills.length
                                            }}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </UCard>
                </div>

                <!-- Empty state -->
                <div v-if="selectedSkills.length === 0"
                    class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <UIcon name="i-heroicons-information-circle" class="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p class="text-blue-800 font-medium mb-4">Aucune compétence sélectionnée</p>
                </div>

                <!-- Skills List -->
                <div v-else>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <SkillsEvaluationSkillCard v-for="skill in selectedSkills" :key="skill._id"
                            :job-skill="skill" :is-evaluated="isSkillEvaluated(skill._id)"
                            :evaluation-score="skillEvaluations[skill._id]" :clickable="true" :removable="true"
                            @click="openEvaluationModal" @remove="removeSelectedSkill" />
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
                                Terminer l'évaluation ({{ evaluatedSkillsCount }}/{{ selectedSkills.length }})
                            </span>
                        </UButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Evaluation Modal -->
        <SkillsEvaluationModal v-model:open="isModalOpen" :skill="currentSkill" :level="observedLevel"
            @save="saveEvaluation" />

        <!-- Add Skills Modal -->
        <SkillsAddSkillsModal v-model:open="isAddModalOpen" :jobs="jobs" :skills="skills" :macro-skills="macroSkills"
            :macro-skill-types="macroSkillTypes" :already-selected-skills="selectedSkills"
            @add-skills="handleAddSkills" />

    </div>
</template>

<script setup lang="ts">
import type { Skill } from '~/types/skills'

definePageMeta({
    middleware: ['auth'],
    requiresAuth: true
})

const { createCompleteEvaluation, selectedEvaluationUser, setSelectedEvaluationUser } = useEvaluation()
const { jobs } = useJobs()
const { currentUser } = useUsers()
const { skills, macroSkills, macroSkillTypes } = useSkills()
const { init: initData, loading: _initLoading, error: _initError } = useInit()

const toast = useToast()
const router = useRouter()

// State
const selectedSkills = ref<Skill[]>([])
const isModalOpen = ref(false)
const currentSkill = ref<Skill | null>(null)

const observedLevel = ref(3)
const submitting = ref(false)

// Store evaluations as { skillId: observedLevel }
const skillEvaluations = ref<Record<string, number>>({})
const selectedUser = computed(() => selectedEvaluationUser.value)

const { currentCampaign } = useEvaluationCampaign()

// Computed
const evaluatedSkillsCount = computed(() => Object.keys(skillEvaluations.value).length)

// Load current user and job skills for selected team member
onMounted(async () => {
    try {
        await initData()
    } catch {
        toast.add({
            title: 'Erreur',
            description: 'Impossible de charger les données nécessaires',
            color: 'error'
        })
    }
    if (!selectedUser.value) {
        router.push('/')
        return
    }
})

// Add Skills Modal state
const isAddModalOpen = ref(false)

function openAddSkillsModal() {
    isAddModalOpen.value = true
}

function handleAddSkills(skillsToAdd: Skill[]) {
    for (const skill of skillsToAdd) {
        if (!selectedSkills.value.some(s => s._id === skill._id)) {
            selectedSkills.value.push(skill)
        }
    }
}

function removeSelectedSkill(skillId: string) {
    selectedSkills.value = selectedSkills.value.filter(s => s._id !== skillId)
    const { [skillId]: _removed, ...rest } = skillEvaluations.value
    skillEvaluations.value = rest
}

// Open modal to evaluate a skill
function openEvaluationModal(skill: Skill) {
    currentSkill.value = skill
    observedLevel.value = skillEvaluations.value[skill._id] ?? 3
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
        skillEvaluations.value[currentSkill.value._id] = level
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
    if (!currentCampaign.value) return

    submitting.value = true
    try {
        const evaluationData = {
            evaluation: {
                userId: selectedUser.value._id,
                managerUserId: currentUser.value._id,
                evaluationCampaignId: currentCampaign.value._id,
            },
            skills: selectedSkills.value
                .filter(skill => isSkillEvaluated(skill._id))
                .map(skill => ({
                    skillId: skill._id,
                    observedLevel: skillEvaluations.value[skill._id] ?? null
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
