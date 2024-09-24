<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function buscarReceita() {
  router.push('/receitas/1')
}
</script>

<template>
  <div>
    <!-- Seção de Boas-Vindas -->
    <div class="hero-section text-center text-white d-flex align-items-center" style="background-image: url('https://source.unsplash.com/1600x900/?food'); height: 60vh;">
      <div class="container">
        <h1 class="display-3 fw-bold">Encontre Suas Receitas Favoritas!</h1>
        <p class="lead">Busque e descubra receitas deliciosas para qualquer ocasião.</p>
        <a class="btn btn-primary btn-lg mt-3 shadow" @click="buscarReceita">Buscar Receitas</a>
      </div>
    </div>

    <!-- Seção de Buscar Receitas -->
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-lg border-light">
            <img src="/src/images.jpeg" class="card-img-top" alt="Buscar Receitas">
            <div class="card-body text-center">
              <h5 class="card-title">Buscar Receitas</h5>
              <p class="card-text">Encontre receitas rápidas, saudáveis e deliciosas que combinam com o seu gosto.</p>
              <a @click="buscarReceita" class="btn btn-outline-primary shadow">Buscar Agora</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo personalizado */
.hero-section {
  background-size: cover;
  background-position: center;
  position: relative;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.hero-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
}

.hero-section .container {
  position: relative;
  z-index: 1;
}

.card {
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.2s;
}

.card:hover {
  transform: scale(1.05);
}

.card img {
  height: 300px;
  object-fit: cover;
}

.card-title {
  font-family: 'Georgia', serif;
  font-weight: bold;
}

.btn {
  transition: background-color 0.3s, color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
  color: white;
}
</style>