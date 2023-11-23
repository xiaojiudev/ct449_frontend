import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/products/:id',
      name: 'ProductDetail',
      component: () => import('../views/ProductDetailView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { layout: 'LoginLayout' },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { layout: 'LoginLayout' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { requiresAuth: true, },
    },
    {
      path: '/myOrders',
      name: 'myOrders',
      component: () => import('../views/TrackOrderView.vue'),
      meta: { requiresAuth: true, },
    },
    {
      path: '/orders/:id',
      name: 'orders',
      component: () => import('../views/ThankYouView.vue'),
      meta: { requiresAuth: true, },
    },
    {
      path: '/:catchAll(.*)', 
      name: 'NotFound',
      component: () => import('../views/404NotFoundView.vue'), 
    },
  ]
})

router.beforeEach((to, from, next) => {

  if (to.matched.some(route => route.meta.requiresAuth)) {

    const token = getCookie('token');

    if (!token) {

      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
})


export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

export default router
