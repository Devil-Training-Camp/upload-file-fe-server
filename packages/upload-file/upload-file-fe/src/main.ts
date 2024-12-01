import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import piniaInstance from './stores'

const app = createApp(App)

app.use(piniaInstance)
app.use(router)

app.mount('#app')
