import Grid from 'pages/Grid'
import GoogleNewsLayout from '../layouts/GoogleNewsLayout'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: '/grid',
        component: Grid
      }
    ]
  },
  {
    path: '/news',
    component: GoogleNewsLayout
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
