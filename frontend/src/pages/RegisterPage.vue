<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api'
import { useUserStore } from '../Store/UserStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '../composables/userApplicationError'
import type { ApplicationError } from '../types'

const identifier = ref('')
const password = ref('')
const confirmPassword = ref('')
const username = ref('')
const loading = ref(false)
const exception = ref<ApplicationError>()
const router = useRouter()

const userStore = useUserStore()

async function register() {
  try {
    loading.value = true
    exception.value = undefined

    if (password.value !== confirmPassword.value) {
      exception.value = { error: { name: 'ValidationError', message: 'As senhas não coincidem.' } }
      return
    }

    // Enviando a requisição para o registro
    const { data } = await api.post('/auth/local/register', {
      username: username.value,
      email: identifier.value, // Usando 'identifier' como email
      password: password.value,
      confirmed: true,
      blocked: false
    })

      identifier.value = ''
    password.value = ''
    confirmPassword.value = ''
    router.push('/') 
    console.log('a')
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = {
        error: {
          name: e.response?.data.error.name || 'UnknownError',
          message: e.response?.data.error.message
        }
      }
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-6 card">
      <div class="card-body">
        <h5 class="card-title">Registrar-se</h5>
        <div v-if="exception" class="alert alert-danger" role="alert">
          {{ exception.error.message }}
        </div>
        <div v-if="loading" class="spinner-grow" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <form v-else @submit.prevent="register">
          <div class="mb-3">
            <label for="usernameInput" class="form-label">Nome de usuário:</label>
            <input
              type="text"
              class="form-control"
              id="usernameInput"
              placeholder="Usuário"
              v-model="username"
              required
            />
            <div class="invalid-feedback">Você deve informar um nome de usuário.</div>
          </div>
          <div class="mb-3">
            <label for="emailInput" class="form-label">Email:</label>
            <input
              type="email"
              class="form-control"
              id="emailInput"
              placeholder="mail@mail.com"
              v-model="identifier"
              required
            />
            <div class="invalid-feedback">Você deve informar um email válido.</div>
          </div>
          <div class="mb-3">
            <label for="passwordInput" class="form-label">Senha:</label>
            <input
              type="password"
              class="form-control"
              id="passwordInput"
              v-model="password"
              required
            />
            <div class="invalid-feedback">A senha é um campo obrigatório.</div>
          </div>
          <div class="mb-3">
            <label for="confirmPasswordInput" class="form-label">Confirme a Senha:</label>
            <input
              type="password"
              class="form-control"
              id="confirmPasswordInput"
              v-model="confirmPassword"
              required
            />
            <div class="invalid-feedback">Por favor, confirme sua senha.</div>
          </div>
          <div class="mb-3">
            <input type="submit" class="float-end btn btn-primary" value="Registrar" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Adicione seu estilo aqui, se necessário */
</style>
