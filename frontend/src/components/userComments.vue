<template>
  <section style="background-color: #eee;">
    <div class="row d-flex justify-content-center">
      <div class="col-md-12 col-lg-10 col-xl-8">
        <!-- Exibe a lista de comentários -->
        <div class="card-body">
          <div class="d-flex flex-start align-items-center">
            <div>
              <h6 class="fw-bold text-primary mb-1">{{ userName }}</h6>
              <p class="text-muted small mb-0">
                {{ formatDate(date) }}
              </p>
            </div>
          </div>

          <div v-if="isEditing">
            <input 
              v-model="editCommentText" 
              class="form-control" 
              type="text"
            />
            <button @click="saveEdit" class="btn btn-primary mt-2">Salvar</button>
          </div>
          <p v-else class="mt-3 mb-4 pb-2">
            {{ comment }}
          </p>

          <div class="small d-flex justify-content-start">
            <a v-if="(isUser && !isEditing) || (isAdmin && !isEditing)" href="#!" class="d-flex align-items-center me-3">
              <i class="delete"></i>
              <p @click="deleteComment" class="mb-0">delete</p>
            </a>
            <a v-if="(isUser && !isEditing) || (isAdmin && !isEditing)" href="#!" class="d-flex align-items-center me-3">
              <i class="editar"></i>
              <p @click="toggleEdit" class="mb-0">Editar</p>
            </a>
          </div>
          <hr class="my-3" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { api } from '../api';
import type { Comment } from '@/types/index';

const props = defineProps<{
  userName: string;
  comment: string;
  date: Date;
  id: number;
  onDelete: () => void;
  onEdit: () => void;  
}>();

const isUser = computed(() => {
  const jwt = localStorage.getItem('jwt') || '';
  const username = localStorage.getItem('username') || '';
  return jwt !== '' && username === props.userName;
});

const isAdmin = computed(()=>{
  const role = localStorage.getItem('role') || '';
  return role !== '' && role === 'admin';
}

)

const isEditing = ref(false);
const editCommentText = ref(props.comment);

// Função para formatar a data
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString(); 
};

const deleteComment = async () => {
  const idComments = props.id;
  try {
    await api.delete(`/comments/${idComments}`,{
      headers: {
         Authorization: `Bearer ${token}`,
        }
    });
    props.onDelete(); 
  } catch (error) {
    console.error('Erro ao deletar o comentário:', error);
  }
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const token = localStorage.getItem('jwt');

const saveEdit = async () => {
  if (editCommentText.value.trim() === '') {
    alert('O comentário não pode estar vazio.');
    return; 
  }

  const formData = new FormData()
    formData.append(
      'data',
      JSON.stringify({
          comment: editCommentText.value,
      })
    );

  const idComments = props.id;
  try {
    await api.put(`/comments/${idComments}`, formData,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    isEditing.value = false; 
    props.onEdit()
  } catch (error) {
    console.error('Erro ao editar o comentário:', error);
  }
};

</script>

<style scoped>
</style>
