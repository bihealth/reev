import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import GeneDetailsView from '@/views/GeneDetailView.vue'
import VariantDetailView from '@/views/VariantDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/gene/:searchTerm',
      name: 'gene',
      component: GeneDetailsView,
      props: (route) => ({ searchTerm: route.params.searchTerm })
    },
    {
      path: '/variant/:variantId',
      name: 'variant',
      component: VariantDetailView
    }
  ]
})

export default router
