<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import type { RecipeCard, Recipe } from '../types';
import { api } from '../api';
import { useUserStore } from '../Store/UserStore';

const userStore = useUserStore()

const route = useRoute();
const cover = ref<File>()

const coverInput = ref<HTMLInputElement | null>(null);

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

const createRecipe = async () => {
   console.log(userStore.jwt)
  const formData = new FormData();

  if (cover.value) {
    formData.append('files.cover', cover.value);  
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
    const responseCard = await api.post(`/receitas`, formData, {
      headers: {
        'Authorization': `Bearer ${userStore.jwt}`,
      },
    });

   receita.value.id = responseCard.data.data.id; 

   const recipeFormData = new FormData();
   console.log(receita.value.id)
   const recipeData = {
      time: receitaDetails.value.time, 
      dificulty: receitaDetails.value.dificulty,
      ingredients: receitaDetails.value.ingredients.map(ingredient => ({
         name: ingredient.name,
         quantity: ingredient.quantity,
   })),
      description: receitaDetails.value.descrição.map(desc => ({
         name: desc.name,
      })),
      receita: { 
         id: receita.value.id
      },
   };

recipeFormData.append('data', JSON.stringify(recipeData));



    const responseRecipe = await api.post(`/recipes/`, recipeFormData,{
      headers:{
         'Authorization': `Bearer ${userStore.jwt}`,
      }
    });
    console.log(' Recipe criada com sucesso', responseRecipe.data);

  } catch (error) {
    console.error('Erro ao criar ou atualizar a Recipe:', error);
  }
};

const successMessage = ref('')

const Salve = async () => {
  const confirmSave = confirm('Você deseja salvar as alterações?');
  if (!confirmSave) return; 

  try {
    await createRecipe(); 
    console.log('Receita e Recipe atualizados com sucesso');
    successMessage.value = 'Receita salva com sucesso!';
    receita.value = { id: 0, title: '', description: '', serving: 0, cover: { id: 0, url: '' } };
    
    receitaDetails.value = {
      id: 0,
      time: '',
      dificulty: '',
      ingredients: [],
      descrição: [],
      RecipeCard: { id: 0, title: '', description: '', serving: 0, cover: { id: 0, url: '' } } 
    };
    
    cover.value = undefined;
    if (coverInput.value) {
      coverInput.value.value = '';
    }    

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
            placeholder="Digite o título da receita"
            required
            />
            
        </div>
      </div>
      <div class="row vertical-align">
        <div class="col-12">
          <!-- Picture -->
          <div class="col-md-8 pull-left wow swing">
            <input
              @change="handleUpload"
              type="file"
              id="coverInput"
              accept="image/*"
              class="form-control"
              ref="coverInput" 
              required
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

        <button type="submit">Salvar</button>
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
   gap: 15px; 
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

</style>