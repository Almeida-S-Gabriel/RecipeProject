
<script setup lang="ts">

import type { RecipeCard } from '@/types';
import { useUpload } from '@/composables/useUpload';
import {useRouter }from 'vue-router'
const props = defineProps<RecipeCard>();
const router = useRouter()

const uploadHelper = useUpload()
const rota = '/receita-detalhe/'
function goToRecipe(){
  router.push(`${rota}${props.id}`)
}

</script>

<template>
  <div class="col">
    <div class="card shadow-sm" @click="goToRecipe">
      <img :src="uploadHelper(cover.url)" :alt="`Capa da Receita ${title}`" class="cover">
      <div class="card-body">
        <h5 class="card-title">{{  title }}</h5>
        <p class="card-text">
          {{ description }}
        </p>
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-body-secondary">{{ serving }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cover {
  width: 100%; 
  height: 500px; 
  object-fit: cover; 
}
</style>