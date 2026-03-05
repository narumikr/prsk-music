import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { apiClient } from './api/base'
import router from './router'

// 開発環境用のAPIキーを設定
// 本番環境では環境変数から取得するべき
const API_KEY = import.meta.env.VITE_API_KEY || 'development-api-key'
apiClient.setApiKey(API_KEY)

createApp(App).use(router).mount('#app')
