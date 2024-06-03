import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../views/UserLogin.vue';
import UserProfile from '../views/UserProfile.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: UserLogin
  },
  {
    path: '/user/:userId',
    name: 'UserProfile',
    component: UserProfile,
    props: (route) => ({
      userId: route.params.userId,
      statusFilter: route.query.statusFilter || 'all',
      userFilter: route.query.userFilter || 'all',
      searchQuery: route.query.searchQuery || ''
    })
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
