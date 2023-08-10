import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Vue Router
import router from './routes';

// VueX
import store from './store';

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
