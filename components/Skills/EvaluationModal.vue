<template>
    <UModal :open="open" title="Évaluation" @update:open="onUpdateOpen" class="max-w-[60%]">
        <template #body>
            <div class="p-6">
                <div v-if="jobSkill" class="space-y-6">
                    <!-- Skill Details -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                        <p class="text-sm text-gray-600">
                            <span class="font-medium">{{ jobSkill.skill.name }}</span>
                        </p>
                    </div>

                    <!-- Slider -->
                    <div class="space-y-4">
                        <div class="text-sm font-medium text-gray-700">
                            Niveau attendu:
                            <span class="font-bold text-lg">{{ jobSkill.expectedLevel || 0 }}</span>
                            <UBadge color="neutral" variant="subtle" size="md" class="ml-2">
                                {{ expectedLevelName }}
                            </UBadge>
                        </div>
                        <div class="text-sm font-medium text-gray-700">
                            Niveau observé:
                            <span class="text-primary-500 font-bold text-lg">{{ localLevel }}</span>
                            <UBadge :color="currentLevelInfo.color" variant="subtle" size="md" class="ml-2">
                                {{ currentLevelInfo.name }}
                            </UBadge>
                        </div>
                        <USlider v-model="localLevel" size="xl" :min="0" :max="4" :step="1" />
                        <div class="flex justify-between text-xs text-gray-500">
                            <span v-for="lvl in skillLevels" :key="lvl.value" class="text-center">
                                {{ lvl.value }}
                            </span>
                        </div>
                    </div>

                    <!-- Level Details -->
                    <div v-if="currentLevelInfo.definition"
                        class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                        <div class="flex justify-center">
                            <h3 class="text-md text-gray-700">
                                {{ currentLevelInfo.name }}
                            </h3>
                        </div>
                        <div>
                            <UBadge color="info" variant="soft" class="mb-2">
                                Définition
                            </UBadge>
                            <p class="text-sm text-gray-700">
                                {{ currentLevelInfo.definition }}
                            </p>
                        </div>
                        <div v-if="currentLevelInfo.example">
                            <UBadge color="info" variant="soft" class="mb-2">
                                Exemple
                            </UBadge>
                            <p class="text-sm text-gray-700 italic">
                                {{ currentLevelInfo.example }}
                            </p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end gap-3 pt-4">
                        <UButton class="px-4 py-2" color="neutral" variant="subtle" @click="emit('update:open', false)">
                            Annuler
                        </UButton>
                        <UButton class="px-4 py-2" variant="solid" @click="onSave">
                            Enregistrer
                        </UButton>
                    </div>


                </div>
            </div>
        </template>
    </UModal>

</template>

<script setup lang="ts">
import type { JobSkillWithLevel } from '~/types/evaluation'
import { skillLevels, useSkillLevelInfo, useSkillLevelLabel } from '~/composables/useSkillLevel'

const props = defineProps<{
    open: boolean
    jobSkill: JobSkillWithLevel | null
    level: number
}>()

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'save', level: number): void
}>()

const localLevel = ref(1)

const currentLevelInfo = computed(() => useSkillLevelInfo(localLevel.value))
const expectedLevelName = computed(() => {
    if (!props.jobSkill?.expectedLevel) return 'Non défini'
    return useSkillLevelLabel(props.jobSkill.expectedLevel)
})

// watch(() => props.level, (newVal) => {
//     if (typeof newVal === 'number') {
//         localLevel.value = newVal
//     }
// })

// watch(() => props.jobSkill, () => {
//     // Reset local level when the displayed skill changes
//     if (typeof props.level === 'number') {
//         localLevel.value = props.level
//     } else {
//         localLevel.value = 1
//     }
// })

function onUpdateOpen(value: boolean) {
    emit('update:open', value)
}

function onSave() {
    emit('save', localLevel.value)
    localLevel.value = 1
}
</script>
