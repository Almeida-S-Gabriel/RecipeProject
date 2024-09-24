<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User } from '../types';
import { api } from '../api';
import {useRouter} from 'vue-router'
const users = ref<User[]>([]);
const router = useRouter();
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('jwt');
    const { data } = await api.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params:{
         populate: 'role', 
      }
    });

    users.value = data; 
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
  }
};

function handleCardClick(id:number){
   const rota = "/user/"
   router.push(`${rota}${id}`)

}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="user-list">
    <div 
      v-for="(user, i) in users" 
      :key="user.id"
      class="user-card"
      @click="handleCardClick(user.id)"
    >
      <h5 class="username">{{ user.username }}</h5>
      <p class="email">{{ user.email }}</p>
      <p class="Role">{{ user.role.name }}</p>

      <p class="status">
        Bloqueado: <span :class="{'status-blocked': user.blocked}">{{ user.blocked ? 'Sim' : 'Não' }}</span>
      </p>
      <p class="status">
        Confirmado: <span :class="{'status-confirmed': user.confirmed}">{{ user.confirmed ? 'Sim' : 'Não' }}</span>
      </p>
    </div>
  </div>    
</template>

<style scoped>
.user-list {
  display: block;
  margin: 20px auto;
  width: 100%; 
}

.user-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px; 
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  width: 300px;
  margin-left: auto;
  margin-right: auto; 
}

.user-card:hover {
  transform: scale(1.05);
}

.username {
  font-size: 1.25em;
  margin-bottom: 8px;
}

.email {
  color: #555;
}

.status {
  font-size: 0.9em;
}

.status-blocked {
  color: red;
}

.status-confirmed {
  color: green;
}
</style>
