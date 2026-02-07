<template>
    <UModal v-model:open="isOpen" class="bg-gray-50" title="Ajouter des compétences" fullscreen>
        <template #body>
            <div class="p-6 space-y-6">
                <!-- Filters -->
                <UCard class="mb-6 p-6 rounded-xl">
                    <p>
                        Utiliser les filtres pour trouver les compétences que vous souhaitez évaluer.<br>
                        Cliquez dessus pour les sélectionner.<br>
                        Puis cliquer sur "ajouter" pour effectuer la notation<br>
                    </p><br>
                    <div class="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
                        <div class="md:col-span-1 sm:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Types de
                                macro-compétences</label>
                            <USelectMenu v-model="selectedMacroSkillTypeIds" size="xl" :items="macroSkillTypeOptions"
                                :value-key="'value'" multiple clearable placeholder="Sélectionner un ou plusieurs types"
                                class="w-full" @update:model-value="onMacroSkillTypeSelected" />
                        </div>
                        <div class="md:col-span-1 sm:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Macro-compétences</label>
                            <USelectMenu v-model="selectedMacroSkillIds" size="xl" :items="macroSkillOptions"
                                :value-key="'value'" searchable multiple clearable
                                placeholder="Sélectionner une ou plusieurs macro-compétences" class="w-full"
                                @update:model-value="onMacroSkillSelected" />
                        </div>
                        <div class="md:col-span-1 sm:col-span-1" />
                        <div class="md:col-span-1 col-end-2 sm:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Emplois</label>
                            <USelectMenu v-model="selectedJobIds" size="xl" :items="jobOptions" :value-key="'value'"
                                searchable multiple clearable placeholder="Sélectionner un ou plusieurs emplois"
                                class="w-full" @update:model-value="onJobSelected" />
                        </div>
                        <div class="md:col-span-1 sm:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Rechercher une
                                compétence</label>
                            <UInput v-model="searchQuery" size="xl" placeholder="Tapez pour rechercher..."
                                icon="i-heroicons-magnifying-glass" class="w-full" />
                        </div>
                        <div class="md:col-span-1 sm:col-span-1 self-end mx-4">
                            <UButton variant="solid" class="px-8 py-3 rounded-full"
                                :disabled="skillsToDisplay.length === 0" @click="handleAddSkills">
                                Ajouter ({{ skillsToDisplay.length }})
                            </UButton>
                        </div>

                    </div>
                </UCard>
                <!-- Selected Skills -->
                <div v-if="skillsToDisplay.length > 0" class="space-y-2">
                    <h3 class="text-xl font-semibold text-gray-700 mb-4">Compétences sélectionnées ({{
                        skillsToDisplay.length }})</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SkillsEvaluationSkillCard v-for="skill in skillsToDisplay" :key="skill._id"
                            :job-skill="skill" :is-evaluated="false" :clickable="false" :removable="true"
                            :variant="'subtle'" @remove="removeSkillFromSelection" />
                    </div>
                </div>

                <!-- Available Skills to Add -->
                <div v-if="filteredAvailableSkills.length > 0" class="space-y-2">
                    <h3 class="text-xl font-semibold text-gray-700 mb-4">Compétences disponibles</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SkillsEvaluationSkillCard v-for="skill in filteredAvailableSkills" :key="skill._id"
                            :job-skill="skill" :is-evaluated="false" :clickable="true" :removable="false"
                            @click="addSkillToSelection" />
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="searchQuery && filteredAvailableSkills.length === 0 && skillsToDisplay.length === 0"
                    class="text-center py-8 text-gray-500">
                    Aucune compétence trouvée pour "{{ searchQuery }}"
                </div>

            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import type { JobSkillWithLevel } from '~/types/evaluation'
import type { MacroSkill, MacroSkillType, Skill } from '~/types/skills'
import type { Job } from '~/types/jobs'

