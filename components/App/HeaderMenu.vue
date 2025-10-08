<template>
    <div class="absolute top-6 right-6 flex items-center gap-4 z-10">
        <button class="h-12 w-12 rounded-2xl bg-white text-red-600 shadow-md flex items-center justify-center"
            aria-label="Accueil" @click="goHome">
            <UIcon name="i-heroicons-home" class="w-6 h-6" />
        </button>
        <button class="h-12 w-12 rounded-2xl bg-white text-red-600 shadow-md flex items-center justify-center"
            aria-label="Déconnexion" @click="handleLogout">
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-6 h-6" />
        </button>
    </div>
</template>

<script setup lang="ts">
const { signout } = useAuth()
const router = useRouter()
const { setSelectedEvaluationUser } = useEvaluation()

function goHome() {
    setSelectedEvaluationUser(null)
    router.push('/')
}

async function handleLogout() {
    setSelectedEvaluationUser(null)
    await signout()
}
</script>