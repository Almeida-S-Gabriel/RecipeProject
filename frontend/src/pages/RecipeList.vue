<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import type { RecipeCard } from '../types';
import { api } from '../api';
import { gerarPaginacao } from '../paginainfo';
import RestaurantCard from '@/components/RestaurantCard.vue';
import { useRoute } from 'vue-router';

const receitas = ref<RecipeCard[]>([]);
const totalItens = ref(0);
const itensPorPagina = 3;
const route = useRoute();
const paginaAtual = computed(() => {
  const id = Number(route.params.id);
  return isNaN(id) ? 1 : id; // Defina um valor padrão (por exemplo, 1) se a conversão falhar
});

// Computed para calcular o número total de páginas
const totalPaginas = computed(() => Math.ceil(totalItens.value / itensPorPagina));

// Computed para a paginação
const paginacao = computed(() => gerarPaginacao(totalPaginas.value, paginaAtual.value));

// Função para buscar os dados da página atual
const buscarReceitas = async (pagina: number) => {
  try {
    const { data } = await api.get('/receitas', {
      params: {
        populate: 'cover',
        'pagination[page]': pagina,
        'pagination[pageSize]': itensPorPagina
      },
      
    });
    receitas.value = data.data;
    

    totalItens.value = data.meta.pagination.total;
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    // Adicione uma mensagem de erro ou notificação para o usuário
  }
};

// Fetch inicial e configuração
onMounted(() => {
  buscarReceitas(paginaAtual.value); // Use `.value` para obter o valor do computed
});

// Assista mudanças na página atual
watch(paginaAtual, (novaPagina) => {
  buscarReceitas(novaPagina);
});


</script>


<template>
   
  <main>



    <div class="album py-5 bg-body-tertiary">
      <div class="container">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          <RestaurantCard  v-for="(receita, i) in receitas" 
          :id="receita.id"
          :title="receita.title"
          :description="receita.description"
          :serving="receita.serving"
          :cover="receita.cover"
          />
        </div>  
        <div v-html="paginacao"></div>
      </div>
    
    </div>
  </main>

</template>
