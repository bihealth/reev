<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Components
const HeaderDefault = defineAsyncComponent(() => import('@/components/HeaderDefault.vue'))
const AboutView = defineAsyncComponent(() => import('@/components/StaticViews/AboutView.vue'))
const ContactView = defineAsyncComponent(() => import('@/components/StaticViews/ContactView.vue'))
const PrivacyView = defineAsyncComponent(() => import('@/components/StaticViews/PrivacyView.vue'))
const TermsView = defineAsyncComponent(() => import('@/components/StaticViews/TermsView.vue'))

const router = useRouter()
const route = useRoute()

enum StaticPages {
  About = 'about',
  Acknowledgements = 'acknowledgements',
  Contact = 'contact',
  PrivacyPolicy = 'privacy-policy',
  TermsOfUse = 'terms-of-use'
}

const pages = [
  { id: StaticPages.About, title: 'About' },
  { id: StaticPages.Contact, title: 'Contact' },
  { id: StaticPages.PrivacyPolicy, title: 'Privacy Policy' },
  { id: StaticPages.TermsOfUse, title: 'Terms of Use' }
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
  <HeaderDefault />
  <v-container fill-height fluid>
    <v-navigation-drawer class="overflow-auto" :elevation="3" :permanent="true">
      <v-list>
        <v-list-item
          v-for="page in pages"
          :key="page.title"
          @click="updateCurrentStaticPage(page.id)"
        >
          <v-list-item-title>{{ page.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

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
  </v-container>
</template>
