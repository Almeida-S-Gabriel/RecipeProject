<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUpload } from '../composables/useUpload';
import type { RecipeCard, Recipe ,Comment} from '../types';
import userComments from '../components/userComments.vue';
import { api } from '../api';
import { useUserStore } from '../Store/UserStore'

const userStore = useUserStore()

const error = ref<Error>();

const comment = ref<Comment[]>([]);
const receita = ref<RecipeCard>({
  id: 0,
  title: '',
  description: '',
  serving: 0,
  cover: { id: 0, url: '' }
});

const receitaDetails = ref<Recipe>({
  id: 0,
  time: "",
  dificulty: '',
  ingredients: [],
  descrição: [],
  RecipeCard: receita.value
});
const loading = ref(true);
const uploadHelper = useUpload();
const route = useRoute();
const idAtual = computed(() => Number(route.params.id));


onMounted(async () => {
  try {
    const { data } = await api.get(`/recipes`, {
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
        id: data.data[0].id,
        time: data.data[0].time,
        dificulty: data.data[0].dificulty,
        ingredients: data.data[0].ingredients,
        descrição: data.data[0].description,
        RecipeCard: receita.value
      };

      await fetchComments(); 

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


/**comment logic */

const cancelComment = () => {
  newComment.value = '' // Limpar o textarea
}

const token = localStorage.getItem('jwt');

const postComment = async () => {
  const jwt = ref(localStorage.getItem('jwt') || '')
  const isAuthenticated = computed(() => jwt.value !== '')
  if(isAuthenticated){
    const user = ref(localStorage.getItem('username') || '')

    if (newComment.value.trim()) {

    const formData = new FormData()
    formData.append(
      'data',
      JSON.stringify({
          comment: newComment.value,
          recipe: receitaDetails.value.id, 
          userName: user.value
      })
    );
      try {
        await api.post(`/comments`,formData,{
        headers: {
         Authorization: `Bearer ${token}`,
        }
        })
        newComment.value = '' 
        await fetchComments() 
      } catch (error) {
        console.error('Error posting comment:', error)
      }
    }

  }else{
    alert('É necessário Está Logado para comentar')
  }

}

// Dados para novo comentário
const newComment = ref('')

// Função para buscar comentários do Strapi
const fetchComments = async () => {
  try {
    const { data } = await api.get(`/recipes/${receitaDetails.value.id}`, {
      params: {
        populate: 'comments'
      }
    })

    console.log(receitaDetails.value.id)
    console.log(111)
    comment.value = data.data.comments
  } catch (error) {
    console.error('Error fetching comments:', error)
  }
}


onMounted(fetchComments)

</script>

<template>
  <section id="logo">
    <div class="container text-center wow pulse">
      <br />
      <h1>Recipe Book</h1>
    </div>
  </section>
<!-- Recipe Section -->
  <section id="recipe">
    <div class="container">
      <div class="row">
        <!-- Title -->
        <div class="col-12">
          <h2>{{ receita.title }}</h2>
        </div>
      </div>
      <div class="row vertical-align">
        <div class="col-md-8">
          <!-- Picture -->
          <img :src="uploadHelper(receita.cover.url)" :alt="receita.title" class="recipe-picture" />
        </div>
        <div class="col-md-4">
          <!-- Info -->
          <div class="recipe-info">
            <h3>Info</h3>
            <!-- Time -->
            <div class="row">
              <div class="col-2 text-center">
                <i class="fa fa-clock-o" aria-hidden="true"></i>
              </div>
              <div class="col-6">Time</div>
              <div class="col-4">{{ receitaDetails.time }} </div>
            </div>
            <!-- Difficulty -->
            <div class="row">
              <div class="col-2 text-center">
                <i class="fa fa-area-chart" aria-hidden="true"></i>
              </div>
              <div class="col-6">Difficulty</div>
              <div class="col-4">
                {{receitaDetails.dificulty}}
              </div>
            </div>
            <!-- Serves -->
            <div class="row">
              <div class="col-2 text-center">
                <i class="fa fa-users" aria-hidden="true"></i>
              </div>
              <div class="col-6">Servings</div>
              <div class="col-4">{{ receita.serving }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Ingredients -->
      <div class="row wow slideInUp">
        <div class="col-12">
          <div class="recipe-ingredients">
            <h3>Ingredients</h3>
            <dl class="ingredients-list">
              <div v-for="ingredient in receitaDetails.ingredients" :key="ingredient.name">
                <dt>{{ ingredient.quantity }}</dt>
                <dd>{{ ingredient.name }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <!-- Directions -->
      <div class="row wow slideInUp">
        <div class="col-12">
          <div class="recipe-directions">
            <h3>Directions</h3>
            <ol>
              <li v-for="(direction, index) in receitaDetails.descrição" :key="index">{{ direction.name }}</li>
            </ol>
          </div>
        </div>
      </div>
      <!--Comentarios-->
      
      <div class="container my-5 py-5">
      <div class="comment">
          <userComments  v-for="(c, i) in comment" 
          :id = c.id
          :userName = "c.userName"
          :comment="c.comment"
          :date="c.date"
          :onDelete="fetchComments"
          :onEdit="fetchComments"
          />
        </div>
        <div class="card">
             <div class="card-footer py-3 border-0" style="background-color: #f8f9fa;">
               <div class="d-flex flex-start w-100">
                 <div data-mdb-input-init class="form-outline w-100">
                   <textarea v-model="newComment" class="form-control" id="textAreaExample" rows="4" style="background: #fff;"></textarea>
                   <label class="form-label" for="textAreaExample">Message</label>
                 </div>
               </div>
               <div class="float-end mt-2 pt-1">
                 <button @click="postComment" type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-sm">Post comment</button>
                 <button @click="cancelComment" type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-outline-primary btn-sm">Cancel</button>
               </div>
             </div>
           </div>
           </div>
      <!-- Back to recipes -->
      <div class="row wow rollIn">
        <div class="col-12 text-center">
          <a href="http://localhost:5173/receitas/1">
            <i class="fa fa-backward" aria-hidden="true"></i>
            Go to back to recipes.
          </a>
        </div>
      </div>
      
    
  </div>

</section>


</template>

<style scoped>

/*
** Fonts
** -----------------------------------------------------------------------------
*/

@import url('https://fonts.googleapis.com/css?family=Montserrat');
@import url('https://fonts.googleapis.com/css?family=Dancing+Script');
@font-face {
   font-family: 'Quirlycues';
   src: url(../fonts/Quirlycues.ttf);
}


ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
.vertical-align {
  display: flex;
  align-items: center;
}



/*
** Website Logo
** -----------------------------------------------------------------------------
*/

#logo {
  width: 100%;
  min-height: 30x;
  margin-left: auto;
  margin-right: auto;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image:
    radial-gradient(rgba(126, 0, 119, 0.15),
    rgba(126, 0, 119, 0.75)),
}
#logo img {
  height: 10px;
  width: auto;
  margin-top: 24px;
  
}
#logo h1 {
  font-family: 'Quirlycues';
  font-size: 72px;
  font-weight: normal;
  padding-top: 24px;
  color: black;
}



/*
** Recipes Categories
** -----------------------------------------------------------------------------
*/

#categories {
  background-color: #f9f9f9;
  padding-top: 12px;
  padding-bottom: 24px;
}
#categories h2 {
  color: #333;
  font-family: 'Dancing Script', cursive;
  font-size: 2em;
  margin-bottom: 12px;
}
.category-item {
  border: 2px;
  border-color: #ff58df;
  border-radius: 2.5px;
  border-style: solid !important;
  background-color: #a44c9f;
  color: #f9f9f9;
  font-weight: bold;
  margin-top: 6px;
}
.category-item i {
  padding-top: 6px;
  padding-bottom: 3px;
}
.show-all {
  margin-top: 12px;
}

/*
** Recipes Items
** -----------------------------------------------------------------------------
*/

#items {
  background-color: #f1f1f1;
  padding-top: 12px;
  padding-bottom: 24px;
}
#items h2 {
  color: #333;
  font-family: 'Dancing Script', cursive;
  font-size: 2em;
  margin-bottom: 12px;
}
#items h3 {
  margin-top: 12px;
  color: #666;
}


