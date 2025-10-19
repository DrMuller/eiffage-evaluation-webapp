<template>
    <UCard class="rounded-lg" :class="[
        isEvaluated ? 'bg-info-50' : '',
        clickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
    ]" :ui="{ body: 'h-full' }" :variant="variant" @click="handleCardClick">
        <div class="p-4 h-full space-y-2 flex flex-col justify-between">
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg font-bold text-sm"
                    :class="isEvaluated ? 'bg-info-100 text-info-700' : 'bg-gray-100 text-gray-700'">
                    {{ isEvaluated ? `${evaluationScore}/4` : '-/4' }}
                </div>
                <h3 class="text-sm font-semibold text-gray-700 flex-1">
                    {{ jobSkill.skill.name }}
                </h3>
                <UButton v-if="removable" color="neutral" variant="ghost" @click.stop="handleRemove">
                    <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
                </UButton>
            </div>
            <div v-if="jobSkill.expectedLevel" class="flex items-center justify-between pt-2 border-t border-gray-200">
                <p class="text-xs text-gray-500">
                    <span class="font-medium">Niveau attendu:</span>
                    {{ jobSkill.expectedLevel ?? 'Non défini' }}
                </p>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import type { JobSkillWithLevel } from '~/types/evaluation'

interface Props {
    jobSkill: JobSkillWithLevel
    isEvaluated?: boolean
    evaluationScore?: number
    clickable?: boolean
    removable?: boolean
    variant?: "outline" | "solid" | "subtle" | "soft" | undefined
    color?: 'primary' | 'secondary' | 'neutral' | 'error' | 'warning' | 'success'
}

interface Emits {
    (e: 'click', jobSkill: JobSkillWithLevel): void
    (e: 'remove', skillId: string): void
}

const props = withDefaults(defineProps<Props>(), {
    isEvaluated: false,
    evaluationScore: undefined,
    clickable: true,
    removable: false,
    variant: 'outline',
})

const emit = defineEmits<Emits>()

function handleCardClick() {
    if (props.clickable) {
        emit('click', props.jobSkill)
    }
}

function handleRemove() {
    emit('remove', props.jobSkill.skill._id)
}
</script>
