<template>
  <div>
    <div class="space-y-6">
      <UButton
        class="w-full rounded-xl p-10 bg-white shadow-[0_6px_0_rgba(0,0,0,0.25)] px-8 text-left flex items-center justify-between hover:bg-red-100 active:bg-red-200"
        @click="openTeamSelection('job')">
        <span>
          <span class="text-xl font-semibold text-gray-900">Nouvelle évaluation</span>
          <span class="block text-gray-500 text-sm">Évaluer les compétences sur l'emploi</span>
        </span>
        <UIcon name="i-heroicons-arrow-right" class="w-7 h-7 text-gray-900" />
      </UButton>
      <UButton
        class="w-full rounded-xl p-10 bg-white shadow-[0_6px_0_rgba(0,0,0,0.25)] px-8 text-left flex items-center justify-between hover:bg-red-100 active:bg-red-200"
        @click="openTeamSelection('free')">
        <span>
          <span class="text-xl font-semibold text-gray-900">Nouvelle évaluation librement</span>
          <span class="block text-gray-500 text-sm">Ajouter des compétences librement</span>
        </span>
        <UIcon name="i-heroicons-arrow-right" class="w-7 h-7 text-gray-900" />
      </UButton>
    </div>

    <UModal v-model:open="isTeamModalOpen" title="Sélectionnez un membre de votre équipe">
      <template #body>
        <div class="p-6">
          <div v-if="loadingUsers" class="flex justify-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-red-600" />
          </div>

          <div v-else-if="teamMembers.length === 0" class="text-center py-8">
            <p class="text-gray-500">Aucun membre d'équipe trouvé</p>
          </div>

          <div v-else>
            <UsersUserCard v-for="user in teamMembers" :key="user._id" :user="user" @click="selectTeamMember" />
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
</template>

<script setup lang="ts">
import type { User } from '~/types/auth'

definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  layout: 'photo'
})

const router = useRouter()
const { getTeamMembers, teamMembers, loading: loadingUsers } = useUsers()
const { setSelectedEvaluationUser, selectedEvaluationUser } = useEvaluation()

type EvaluationType = 'job' | 'free'
const type = ref<EvaluationType>('job')
const isTeamModalOpen = ref(false)


onMounted(async () => {
  await getTeamMembers()
})


function openTeamSelection(evaluationType: EvaluationType) {
  isTeamModalOpen.value = true
  type.value = evaluationType
}

function selectTeamMember(user: User) {
  setSelectedEvaluationUser(user)
  isTeamModalOpen.value = false
  if(!selectedEvaluationUser.value) return
  if(type.value === 'job') {
    router.push({ path: `/employes/${selectedEvaluationUser.value._id}/evaluation` })
  } else {
    router.push({ path: `/employes/${selectedEvaluationUser.value._id}/evaluation-libre` })
  }
}
</script>
