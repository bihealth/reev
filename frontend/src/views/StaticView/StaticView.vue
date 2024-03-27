<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

// Components
import FooterDefault from '@/components/FooterDefault/FooterDefault.vue'

const PageHeader = defineAsyncComponent(() => import('@/components/PageHeader/PageHeader.vue'))
const AboutView = defineAsyncComponent(() => import('@/components/StaticViews/AboutView.vue'))
const ContactView = defineAsyncComponent(() => import('@/components/StaticViews/ContactView.vue'))
const PrivacyView = defineAsyncComponent(() => import('@/components/StaticViews/PrivacyView.vue'))
const TermsView = defineAsyncComponent(() => import('@/components/StaticViews/TermsView.vue'))
const DataVersionsView = defineAsyncComponent(() => import('@/components/StaticViews/DataVersionsView.vue'))

const router = useRouter()
const route = useRoute()

/** The global theme. */
const theme = useTheme()

/** Return backgorund color for v-main based on current theme. */
const mainBackgroundColor = computed(() => {
  return theme.global.current.value.dark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'
})

enum StaticPages {
  About = 'about',
  Contact = 'contact',
  PrivacyPolicy = 'privacy-policy',
  TermsOfUse = 'terms-of-use',
  DataVersions = 'data-versions'
}

const PAGES = [
  { id: StaticPages.About, title: 'About' },
  { id: StaticPages.Contact, title: 'Contact' },
  { id: StaticPages.PrivacyPolicy, title: 'Privacy Policy' },
  { id: StaticPages.TermsOfUse, title: 'Terms of Use' },
  { id: StaticPages.DataVersions, title: 'Data Versions' }
]

const currentStaticPage = ref(StaticPages.About)

const updateCurrentStaticPage = (page: StaticPages) => {
  currentStaticPage.value = page
  router.push({ hash: `#${page}` })
}

onMounted(async () => {
  if (route.hash) {
    updateCurrentStaticPage(route.hash.slice(1) as StaticPages)
  } else {
    updateCurrentStaticPage(StaticPages.About)
  }
})

watch(
  () => route.hash,
  () => {
    updateCurrentStaticPage(route.hash.slice(1) as StaticPages)
  }
)
</script>

<template>
  <v-app>
    <PageHeader />
    <v-main :class="mainBackgroundColor">
      <v-container>
        <v-row>
          <v-col cols="3" lg="2">
            <v-list rounded="lg">
              <v-list-item
                v-for="page in PAGES"
                :key="page.title"
                @click="updateCurrentStaticPage(page.id)"
              >
                <v-list-item-title>{{ page.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="9">
            <!-- Static Views -->
            <div v-if="currentStaticPage === StaticPages.About">
              <AboutView />
            </div>
            <div v-if="currentStaticPage === StaticPages.Contact">
              <ContactView />
            </div>
            <div v-if="currentStaticPage === StaticPages.PrivacyPolicy">
              <PrivacyView />
            </div>
            <div v-if="currentStaticPage === StaticPages.TermsOfUse">
              <TermsView />
            </div>
            <div v-if="currentStaticPage === StaticPages.DataVersions">
              <DataVersionsView />
            </div>
          </v-col>
        </v-row>
        <FooterDefault />
      </v-container>
    </v-main>
  </v-app>
</template>
