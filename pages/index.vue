<template>
  <div class="min-h-screen w-full flex">
    <!-- Left photo panel -->
    <div class="hidden md:block w-7/12 relative">
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('/images/background.jpg');" />
      <div class="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
      <div class="absolute top-6 left-6 flex items-center gap-3">
        <img src="/full-logo.png" alt="Eiffage" class="h-20">
      </div>
    </div>

    <!-- Right action panel -->
    <div class="flex-1 relative flex items-center justify-center bg-red-600">
      <AppDiagonalStripes class="absolute inset-0" />
      <!-- Top-right icons -->
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

      <!-- CTA buttons -->
      <div class="w-full max-w-2xl px-6 z-10">
        <div class="space-y-6">
          <button
            class="w-full h-20 bg-white text-gray-900 rounded-full shadow-[0_6px_0_rgba(0,0,0,0.25)] px-8 text-left text-xl font-semibold flex items-center justify-between"
            @click="goToJobEvaluation">
            <span>
              évaluer les compétences
              <span class="block text-base font-normal">sur l’emploi</span>
            </span>
            <UIcon name="i-heroicons-arrow-right" class="w-7 h-7 text-gray-900" />
          </button>

          <button
            class="w-full h-20 bg-white text-gray-900 rounded-full shadow-[0_6px_0_rgba(0,0,0,0.25)] px-8 text-left text-xl font-semibold flex items-center justify-between"
            @click="goToFreeEvaluation">
            <span>
              évaluer les compétences
              <span class="block text-base font-normal">librement</span>
            </span>
            <UIcon name="i-heroicons-arrow-right" class="w-7 h-7 text-gray-900" />
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true
})
definePageMeta({ layout: 'empty' })

const { signout } = useAuth()
const router = useRouter()

function goHome() {
  router.push('/')
}

async function handleLogout() {
  await signout()
}

function goToJobEvaluation() {
  router.push({ path: '/evaluation/job-skills' })
}

function goToFreeEvaluation() {
  router.push({ path: '/evaluation/skill-selection' })
}
</script>
