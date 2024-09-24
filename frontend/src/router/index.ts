import { createWebHistory, createRouter } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import RecipeList from '@/pages/RecipeList.vue'
import Home from '@/pages/HomeView.vue'
import Login from '@/pages/LoginPage.vue'
import HomeAdmin from '@/Admin/RecipeEditAdmin.vue'
import ToEditRecipe from '@/pages/ToEditRecipe.vue'
import ReceitaDetails from '@/pages/ReceitaDetails.vue'
import UserComments from '@/components/userComments.vue'
import CreateRecipe from '@/pages/ToCreateRecipe.vue'
import { useUserStore } from '@/Store/UserStore'
import RegisterPage from '@/pages/RegisterPage.vue';
import UserEdit from '@/components/UserEditCard.vue';
import UserList from '@/Admin/UsersList.vue'
import Admin from '@/Admin/Admin.vue'

export const routes = [
  { path: '/receitas/:id', component: RecipeList },
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { 
    path: '/adminReceitas', component: HomeAdmin,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const userStore = useUserStore();
      if (userStore.isAdmin) {
        next(); 
      } else {
        next('/'); 
      }
    },
   },
  
  { 
    path: '/receita-edit/:id', component: ToEditRecipe, 
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const userStore = useUserStore();
      if (userStore.isAdmin) {
        next(); 
      } else {
        next('/'); 
      }
    },
  },
  
  { path: '/receita-detalhe/:id', component: ReceitaDetails },
  { path: '/comment', component: UserComments },
  {
    path: '/create',
    component: CreateRecipe,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const userStore = useUserStore();
      if (userStore.isAdmin) {
        next(); 
      } else {
        next('/'); 
      }
    },
  },
  {path: '/register',component:RegisterPage},
  {path: '/user/:id',component:UserEdit},
  {path: '/adminUsers',component:UserList,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const userStore = useUserStore();
      if (userStore.isAdmin) {
        next(); 
      } else {
        next('/'); 
      }
    },
  },
  {path: '/admin',component:Admin,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const userStore = useUserStore();
      if (userStore.isAdmin) {
        next(); 
      } else {
        next('/'); 
      }
    },
  }

]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
