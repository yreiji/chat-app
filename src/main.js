import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router' // 1. ルーターの設定をインポート

loadFonts()

createApp(App)
  .use(vuetify)
  .use(router) // 3. アプリケーションにルーターを適用
  .mount('#app')
