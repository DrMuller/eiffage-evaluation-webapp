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
          <UButton
            class="w-full p-10 bg-white rounded-xl shadow-[0_6px_0_rgba(0,0,0,0.25)] px-8 text-left flex items-center justify-between hover:bg-red-100 active:bg-red-200"
            @click="openTeamSelection">
            <span>
              <span class="text-xl font-semibold text-gray-900">Nouvelle évaluation</span>
              <span class="block text-gray-500 text-sm">Évaluer les compétences sur l’emploi</span>
            </span>
            <UIcon name="i-heroicons-arrow-right" class="w-7 h-7 text-gray-900" />
          </UButton>

          <UButton
            class="w-full p-10 bg-white rounded-xl shadow-[0_6px_0_rgba(0,0,0,0.25)] px-8 text-left flex items-center justify-between hover:bg-red-100 active:bg-red-200"
            @click="goToFreeEvaluation">
            <span>
              <span class="text-xl font-semibold text-gray-900">Nouvelle évaluation librement</span>
              <span class="block text-gray-500 text-sm">Ajouter des compétences librement</span>
            </span>
            <UIcon name="i-heroicons-arrow-right" class="w-7 h-7 text-gray-900" />
          </UButton>
        </div>
      </div>

      <!-- Team selection modal -->
      <UModal v-model:open="isTeamModalOpen" title="Sélectionnez un membre de votre équipe">
        <template #body>
          <div class="p-6">
            <div v-if="loadingUsers" class="flex justify-center py-8">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-red-600" />
            </div>

            <div v-else-if="teamMembers.length === 0" class="text-center py-8">
              <p class="text-gray-500">Aucun membre d'équipe trouvé</p>
            </div>

            <div v-else class="">
              <UCard v-for="user in teamMembers" :key="user._id"
                class="mb-2 p-4 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-colors text-left"
                @click="selectTeamMember(user)">
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
                    <p class="text-sm text-gray-500">{{ user.email }}</p>
                    <p class="text-xs text-gray-400">Code: {{ user.code }}</p>
                  </div>
                </div>
              </UCard>
            </div>
            <div class="flex justify-end gap-3 pt-6">
              <button
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                @click="isTeamModalOpen = false">
                Annuler
              </button>
            </div>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types/auth'

definePageMeta({
  middleware: ['auth'],
  requiresAuth: true
})
definePageMeta({ layout: 'empty' })

const { signout } = useAuth()
const router = useRouter()
const toast = useToast()
const { getTeamMembers, teamMembers, loading: loadingUsers } = useUsers()
const { setSelectedEvaluationUser } = useEvaluation()

const isTeamModalOpen = ref(false)

function goHome() {
  router.push('/')
}

async function handleLogout() {
  await signout()
}

function openTeamSelection() {
  isTeamModalOpen.value = true
  // Lazy-load team members when opening the modal
  if (teamMembers.value.length === 0) {
    getTeamMembers().catch(() => {
      toast.add({
        title: 'Erreur',
        description: 'Impossible de charger les membres de l\'équipe',
        color: 'error'
      })
    })
  }
}

function selectTeamMember(user: User) {
  setSelectedEvaluationUser(user)
  isTeamModalOpen.value = false
  router.push({ path: '/evaluation/job-skills' })
}

function goToFreeEvaluation() {
  router.push({ path: '/evaluation/skill-selection' })
}
</script>
