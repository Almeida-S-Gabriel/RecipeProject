<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { RecipeCard } from '@/types';
import { api } from '@/api';
import { useUpload } from '@/composables/useUpload'
import { useRouter } from 'vue-router';
const receitas = ref([] as RecipeCard[])
const loading = ref(true)
const error = ref<Error>()

const uploadHelper = useUpload()
const router = useRouter();
const token = localStorage.getItem('jwt');

onMounted( async () => {
  try {
    const { data } = await api.get('/receitas',{
      params:{
      populate:'cover'
      }
    })

    receitas.value = data.data
  } catch(e) {
    error.value = e as Error
  } finally {
    loading.value = false
  }
})


function editclick(id: number) {
  const passo = "/receita-edit/"
  const url =`${passo}${id}`;
  router.push(url);
}

const successMessage = ref('')
const removeclick = async (id: number) => {
  const confirmSave = confirm('Você deseja Editar as alterações?');
  if (!confirmSave) return; 
  try {
    // Obter receita e recipe associados
    const { data } = await api.get(`/receitas/${id}`, {
      headers: {
         Authorization: `Bearer ${token}`,
        },
      params: {
        populate: 'recipe',
      },
    });

    const recipeId = data.data.recipe.id;
    
    const { data: commentsData } = await api.get(`/comments`, 
    
    {
      headers: {
         Authorization: `Bearer ${token}`,
        },
      params: {
        recipe: recipeId, 
      },
    });

    const comments = commentsData.data;
    for (const comment of comments) {
      await api.delete(`/comments/${comment.id}`,{
        headers: {
         Authorization: `Bearer ${token}`,
        }
      });
      console.log(`Comentário ${comment.id} removido com sucesso`);
    }
    
    if (recipeId) {
      await api.delete(`/recipes/${recipeId}`,{
        headers: {
         Authorization: `Bearer ${token}`,
        }
      });
      console.log(`Recipe ${recipeId} removido com sucesso`);
    }

    await api.delete(`/receitas/${id}`,{
      headers: {
         Authorization: `Bearer ${token}`,
        }
    });
    
    console.log(`Receita ${id} removida com sucesso`);

    receitas.value = receitas.value.filter((receita) => receita.id !== id);
    successMessage.value = 'Receita Excluida com sucesso!';
    setTimeout(() => {
      successMessage.value = '';
    }, 1000);


  } catch (error) {
    console.error('Erro ao remover a receita, o recipe ou os comentários:', error);
  }
};

function criarclick(){
  const passo = "/create"
 
  router.push(passo);
}



</script>

<template>
 <div class="text-center">
    <button @click="criarclick" id="criar">Criar</button>
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

  </div>

  <div v-if="error" class="alert alert-danger" role="alert">
          {{ error.message }}
        </div>

        <div v-if="loading" class="spinner-border" role="status">
           <span class="visually-hidden">Loading...</span>
        </div>
        <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Servings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="receita in receitas" :key="receita.id">
                <td> {{  receita.id }}</td>
                <td> <img :src="uploadHelper(receita.cover.url)" :alt="receita.title"><br> {{ receita.title }}</td>
                <td> {{ receita.serving }}</td>
                <td><button @click="editclick(receita.id)">Editar</button><button @click="removeclick(receita.id)">Remover</button></td>
              </tr>
            </tbody>
          </table>
        </div>
</template>

<style scoped>
.text-center {
  text-align: center; /* Centraliza o conteúdo horizontalmente */
}

#criar {
  margin-bottom: 20px; /* Espaço abaixo do botão, se necessário */
}
.table {
  width: 100%;
  margin: 20px 0;
  border-collapse: collapse;
}

.table thead {
  background-color: #f8f9fa;
}

.table th, .table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.table th {
  font-weight: bold;
}

.table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table tbody tr:hover {
  background-color: #e9ecef;
}

.table img {
  max-width: 100px;
  height: auto;
  display: block;
  margin-bottom: 8px;
}

/* Estilo para a mensagem de erro */
.alert {
  margin: 20px 0;
  padding: 15px;
  border-radius: 5px;
  background-color: #f8d7da;
  color: #721c24;
}

/* Estilo para o carregamento */
.spinner-border {
  display: block;
  margin: 20px auto;
}

/* Estilo para os botões de ação */
button {
  margin-right: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

/* Estilo para a linha do cabeçalho */
th {
  font-size: 1.1rem;
  color: #495057;
}

/* Estilo para a estrutura geral */
.row {
  margin: 0;
}

.col {
  padding: 0;
}
</style>
