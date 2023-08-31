import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import GeneDetailView from '@/views/GeneDetailView.vue'
import VariantDetailView from '@/views/VariantDetailView.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export { routes }

export default router
