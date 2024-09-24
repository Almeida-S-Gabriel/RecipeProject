import './assets/main.css'
// Import our custom CSS
import './assets/scss/styles.scss'

// Import all of Bootstrap's JS
//import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap';
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { createPinia } from 'pinia'

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app'); // Apenas uma vez
