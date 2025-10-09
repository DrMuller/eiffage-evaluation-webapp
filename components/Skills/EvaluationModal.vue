<template>
    <UModal :open="open" title="Évaluation" @update:open="onUpdateOpen">
        <template #body>
            <div class="p-6">
                <div v-if="jobSkill" class="space-y-6">
                    <!-- Skill Details -->
                    <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p class="text-sm text-gray-600">
                            <span class="font-medium">{{ jobSkill.skill.name }}</span>
                        </p>
                        <p class="text-sm text-gray-600">
                            <span class="font-medium">Niveau attendu:</span>
                            {{ jobSkill.levelExpected || 'Non défini' }}
                        </p>
                    </div>

                    <!-- Slider -->
                    <div class="space-y-4">
                        <label class="block text-sm font-medium text-gray-700">
                            Niveau observé: <span class="text-primary-500 font-bold text-lg">{{ localLevel }}</span>
                        </label>
                        <USlider v-model="localLevel" :min="0" :max="5" :step="1" />
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

const props = defineProps<{
    open: boolean
    jobSkill: JobSkillWithLevel | null
    level?: number
}>()

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'save', level: number): void
}>()

const localLevel = ref(props.level ?? 3)

watch(() => props.level, (newVal) => {
    if (typeof newVal === 'number') {
        localLevel.value = newVal
    }
})

watch(() => props.jobSkill, () => {
    // Reset local level when the displayed skill changes
    if (typeof props.level === 'number') {
        localLevel.value = props.level
    } else {
        localLevel.value = 3
    }
})

function onUpdateOpen(value: boolean) {
    emit('update:open', value)
}

function onSave() {
    emit('save', localLevel.value)
}
</script>
