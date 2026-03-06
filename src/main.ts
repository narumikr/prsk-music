import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { apiClient } from './api/base'
import router from './router'

const API_KEY = import.meta.env.VITE_API_KEY
if (API_KEY) {
  apiClient.setApiKey(API_KEY)
}

createApp(App).use(router).mount('#app')
