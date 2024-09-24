<template>
  <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
  </svg>

  <div class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
  </div>

  <header data-bs-theme="dark">
    <div class="navbar navbar-dark bg-dark shadow-sm">
      <div class="container">
        <a href="#" class="navbar-brand d-flex align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor"
            stroke-linecap="round" stroke-linejoin="round" stroke-width="2" aria-hidden="true" class="me-2"
            viewBox="0 0 24 24">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <strong>Album</strong>
        </a>
        <div class="d-flex">
          <button @click="goToReceitas" class="btn btn-outline-light ms-2">Receitas</button>
          
          <button v-if="isAdmin" @click="goToAdmin" class="btn btn-outline-light ms-2">Admin</button>
          <button v-if="!isAuthenticated" @click="goToLogin" class="btn btn-outline-light ms-2">Login</button>
          <button v-if="isAuthenticated" @click="logout" class="btn btn-outline-light ms-2">Logout</button>
          <button v-if="!isAuthenticated" @click="goToRegister" class="btn btn-outline-light ms-2">Registrar-se</button>
          <button @click="goToBegin" class="btn btn-outline-light ms-2">Inicio</button>
        </div>
      </div>
    </div>
  </header>

  <main>
    <router-view />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/Store/UserStore'

const router = useRouter()
const userStore = useUserStore()

const jwt = ref(localStorage.getItem('jwt') || '')
const role = ref(localStorage.getItem('role') || '')

const isAuthenticated = computed(() => jwt.value !== '')
const isAdmin = computed(() => role.value === 'admin')

const goToReceitas = () => {
  router.push('/receitas/1')
}

const goToAdmin = () => {
  router.push('/admin')
}

const goToLogin = () => {
  router.push('/login') 
}

const goToBegin = () => {
  router.push('/')
}

const goToRegister = () => {
  router.push('/register') 
}

const logout = () => {
  userStore.logout() 
  jwt.value = ''
  role.value = ''
  localStorage.removeItem('jwt')
  localStorage.removeItem('role')
  router.push('/') 
}

watch(
  () => userStore.jwt, 
  (newValue) => {
    jwt.value = newValue || ''
    localStorage.setItem('jwt', newValue || '')

    role.value = localStorage.getItem('role') || ''
  },
  { immediate: true }
)

watch(
  () => localStorage.getItem('role'), 
  (newValue) => {
    role.value = newValue || '' 
  },
  { immediate: true }
)

</script>
