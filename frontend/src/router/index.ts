import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import AcmgSeqvarDocs from '@/views/AcmgSeqvarDocs/AcmgSeqvarDocs.vue'
import AcmgStrucvarDocs from '@/views/AcmgStrucvarDocs/AcmgStrucvarDocs.vue'
import GeneDetailView from '@/views/GeneDetailView/GeneDetailView.vue'
import HomeView from '@/views/HomeView/HomeView.vue'
import LoginView from '@/views/LoginView/LoginView.vue'
import PathNotFound from '@/views/PathNotFound/PathNotFound.vue'
import ProfileView from '@/views/ProfileView/ProfileView.vue'
import QueryView from '@/views/QueryView/QueryView.vue'
import SeqvarDetailsView from '@/views/SeqvarDetailsView/SeqvarDetailsView.vue'
import StaticView from '@/views/StaticView/StaticView.vue'
import StrucvarDetailsView from '@/views/StrucvarDetailsView/StrucvarDetailsView.vue'
import VerifyEmailView from '@/views/VerifyEmailView/VerifyEmailView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/query',
    name: 'query',
    component: QueryView
  },
  {
    path: '/gene/:gene',
    name: 'gene-details',
    component: GeneDetailView,
    props: (route: any) => {
      return {
        hgncSymbol: route.params.gene
      }
    }
  },
  {
    path: '/seqvar/:seqvar',
    name: 'seqvar-details',
    component: SeqvarDetailsView,
    props: (route: any) => {
      return { seqvarDesc: route.params.seqvar }
    }
  },
  {
    path: '/strucvar/:strucvar',
    name: 'strucvar-details',
    component: StrucvarDetailsView,
    props: (route: any) => {
      return { strucvarDesc: route.params.strucvar }
    }
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
    path: '/docs/acmg-docs',
    name: 'acmg-docs',
    component: AcmgSeqvarDocs
  },
  {
    path: '/docs/acmg-cnv',
    name: 'docs-acmg-cnv',
    component: AcmgStrucvarDocs
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