// Props
interface Props {
    open: boolean
    jobs: Job[]
    skills: Skill[]
    macroSkills: MacroSkill[]
    macroSkillTypes: MacroSkillType[]
    alreadySelectedSkills: JobSkillWithLevel[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
    'update:open': [value: boolean]
    'add-skills': [skills: Skill[]]
}>()

// Composables
// const { getJobSkills } = useEvaluation()
const toast = useToast()

// Computed two-way binding for modal
const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

// State
const selectedJobIds = ref<string[]>([])
const selectedSkillIds = ref<string[]>([])
const searchQuery = ref('')
const selectedMacroSkillTypeIds = ref<string[]>([])
const selectedMacroSkillIds = ref<string[]>([])

// Computed
const jobOptions = computed(() => props.jobs.map(j => ({ label: j.name, value: j._id })))
const macroSkillTypeOptions = computed(() => props.macroSkillTypes.map(t => ({ label: t.name, value: t._id })))
const macroSkillOptions = computed(() => {
    const allowedTypes = new Set(selectedMacroSkillTypeIds.value)
    return props.macroSkills
        .filter(ms => allowedTypes.size === 0 || allowedTypes.has(ms.macroSkillTypeId))
        .map(ms => ({ label: ms.name, value: ms._id }))
})

// Computed property for selected skills to display in the add modal
const skillsToDisplay = computed(() => {
    if (selectedSkillIds.value.length === 0) {
        return []
    }
    const idsSet = new Set(selectedSkillIds.value)
    return props.skills.filter(sk => idsSet.has(sk._id))
})

// Computed property for available skills filtered by search query
const filteredAvailableSkills = computed(() => {
    const selectedIds = new Set(selectedSkillIds.value)
    const alreadySelectedIds = new Set(props.alreadySelectedSkills.map(s => s._id))
    const query = searchQuery.value.toLowerCase().trim()

    let availableSkills = props.skills

    // Filter by selected jobs if any
    if (selectedJobIds.value.length > 0) {
        const jobIdSet = new Set(selectedJobIds.value)
        availableSkills = availableSkills.filter(sk => jobIdSet.has(sk.jobId))
    }

    // Filter out already selected skills (both in modal and parent)
    availableSkills = availableSkills.filter(sk =>
        !selectedIds.has(sk._id) && !alreadySelectedIds.has(sk._id)
    )

    // Filter by macro skill type / macro skill selections
    if (selectedMacroSkillTypeIds.value.length > 0) {
        const macroTypeSet = new Set(selectedMacroSkillTypeIds.value)
        availableSkills = availableSkills.filter(sk => macroTypeSet.has(sk.macroSkillTypeId))
    }
    if (selectedMacroSkillIds.value.length > 0) {
        const macroSkillSet = new Set(selectedMacroSkillIds.value)
        availableSkills = availableSkills.filter(sk => macroSkillSet.has(sk.macroSkillId))
    }

    // Filter by search query if provided
    if (query) {
        availableSkills = availableSkills.filter(sk =>
            sk.name.toLowerCase().includes(query)
        )
    }

    return availableSkills
})

// Methods
function addSkillToSelection(skill: Skill) {
    if (!selectedSkillIds.value.includes(skill._id)) {
        selectedSkillIds.value.push(skill._id)
    }
}

function onMacroSkillTypeSelected() {
    selectedMacroSkillIds.value = []
}

function onMacroSkillSelected() {
    // handled reactively
}

function removeSkillFromSelection(skillId: string) {
    selectedSkillIds.value = selectedSkillIds.value.filter(id => id !== skillId)
}

async function onJobSelected() {
    // Job filtering is handled reactively in filteredAvailableSkills
}

function handleAddSkills() {
    const idsToAdd = new Set(selectedSkillIds.value)
    if (idsToAdd.size === 0) {
        isOpen.value = false
        return
    }
    const skillsToAdd: Skill[] = []
    for (const id of idsToAdd) {
        const skill = props.skills.find(sk => sk._id === id)
        if (skill) {
            skillsToAdd.push(skill)
        }
    }
    emit('add-skills', skillsToAdd)

    // Reset state
    selectedSkillIds.value = []
    selectedJobIds.value = []
    searchQuery.value = ''
    selectedMacroSkillTypeIds.value = []
    selectedMacroSkillIds.value = []
    isOpen.value = false

    toast.add({
        title: 'Ajouté',
        description: 'Compétences ajoutées à l\'évaluation'
    })
}

// Initialize selected skills from already evaluated skills when modal opens
watch(isOpen, (newValue) => {
    if (newValue) {
        // Add already selected skills to the selection when opening
        selectedSkillIds.value = props.alreadySelectedSkills.map(s => s._id)
    } else {
        // Reset state when modal is closed
        searchQuery.value = ''
        selectedMacroSkillTypeIds.value = []
        selectedMacroSkillIds.value = []
    }
})
</script>
