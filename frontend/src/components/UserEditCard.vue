<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { ApplicationError, User, Role } from '../types';
import { api } from '../api';

const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const exception = ref<ApplicationError | null>(null);
const router = useRouter();
const isEditable = ref(false);
const showDeleteModal = ref(false);

const route = useRoute();
const idAtual = computed(() => route.params.id);

const userRole = ref<Role>({ name: '' });
const user = ref<User>({
  id: 0,
  username: '',
  email: '',
  role: userRole.value,
  blocked: '',
  confirmed: '',
});

const toggleEditable = () => {
  isEditable.value = !isEditable.value;
};

const token = localStorage.getItem('jwt');
const rota = "/users/";

onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await api.get(`${rota}${idAtual.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        populate: 'role', 
      }
    });
    user.value = data;
  } catch (e) {
    exception.value = { error: { name: 'CarregarUsuario', message: 'Erro ao carregar o usuário.' } };
  } finally {
    loading.value = false;
  }
});

const deleteUser = async () => {
  try {
    await api.delete(`${rota}${idAtual.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
    });
    alert('Usuário excluído com sucesso!');
    router.push('/users');
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    alert('Erro ao excluir o usuário. Verifique se a senha está correta.');
  }
};


const handleDelete = async () => {
  const confirmSave = confirm('Você deseja Editar as alterações?');
  if (!confirmSave) return; 
  loading.value = true;
  await deleteUser();
  showDeleteModal.value = false;
  loading.value = false;
  router.push('/adminUsers')
};

const handleEdit = async () => {
  loading.value = true;
  exception.value = null;

  if (password.value !== confirmPassword.value) {
    exception.value = { error: { name: 'PasswordMismatch', message: 'As senhas não correspondem.' } };
    loading.value = false;
    return;
  }

  try {
    await api.put(`${rota}${idAtual.value}`, {
      username: user.value.username,
      email: user.value.email,
      blocked: user.value.blocked,
      confirmed: user.value.confirmed,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    alert('Usuário atualizado com sucesso!');
    loading.value = false;
    isEditable.value = false;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    exception.value = { error: { name: 'Err', message: 'Erro ao atualizar o usuário.' } };
    loading.value = false;
  }
};
</script>


<template>
  <div class="row justify-content-center">
    <div class="col-6 card">
      <div class="card-body">
        <h5 class="card-title">Editar Usuário</h5>
        <div v-if="exception" class="alert alert-danger" role="alert">
          {{ exception.error.message }}
        </div>
        <div v-if="loading" class="spinner-grow" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <form v-else @submit.prevent="handleEdit">
          <div class="mb-3">
            <label for="usernameInput" class="form-label">Nome de usuário:</label>
            <input
              type="text"
              class="form-control"
              id="usernameInput"
              placeholder="Usuário"
              v-model="user.username"
              :disabled="!isEditable" 
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
              :placeholder="user.email || 'Email'" 
              v-model="user.email"
              :disabled="!isEditable" 
              required
            />
            <div class="invalid-feedback">Você deve informar um email válido.</div>
          </div>
          <div class="mb-3">
            <label for="blockedInput" class="form-label">Bloqueado:</label>
            <input
              type="checkbox"
              class="form-check-input"
              id="blockedInput"
              v-model="user.blocked"
              :disabled="!isEditable"
            />
          </div>
          <div class="mb-3">
            <label for="confirmedInput" class="form-label">Confirmado:</label>
            <input
              type="checkbox"
              class="form-check-input"
              id="confirmedInput"
              v-model="user.confirmed"
              :disabled="!isEditable"
            />
          </div>

          <div class="mb-3">
            <label for="passwordInput" class="form-label">Senha:</label>
            <input
              type="password"
              class="form-control"
              id="passwordInput"
              v-model="password"
              :disabled="!isEditable" 
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
              :disabled="!isEditable"
              
            />
            <div class="invalid-feedback">Por favor, confirme sua senha.</div>
          </div>
          <div class="mb-3">
            <input type="submit" class="float-end btn btn-primary" value="Salvar" :disabled="!isEditable"/>
            <button type="button" class="btn btn-secondary me-2" @click="toggleEditable">
              {{ isEditable ? 'Cancelar' : 'Editar' }}
            </button>
            <button type="button" class="btn btn-danger" @click="handleDelete">
              Excluir
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmação de exclusão -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Confirmar Exclusão</h5>
          <button @click="showDeleteModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <p>Para confirmar a exclusão, insira sua senha:</p>
          <input type="password" v-model="confirmPassword" placeholder="Senha" />
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn btn-secondary">Cancelar</button>
          <button @click="handleDelete" class="btn btn-danger">Excluir</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
