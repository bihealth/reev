import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import GeneDetailView from '@/views/GeneDetailView.vue'
import VariantDetailView from '@/views/VariantDetailView.vue'
import GenesListView from '@/views/GenesListView.vue'
import ACMGCriteriaDocs from '@/views/ACMGCriteriaDocs.vue'
import PathNotFound from '@/views/PathNotFound.vue'
import CNVDetailView from '@/views/CNVDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView
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
    component: VariantDetailView,
    props: (route: any) => {
      return { searchTerm: route.params.searchTerm, genomeRelease: route.params.genomeRelease }
    }
  },
  {
    path: '/cnv/:searchTerm/:genomeRelease',
    name: 'cnv',
    component: CNVDetailView,
    props: (route: any) => {
      return { searchTerm: route.params.searchTerm, genomeRelease: route.params.genomeRelease }
    }
  },
  {
    path: '/genes/search',
    name: 'genes',
    component: GenesListView
  },
  {
    path: '/acmg-docs',
    name: 'acmg-docs',
    component: ACMGCriteriaDocs
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
