//main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import axios from 'axios'

const app = createApp(App)
app.use(router)
app.config.globalProperties.$axios = axios  // 如果需要全局使用 axios

app.mount('#app')
