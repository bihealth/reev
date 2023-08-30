import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import GeneDetailsView from '@/views/GeneDetailView.vue'

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
    path: '/gene/:searchTerm',
    name: 'gene',
    component: GeneDetailsView,
    props: (route: any) => {
      // remark: the following line is not covered because we stub out the router
      return { searchTerm: route.params.searchTerm }
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export { routes }

export default router
