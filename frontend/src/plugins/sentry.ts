/**
 * plugins/sentry.ts
 *
 * Integration of sentry into our frontend.
 */
import * as Sentry from '@sentry/vue'
import { type App } from 'vue'
import { type Router } from 'vue-router'

export async function setupSentry(app: App, router: Router) {
  Sentry.init({
    app,
    dsn: 'https://ee06fe1f4715e740256c7b762fe0e162@sentry.cubi.bihealth.org/7',
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router)
      }),
      new Sentry.Replay()
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      // 'localhost',
      // '127.0.0.1',
      /^https:\/\/reev.bihealth.org\//,
      /^https:\/\/reev.cubi.bihealth.org\//,
      /^https:\/\/reev-staging.bihealth.org\//,
      /^https:\/\/reev-staging.cubi.bihealth.org\//
    ],

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
  })
}
