<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user'

// Components
const CaseCard = defineAsyncComponent(() => import('@/components/Profile/CaseCard.vue'))
const BookmarksCard = defineAsyncComponent(() => import('@/components/Profile/BookmarksCard.vue'))
const PageHeader = defineAsyncComponent(() => import('@/components/PageHeader.vue'))
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

enum Section {
  GeneralInfo = 'general-info',
  Bookmarks = 'bookmarks',
  CaseInformation = 'case-information',
  AcmgSeqvar = 'acmg-seqvar',
  AcmgStrucvar = 'acmg-strucvar'
}

const PAGES = [
  { id: Section.GeneralInfo, title: 'Profile information' },
  { id: Section.Bookmarks, title: 'Bookmarks' },
  { id: Section.CaseInformation, title: 'Case information' },
  { id: Section.AcmgSeqvar, title: 'ACMG Sequence Variant' },
  { id: Section.AcmgStrucvar, title: 'ACMG Structure Variant' }
]

const currentSection = ref<Section>(Section.GeneralInfo)

const updateCurrentSection = (section: Section) => {
  currentSection.value = section
  router.push({ hash: `#${section}` })
}

onMounted(async () => {
  if (route.hash) {
    updateCurrentSection(route.hash.slice(1) as Section)
  } else {
    updateCurrentSection(Section.GeneralInfo)
  }
})

watch(
  () => route.hash,
  () => {
    updateCurrentSection(route.hash.slice(1) as Section)
  }
)
</script>

<template>
  <v-app>
    <PageHeader />
    <v-container fill-height fluid>
      <div v-if="userStore.currentUser">
        <v-navigation-drawer class="overflow-auto" :elevation="3" :permanent="true">
          <v-list>
            <v-list-subheader>PROFILE</v-list-subheader>
            <v-list-item
              v-for="section in PAGES"
              :id="`${section.id}-nav`"
              :key="section.id"
              density="compact"
              @click="updateCurrentSection(section.id)"
            >
              <v-list-item-title>{{ section.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main>
          <div v-if="currentSection === Section.GeneralInfo" :id="Section.GeneralInfo">
            <ProfileInformationCard />
          </div>
          <div v-if="currentSection === Section.Bookmarks" :id="Section.Bookmarks">
            <BookmarksCard />
          </div>
          <div v-if="currentSection === Section.CaseInformation" :id="Section.CaseInformation">
            <CaseCard />
          </div>
          <div v-if="currentSection === Section.AcmgSeqvar" :id="Section.AcmgSeqvar">
            <SeqVarsACMGCard />
          </div>
          <div v-if="currentSection === Section.AcmgStrucvar" :id="Section.AcmgStrucvar">
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
