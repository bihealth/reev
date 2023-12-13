<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Components
import FooterDefault from '@/components/FooterDefault.vue'
import { useUserStore } from '@/stores/user'

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
const TestEmailCard = defineAsyncComponent(() => import('@/components/Profile/TestEmailCard.vue'))

const userStore = useUserStore()

const router = useRouter()
const route = useRoute()

enum ProfileSection {
  GeneralInfo = 'general-info',
  Bookmarks = 'bookmarks',
  CaseInformation = 'case-information',
  AcmgSeqvar = 'acmg-seqvar',
  AcmgStrucvar = 'acmg-strucvar'
}

const PROFILE_PAGES = [
  { id: ProfileSection.GeneralInfo, title: 'Overview' },
  { id: ProfileSection.Bookmarks, title: 'Bookmarks' },
  { id: ProfileSection.CaseInformation, title: 'Case information' },
  { id: ProfileSection.AcmgSeqvar, title: 'ACMG Sequence Variant' },
  { id: ProfileSection.AcmgStrucvar, title: 'ACMG Structure Variant' }
]

enum AdminSection {
  SendTestEmail = 'admin-email-test'
}

const ADMIN_PAGES = [{ id: AdminSection.SendTestEmail, title: 'Test Email' }]

const currentSection = ref<ProfileSection | AdminSection>(ProfileSection.GeneralInfo)

const updateCurrentSection = (section: ProfileSection | AdminSection) => {
  currentSection.value = section
  router.push({ hash: `#${section}` })
}

onMounted(async () => {
  if (route.hash) {
    updateCurrentSection(route.hash.slice(1) as ProfileSection)
  } else {
    updateCurrentSection(ProfileSection.GeneralInfo)
  }
})

watch(
  () => route.hash,
  () => {
    updateCurrentSection(route.hash.slice(1) as ProfileSection)
  }
)
</script>

<template>
  <v-app>
    <PageHeader />
    <v-main class="bg-grey-lighten-2">
      <v-container>
        <div v-if="userStore.currentUser">
          <v-row>
            <v-col cols="2">
              <v-list rounded="lg">
                <v-list-subheader>PROFILE</v-list-subheader>
                <v-list-item
                  v-for="section in PROFILE_PAGES"
                  :id="`${section.id}-nav`"
                  :key="section.id"
                  density="compact"
                  @click="updateCurrentSection(section.id)"
                >
                  <v-list-item-title>{{ section.title }}</v-list-item-title>
                </v-list-item>
                <template v-if="userStore.currentUser?.is_superuser">
                  <v-list-subheader>ADMIN OPTIONS</v-list-subheader>
                  <v-list-item
                    v-for="section in ADMIN_PAGES"
                    :id="`${section.id}-nav`"
                    :key="section.id"
                    density="compact"
                    @click="updateCurrentSection(section.id)"
                  >
                    <v-list-item-title>{{ section.title }}</v-list-item-title>
                  </v-list-item>
                </template>
              </v-list>
            </v-col>
            <v-col cols="10">
              <div
                v-if="currentSection === ProfileSection.GeneralInfo"
                :id="ProfileSection.GeneralInfo"
              >
                <ProfileInformationCard />
              </div>
              <div
                v-if="currentSection === ProfileSection.Bookmarks"
                :id="ProfileSection.Bookmarks"
              >
                <BookmarksCard />
              </div>
              <div
                v-if="currentSection === ProfileSection.CaseInformation"
                :id="ProfileSection.CaseInformation"
              >
                <CaseCard />
              </div>
              <div
                v-if="currentSection === ProfileSection.AcmgSeqvar"
                :id="ProfileSection.AcmgSeqvar"
              >
                <SeqVarsACMGCard />
              </div>
              <div
                v-if="currentSection === ProfileSection.AcmgStrucvar"
                :id="ProfileSection.AcmgStrucvar"
              >
                <StrucVarsACMGCard />
              </div>
              <div
                v-if="currentSection === AdminSection.SendTestEmail"
                :id="AdminSection.SendTestEmail"
              >
                <TestEmailCard />
              </div>
            </v-col>
          </v-row>
        </div>

        <div v-else>
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="9">
              <v-card class="mx-auto pa-4 pb-8 mt-12" min-width="400" max-width="448">
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
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
