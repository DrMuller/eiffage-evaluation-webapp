<template>
    <UCard :class="[
        'mb-2 p-4 border-gray-200 rounded-lg transition-colors text-left',
        clickable
            ? 'hover:border-red-600 hover:bg-red-50 cursor-pointer'
            : 'cursor-default'
    ]" @click="handleClick">
        <div class="flex items-center gap-3">
            <div class="flex-shrink-0 h-12 w-12 bg-red-600 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold text-lg">
                    {{ user.firstName[0] }}{{ user.lastName[0] }}
                </span>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">
                    {{ user.firstName }} {{ user.lastName }}
                </p>
                <UBadge v-if="userJob" class="mb-2" variant="soft" color="primary">{{ userJob.name }}</UBadge>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
                <p class="text-xs text-gray-400">Code: {{ user.code }}</p>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import type { User } from '~/types/auth'

const props = withDefaults(defineProps<{
    user: User
    clickable?: boolean
}>(), {
    clickable: true
})

const emit = defineEmits<{
    (e: 'click', user: User): void
}>()

const { jobs } = useJobs()

const userJob = computed(() => {
    if (!props.user.jobId) return null
    return jobs.value.find(job => job._id === props.user.jobId)
})

function handleClick() {
    if (props.clickable) {
        emit('click', props.user)
    }
}
</script>