/*
** Recipe Section
** -----------------------------------------------------------------------------
*/
#recipe {
  display: flex;
  flex-direction: column;
}

.recipe-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.recipe-picture {
  width: 100%;
  max-width: 200px; 
  height: auto;
  border-radius: 10px;
  margin-right: 20px; 
}

.recipe-info {
  max-width: 400px;
  flex: 1; 
}


#recipe {
  background-color: #f1f1f1;
  padding-top: 12px;
  padding-bottom: 24px;
}

.recipe-content {
  display: flex;
  align-items: flex-start; 
}

.recipe-picture {
  flex: 1; 
  max-width: 40%;
  height: auto;
  margin-right: 20px; 
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 0px 2px rgba(0,0,0,0.6), 0px 0px 0px 14px #fff, 0px 0px 0px 18px rgba(0,0,0,0.2), 6px 6px 8px 17px #555;
  -moz-box-shadow: 0px 0px 0px 2px rgba(0,0,0,0.6), 0px 0px 0px 14px #fff, 0px 0px 0px 18px rgba(0,0,0,0.2), 6px 6px 8px 17px #555;
  box-shadow: 0px 0px 0px 2px rgba(0,0,0,0.6), 0px 0px 0px 14px #fff, 0px 0px 0px 18px rgba(0,0,0,0.2), 6px 6px 8px 17px #555;
}

