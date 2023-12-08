<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user'

// Components
const CaseCard = defineAsyncComponent(() => import('@/components/Profile/CaseCard.vue'))
const BookmarksCard = defineAsyncComponent(() => import('@/components/Profile/BookmarksCard.vue'))
const HeaderDefault = defineAsyncComponent(() => import('@/components/HeaderDefault.vue'))
const ProfileInformationCard = defineAsyncComponent(
  () => import('@/components/Profile/ProfileInformationCard.vue')
)
const SeqVarsACMGCard = defineAsyncComponent(
  () => import('@/components/Profile/SeqVarsACMGCard.vue')
)
const StrucVarsACMGCard = defineAsyncComponent(
  () => import('@/components/Profile/StrucVarsACMGCard.vue')
)

const userStore = useUserStore()

const router = useRouter()
const route = useRoute()

const SECTIONS = [
  { id: 'general-info', title: 'Profile information' },
  { id: 'bookmarks', title: 'Bookmarks' },
  { id: 'case-information', title: 'Case information' },
  { id: 'acmg-seq-vars', title: 'ACMG Sequence Variant' },
  { id: 'acmg-struc-vars', title: 'ACMG Structure Variant' }
]

const currentSection = ref(SECTIONS[0].id) // Default to the first section

const updateCurrentSection = (sectionId: string) => {
  currentSection.value = sectionId
}

const scrollToSection = async () => {
  const sectionId = route.hash.slice(1)
  if (sectionId) {
    const elem = document.getElementById(sectionId)
    elem?.scrollIntoView()
  }
}

onMounted(async () => {
  await userStore.initialize()
  await scrollToSection()
})

watch(() => route.hash, scrollToSection)
</script>

<template>
  <v-app>
    <HeaderDefault />
    <v-container fill-height fluid>
      <div v-if="userStore.currentUser">
        <v-navigation-drawer class="overflow-auto" :elevation="3" :permanent="true">
          <v-list>
            <v-list-subheader>PROFILE:</v-list-subheader>
            <v-list-item
              v-for="section in SECTIONS"
              :id="`${section.id}-nav`"
              :key="section.id"
              density="compact"
              @click="
                updateCurrentSection(section.id)
                router.push({ hash: `#${section.id}` })
              "
            >
              <!-- @click="router.push({ hash: `#${section.id}` })"-->
              <v-list-item-title>{{ section.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main>
          <div v-if="currentSection === 'general-info'" id="general-info">
            <ProfileInformationCard />
          </div>

          <div v-if="currentSection === 'bookmarks'" id="bookmarks">
            <BookmarksCard />
          </div>

          <div v-if="currentSection === 'case-information'" id="case-information">
            <CaseCard />
          </div>

          <div v-if="currentSection === 'acmg-seq-vars'" id="acmg-seq-vars">
            <SeqVarsACMGCard />
          </div>

          <div v-if="currentSection === 'acmg-struc-vars'" id="acmg-struc-vars">
            <StrucVarsACMGCard />
          </div>
        </v-main>
      </div>

      <div v-else>
        <v-row>
          <v-card
            class="mx-auto pa-4 pb-8 mt-12"
            elevation="8"
            min-width="400"
            max-width="448"
            rounded="lg"
          >
            <v-card-item>
              <v-card-title>User Profile</v-card-title>

              <v-card-subtitle>You are not logged in</v-card-subtitle>
            </v-card-item>

            <v-card-text>
              <v-row class="pt-6" justify="center">
                <v-btn id="login" prepend-icon="mdi-key-variant" color="success" to="/login">
                  Login
                </v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-row>
      </div>
    </v-container>
  </v-app>
</template>

<style scoped>
.navigation {
  width: 95%;
  margin: 20px;
}
</style>
