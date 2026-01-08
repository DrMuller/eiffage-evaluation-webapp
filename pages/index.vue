<template>
  <div class="flex flex-col gap-4 items-center justify-center">
    <UCard class="space-y-6 p-6 w-[450px]">
      <UUser :name="currentUser?.firstName + ' ' + currentUser?.lastName" :description="currentUser?.email" :avatar="{
        icon: 'i-heroicons-user'
      }" />
    </UCard>
    <UCard class="space-y-6 p-6 w-[450px]">
      <div class="mb-8">
        <h3 class="text-2xl font-bold mb-2">Évaluer les compétences</h3>
        <p class="text-sm text-gray-500">Choisissez une option pour commencer l'évaluation d'un membre de votre équipe.
        </p>
      </div>
      <UButton class="w-full rounded-xl p-6 flex items-center justify-between mb-8" size="xl"
        @click="openTeamSelection('job')">
        <span class="text-left">
          <span class="text-xl font-semibold">Nouvelle évaluation</span>
          <span class="block text-sm">Évaluer les compétences sur l'emploi</span>
        </span>
        <UIcon name="i-heroicons-arrow-right" class="w-10 h-10" />
      </UButton>
      <USeparator class="mb-8" label="ou" />
      <div class="w-full flex items-center justify-between">
        <UButton class="mx-auto" color="neutral" variant="link" @click="openTeamSelection('free')">
          Nouvelle évaluation libre
        </UButton>
      </div>
    </UCard>

    <UDrawer v-model:open="isTeamModalOpen" should-scale-background set-background-color-on-scale
      title="Sélectionnez un membre de votre équipe">
      <template #body>
        <div class="p-6">
          <div v-if="loadingUsers" class="flex justify-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-red-600" />
          </div>

          <div v-else-if="teamMembers.length === 0" class="text-center py-8">
            <p class="text-gray-500">Aucun membre d'équipe trouvé</p>
          </div>

          <div v-else class="grid md:grid-cols-3 gap-4">
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
    </UDrawer>
    <UModal v-model:open="isNoCampaignModalOpen" title="Aucune campagne d'évaluation en cours">
      <template #body>
        <div class="p-6">
          <p class="text-gray-700">
            Aucune campagne d'évaluation n'est actuellement active. Vous ne pouvez pas lancer d'évaluation pour le
            moment.
          </p>
          <div class="flex justify-between gap-3 pt-6">
            <a :href="hrRequestMailto"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
              Faire une demande auprès d'un administrateur RH
            </a>
            <button
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              @click="isNoCampaignModalOpen = false">
              OK
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
const { teamMembers, loading: loadingUsers } = useUsers()
// Use the SAME instance for init and currentCampaign
const { init: initData } = useInit()
const { currentCampaign } = useEvaluationCampaign()
const { setSelectedEvaluationUser, selectedEvaluationUser } = useEvaluation()

const { currentUser } = useUsers()

type EvaluationType = 'job' | 'free'
const type = ref<EvaluationType>('job')
const isTeamModalOpen = ref(false)
const isNoCampaignModalOpen = ref(false)

const hrRequestMailto = computed(() => {
  const managerName = currentUser.value
    ? `${currentUser.value.firstName} ${currentUser.value.lastName}`
    : 'Un manager'

  const subject = encodeURIComponent('Demande d\'activation d\'une campagne d\'évaluation')
  const body = encodeURIComponent(
    `Bonjour,\n\n` +
    `Je suis ${managerName} et je souhaiterais lancer une évaluation des compétences pour mon équipe.\n\n` +
    `Cependant, il n'y a actuellement aucune campagne d'évaluation active.\n\n` +
    `Pourriez-vous activer une campagne d'évaluation afin que je puisse procéder à l'évaluation de mes collaborateurs ?\n\n` +
    `Merci d'avance pour votre aide.\n\n` +
    `Cordialement,\n` +
    `${managerName}`
  )

  // TODO: Remplacer par l'email réel de l'administrateur RH
  return `mailto:estelle.eledo@eiffage.com?subject=${subject}&body=${body}`
})

onMounted(async () => {
  await initData()
})

function openTeamSelection(evaluationType: EvaluationType) {
  if (!currentCampaign.value) {
    isNoCampaignModalOpen.value = true
    return
  }
  isTeamModalOpen.value = true
  type.value = evaluationType
}

function selectTeamMember(user: User) {
  setSelectedEvaluationUser(user)
  isTeamModalOpen.value = false
  if (!selectedEvaluationUser.value) return
  if (type.value === 'job') {
    router.push({ path: `/employes/${selectedEvaluationUser.value._id}/evaluation` })
  } else {
    router.push({ path: `/employes/${selectedEvaluationUser.value._id}/evaluation-libre` })
  }
}
</script>