.recipe-info .row {
  margin-top: 12px;
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: #f9f9f9;
  -webkit-box-shadow: 0 1px 0 rgba(0,0,0,.15);
  -moz-box-shadow: 0 1px 0 rgba(0,0,0,.15);
  box-shadow: 0 1px 0 rgba(0,0,0,.15);
}

.recipe-info .row .col-2 {
  font-size: 24px;
}

.recipe-info .row .col-6 {
  font-weight: bold; 
}
#recipe h2 {
  color: #333;
  font-family: 'Dancing Script', cursive;
  font-size: 2em;
  margin-bottom: 24px;
  margin-top: 12px;
}
#recipe h3 {
  background-color: #f1f1f1;
  margin-top: 24px;
}

.recipe-info .row {
  margin-top: 12px;
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: #f9f9f9;
  -webkit-box-shadow: 0 1px 0 rgba(0,0,0,.15);
  -moz-box-shadow: 0 1px 0 rgba(0,0,0,.15);
  box-shadow: 0 1px 0 rgba(0,0,0,.15);
}
.recipe-info i {
  color: #a44c9f;
}
.recipe-ingredients {
  background-color: #f9f9f9;
  margin-top: 24px;
}
.ingredients-list dl {
  display: inline-block;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.ingredients-list dt {
  width: 15%;
  float: left;
  margin: 0 0 8px;
  padding: 0 10px;
  font-size: 13px;
  line-height: 37px;
  background: #f9f9f9;
  -webkit-box-shadow: 0 1px 0 rgba(0,0,0,.15);
  -moz-box-shadow: 0 1px 0 rgba(0,0,0,.15);
  box-shadow: 0 1px 0 rgba(0,0,0,.15);
}
.ingredients-list dd {
  width: 85%;
  float: left;
  margin: 0 0 8px;
  padding: 0 15px;
  font-size: 13px;
  line-height: 37px;
  font-weight: 600;
  background: #a44c9f;
  color: #f9f9f9;
  -webkit-box-shadow: 0 1px 0 rgba(0,0,0,.15);
  -moz-box-shadow: 0 1px 0 rgba(0,0,0,.15);
  box-shadow: 0 1px 0 rgba(0,0,0,.15);
}
.recipe-directions ol {
    counter-reset: li;
    list-style: none;
    padding: 0;
    margin-bottom: 4em;
    text-shadow: 0 1px 0 rgba(255,255,255,.5);
}
.recipe-directions ol ol {
    margin: 0 0 0 2em;
}
.recipe-directions li {
    position: relative;
    display: block;
    padding: .4em .4em .4em .8em;
    padding: .4em;
    margin: .5em 0 .5em 2.5em;
    background: #f9f9f9;
    color: #222;
    text-decoration: none;
    transition: all .3s ease-out;
    -webkit-box-shadow: 0 1px 0 rgba(0,0,0,.15);
    -moz-box-shadow: 0 1px 0 rgba(0,0,0,.15);
    box-shadow: 0 1px 0 rgba(0,0,0,.15);
}
.recipe-directions li:hover{
    background: #f1f1f1;
}
.recipe-directions li:before{
    content: counter(li);
    counter-increment: li;
    position: absolute;
    left: -2.5em;
    top: 50%;
    margin-top: -1em;
    background: #a44c9f;
    height: 2em;
    width: 2em;
    line-height: 2em;
    text-align: center;
    font-weight: bold;
    color: #f9f9f9;
}
.recipe-directions li:after{
    position: absolute;
    content: '';
    border: .5em solid transparent;
    left: -1em;
    top: 50%;
    margin-top: -.5em;
    transition: all .3s ease-out;
}
.recipe-directions li:hover:after{
    left: -.5em;
    border-left-color: #a44c9f;
}




</style>