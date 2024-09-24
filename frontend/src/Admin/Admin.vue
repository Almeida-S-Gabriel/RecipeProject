
<template>
   <div class="container text-center my-5">
     <h1>Escolha o que deseja editar</h1>
     
     <!-- Botões para redirecionar para cada página de edição -->
     <div class="btn-group my-3">
       <button class="btn btn-primary" @click="goToEditUser">Editar Usuário</button>
       <button class="btn btn-secondary" @click="goToEditRecipe">Editar Receita</button>
     </div>
   </div>
 </template>
 
 <script setup lang="ts">
 import { useRouter } from 'vue-router'
 
 const router = useRouter()
 
 // Função para redirecionar para a página de edição de usuário
 const goToEditUser = () => {
   router.push('/adminUsers') 
 }
 
 // Função para redirecionar para a página de edição de receita
 const goToEditRecipe = () => {
   router.push('/adminReceitas') 
 }
 </script>
 
 <style scoped>
 .container {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
 }
 
 .btn-group button {
   margin: 0 10px; /* Espaço entre os botões */
 }
 </style>
 