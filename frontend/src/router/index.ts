import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import ACMGCriteriaDocs from '@/views/ACMGCriteriaDocs.vue'
import ACMGSVDocs from '@/views/ACMGSVDocs.vue'
import GeneDetailView from '@/views/GeneDetailView.vue'
import GenesListView from '@/views/GenesListView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import PathNotFound from '@/views/PathNotFound.vue'
import ProfileView from '@/views/ProfileView.vue'
import SeqvarDetailsView from '@/views/SeqvarDetailsView.vue'
import StaticView from '@/views/StaticView.vue'
import StrucvarDetailsView from '@/views/StrucvarDetailsView.vue'
import VerifyEmailView from '@/views/VerifyEmailView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: VerifyEmailView
  },
  {
    path: '/info',
    name: 'static-info',
    component: StaticView
  },
  {
    path: '/gene/:searchTerm/:genomeRelease',
    name: 'gene',
    component: GeneDetailView,
    props: (route: any) => {
      return { searchTerm: route.params.searchTerm, genomeRelease: route.params.genomeRelease }
    }
  },
  {
    path: '/variant/:searchTerm/:genomeRelease',
    name: 'variant',
    component: SeqvarDetailsView,
    props: (route: any) => {
      return { searchTerm: route.params.searchTerm, genomeRelease: route.params.genomeRelease }
    }
  },
  {
    path: '/cnv/:searchTerm/:genomeRelease',
    name: 'cnv',
    component: StrucvarDetailsView,
    props: (route: any) => {
      return { searchTerm: route.params.searchTerm, genomeRelease: route.params.genomeRelease }
    }
  },
  {
    path: '/genes/search',
    name: 'genes',
    component: GenesListView,
    props: (route: any) => {
      return { genomeRelease: route.params.genomeRelease }
    }
  },
  {
    path: '/docs/acmg-docs',
    name: 'acmg-docs',
    component: ACMGCriteriaDocs
  },
  {
    path: '/docs/acmg-cnv',
    name: 'docs-acmg-cnv',
    component: ACMGSVDocs
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: PathNotFound
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

/** The default page title */
const DEFAULT_TITLE = 'REEV Explains and Evaluates Variants'

router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  nextTick(() => {
    document.title = (to.meta.title as string) ?? DEFAULT_TITLE
  })
})

export { routes }

export default router
