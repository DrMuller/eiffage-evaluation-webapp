<template>
    <div>
        <UCard class="mx-auto p-10" :ui="{ body: 'p-8', header: 'p-6 pb-0', footer: 'p-6 pt-0' }">
            <div class="flex flex-col items-center text-center space-y-4">
                <div class="h-20 w-20 rounded-full bg-red-500 flex items-center justify-center shadow-md">
                    <UIcon name="i-heroicons-check-badge" class="w-12 h-12 text-white" />
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Évaluation terminée</h1>
                    <p class="text-gray-600">L'évaluation a été enregistrée avec succès.</p>
                </div>
            </div>

            <div class="flex justify-center mt-6">
                <UButton class="w-full p-6 rounded-xl px-8 text-left flex items-center justify-center" variant="soft"
                    size="lg" @click="goHome">
                    Retour à l'accueil
                </UButton>
            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
    requiresAuth: true,
    layout: 'photo'
})

const router = useRouter()
const { setSelectedEvaluationUser } = useEvaluation()

function goHome() {
    setSelectedEvaluationUser(null)
    router.push('/')
}
</script>
