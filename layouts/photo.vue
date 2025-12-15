<template>
    <div class="min-h-screen w-full flex">
        <!-- Left photo panel -->
        <div class="hidden md:block w-7/12 relative">
            <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('/images/background.png');" />
            <div class="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
            <div class="absolute top-6 left-6 flex items-center gap-3">
                <img src="/full-logo.png" alt="Eiffage" class="h-20">
            </div>
        </div>

        <!-- Right content panel -->
        <div class="flex-1 relative flex items-center justify-center bg-red-600">
            <AppDiagonalStripes class="absolute inset-0" />

            <!-- Top right buttons -->
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

            <!-- Main content slot -->
            <div class="w-full max-w-2xl px-6 z-10">
                <slot />
            </div>
        </div>
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
