import Order from 'pages/Order'
import GoogleNewsLayout from '../layouts/GoogleNewsLayout'
import Cal from '../pages/Cal'
import TextInput from '../pages/TextInput'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: '/order',
        component: Order
      },
      {
        path: '/calendar',
        component: Cal
      },
      {
        path: '/order',
        component: Order
      },
      {
        path: '/text',
        component: TextInput
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
