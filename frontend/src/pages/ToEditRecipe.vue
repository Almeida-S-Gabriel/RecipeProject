<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUpload } from '../composables/useUpload';
import type { RecipeCard, Recipe } from '../types';
import { api } from '../api';

const token = localStorage.getItem('jwt');

const uploadHelper = useUpload();
const route = useRoute();
const idAtual = computed(() => Number(route.params.id));
const cover = ref<File>()


function handleUpload(event: Event) {
  const inputEvent = event as InputEvent
  const target = inputEvent.target as HTMLInputElement
  cover.value = target.files?.item(0) as File
}

const receita = ref<RecipeCard>({
  id: 0,
  title: '',
  description: '',
  serving: 0,
  cover:{id:0,url:''}
});

const receitaDetails = ref<Recipe>({
  id:0,
  time: '',
  dificulty: '',
  ingredients: [],
  descrição: [],
  RecipeCard: receita.value 
});

const loading = ref(true);
const error = ref<Error>();

onMounted(async () => {
  try {
    const { data } = await api.get(`/recipes`, 
    
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        filters: {
          receita: {
            id: {
              $eq: idAtual.value 
            }
          }
        },
        populate: 'receita.cover,ingredients' 
      }
    });

    if (data.data.length > 0) {
      receita.value = data.data[0].receita;
      receitaDetails.value = {
        id:data.data[0].id,
        time: data.data[0].time,
        dificulty: data.data[0].dificulty,
        ingredients: data.data[0].ingredients,
        descrição:data.data[0].description,
        RecipeCard: receita.value,

      };
    } else {
      console.error('Nenhum dado encontrado.');
    }
  } catch (e) {
    error.value = e as Error;
    console.error('Erro ao buscar dados', e);
  } finally {
    loading.value = false;
  }
});


const addIngredient = () => {
  receitaDetails.value.ingredients.push({ name: '', quantity: '' });
};

const removeIngredient = (index: number) => {
  receitaDetails.value.ingredients.splice(index, 1);
};

const addDescription = () => {
  receitaDetails.value.descrição.push({ name: '', });
};

const removeDescription = (index: number) => {
  receitaDetails.value.descrição.splice(index, 1);
};


const updateReceita = async () => {

  const formData = new FormData();

  if (cover.value) {
    formData.append('files.cover', cover.value as File);  
  }

  formData.append(
    'data',
    JSON.stringify({
      title: receita.value.title,
      description: receita.value.description,
      serving: receita.value.serving,
    })
  );

  try {
    const response = await api.put(`/receitas/${receita.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
         Authorization: `Bearer ${token}`,

      },
    });

    console.log('Receita atualizada com sucesso', response.data);
  } catch (error) {
    console.error('Erro ao atualizar receita', error);
  } finally {
  }
};



const updateRecipe = async () => {

  const formData = new FormData();
formData.append(
  'data',
  JSON.stringify({
    time: receitaDetails.value.time,
    dificulty: receitaDetails.value.dificulty,
    ingredients: receitaDetails.value.ingredients.map(ingredient => ({
      name: ingredient.name,
      quantity: ingredient.quantity
    })),
    description: receitaDetails.value.descrição.map(desc => ({
      name: desc.name,
      
    }))
  })
);
  try {
    
    const response = await api.put(`/recipes/${receitaDetails.value.id}`, formData,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Resposta da API:', response.data);
  } catch (e) {
    if (e instanceof Error) {
      console.error('Erro ao atualizar a recipe completa:', e.message);
    } else {
      console.error('Erro desconhecido:', e);
    }
  }
};

const successMessage = ref('')

const Salve = async () => {
  const confirmSave = confirm('Você deseja Editar as alterações?');
  if (!confirmSave) return; 

  try {
    await updateReceita();
    await updateRecipe();
    
    successMessage.value = 'Receita Editada com sucesso!';

    console.log('Receita e Recipe atualizados com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar:', error);
  }
};


</script>

<template>

  <section id="recipe">
    <div class="container">
      <!-- Logo -->
      <section id="logo">
        <div class="container text-center wow pulse">
          <br />
          <h1>Recipe Book</h1>
        </div>
      </section>
    <form @submit.prevent="Salve">

      <!-- Recipe Section -->
      <div class="row">
        <!-- Title -->
        <div class="col-12">
          <input
            type="text"
            v-model="receita.title"
            placeholder="Digite o título da receita"/>
        </div>
      </div>
      <div class="row vertical-align">
        <div class="col-12">
          <!-- Picture -->
          <div class="col-md-8 pull-left wow swing">
            <img :src="uploadHelper(receitaDetails.RecipeCard.cover.url)" :alt="receitaDetails.RecipeCard.title" class="recipe-picture" />
            <input
              @change="handleUpload"
              type="file"
              id="coverInput"
              accept="image/*"
              class="form-control"
            />
          </div>
        </div>
      </div>

      <!-- Info serving, time, difficulty -->
        <label for="serving">Serving:</label>
        <input type="number" v-model="receita.serving" id="serving" />

        <label for="time">Time:</label>
        <input type="string" v-model="receitaDetails.time" id="time" />

        <label for="dificuldade">Dificuldade:</label>
        <select v-model="receitaDetails.dificulty" id="dificuldade">
          <option value="Fácil">Fácil</option>
          <option value="Médio">Médio</option>
          <option value="Difícil">Difícil</option>
        </select>
        
        <!--Ingredientes-->
        <div>Ingredientes</div>
        <div v-for="(ingredient, index) in receitaDetails.ingredients" :key="index">
        <input type="text" v-model="ingredient.name" placeholder="Ingrediente" />
        <input type="number" v-model="ingredient.quantity" placeholder="Quantidade" />
        <button type="button" @click="removeIngredient(index)">Remover</button>
        </div>
        <button type="button" @click="addIngredient">Adicionar Ingrediente</button>
              <!--Ingredientes-->

              <!-- Descrição -->
        <div>Descrição</div>
        <div v-for="(desc, index) in receitaDetails.descrição" :key="index">
          <input type="text" v-model="desc.name" placeholder="Descrição" />
          <button type="button" @click="removeDescription(index)">Remover</button>
        </div>
        <button type="button" @click="addDescription">Adicionar Descrição</button>
        <!-- Descrição -->
        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

        <button type="submit" >Salvar</button>
      </form>
    </div>
  </section>
</template>


<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Adiciona espaço entre os elementos */
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

input, select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

input[type="file"] {
  padding: 5px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

button {
  padding: 12px;
  font-size: 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.recipe-picture {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
}

.ingredients, .description {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ingredients input, .description input {
  flex: 1 1 calc(50% - 20px); /* Faz os inputs ocuparem metade da linha */
}

button[type="button"] {
  flex: 0 0 100%; /* Botões ficam em uma linha separada */
  margin-top: 10px;
}

#logo {
  background-image:
    radial-gradient(rgba(126, 0, 119, 0.15),
    rgba(126, 0, 119, 0.75)),
    url("/home/gabriel/projeto/frontend/src/pages/css/kitchen-banner.jpg");
  background-size: cover;
  background-position: center;
  min-height: 300px; /* Ajuste o tamanho conforme necessário */
}

#logo img {
  height: 80px;
  margin-top: 20px;
}

#logo h1 {
  font-family: 'Quirlycues';
  font-size: 60px;
  color: #fff;
  margin-top: 10px;
}

/**botoes style */

</style>