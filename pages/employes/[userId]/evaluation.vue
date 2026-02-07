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
                                    <UBadge v-if="userJob" class="mb-2" variant="soft" color="primary">{{ userJob.name
                                        }}</UBadge>
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
                    <!-- Tabs for MacroSkillTypes -->
                    <UTabs :items="tabItems" :default-value="tabItems[0]?.value" class="w-full mb-6">
                        <template v-for="tab in tabItems" :key="tab.slot" #[tab.slot]>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                <SkillsEvaluationSkillCard v-for="skill in getSkillsByMacroType(tab.value)"
                                    :key="skill._id" :job-skill="skill" :is-evaluated="isSkillEvaluated(skill._id)"
                                    :evaluation-score="skillEvaluations[skill._id]" :clickable="true"
                                    @click="openEvaluationModal" />
                            </div>

                            <!-- Empty state for tab with no skills -->
                            <div v-if="getSkillsByMacroType(tab.value).length === 0"
                                class="text-center py-8 text-gray-500">
                                <UIcon name="i-heroicons-inbox" class="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Aucune compétence dans cette catégorie</p>
                            </div>
                        </template>
                    </UTabs>

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
        <SkillsEvaluationModal v-model:open="isModalOpen" :skill="currentSkill" :level="observedLevel"
            @save="saveEvaluation" @update:open="onModalOpenUpdate" />

    </div>
</template>

<script setup lang="ts">
import type { Skill } from '~/types/skills'
import type { BadgeProps, TabsItem } from '@nuxt/ui'

definePageMeta({
    middleware: ['auth'],
    requiresAuth: true
})

const { createCompleteEvaluation, selectedEvaluationUser, setSelectedEvaluationUser } = useEvaluation()
const { currentUser } = useUsers()
const { currentCampaign } = useEvaluationCampaign()
const { init: initData, loading: _initLoading, error: _initError } = useInit()
const { skills } = useSkills()

const { jobs } = useJobs()
const toast = useToast()
const router = useRouter()

// State
const jobSkills = ref<Skill[]>([])
const currentSkill = ref<Skill | null>(null)
const loadingSkills = ref(false)
const isModalOpen = ref(false)

const observedLevel = ref(3)
const submitting = ref(false)

// Store evaluations as { skillId: observedLevel }
const skillEvaluations = ref<Record<string, number>>({})
const selectedUser = computed(() => selectedEvaluationUser.value)

// Computed
const evaluatedSkillsCount = computed(() => Object.keys(skillEvaluations.value).length)
const userJob = computed(() => {
    if (!selectedUser.value?.jobId) return null
    return jobs.value.find(job => job._id === selectedUser.value!.jobId)
})

// Group skills by macroSkillTypeName and create tabs
const macroSkillTypes = computed(() => {
    const types = new Set<string>()
    jobSkills.value.forEach(skill => {
        if (skill.macroSkillTypeName) {
            types.add(skill.macroSkillTypeName)
        }
    })
    return Array.from(types).sort()
})

// Create tab items for UTabs
const tabItems = computed<TabsItem[]>(() => {
    return macroSkillTypes.value.map((type, index) => {
        const skillsInType = jobSkills.value.filter(skill => skill.macroSkillTypeName === type)
        const evaluatedInType = skillsInType.filter(skill => isSkillEvaluated(skill._id)).length
        
        return {
            label: `${type} (${evaluatedInType}/${skillsInType.length})`,
            value: type,
            slot: `tab-${index}`,
        }
    })
})

// Get skills filtered by macroSkillTypeName
function getSkillsByMacroType(macroType: string | number | undefined): Skill[] {
    if (!macroType || typeof macroType !== 'string') return []
    return jobSkills.value.filter(skill => skill.macroSkillTypeName === macroType)
}

// Load current user and job skills for selected team member
onMounted(async () => {
    try {
        await initData()
        jobSkills.value = skills.value.filter(sk => sk.jobId === selectedUser.value?.jobId)
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
    if (!currentCampaign.value) return

    submitting.value = true
    try {
        const evaluationData = {
            evaluation: {
                userId: selectedUser.value._id,
                userJobId: selectedUser.value.jobId || undefined,
                managerUserId: currentUser.value._id,
                evaluationCampaignId: currentCampaign.value._id,
            },
            skills: jobSkills.value
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
