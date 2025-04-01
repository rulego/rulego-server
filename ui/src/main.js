import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from '@src/app.vue';
import router from '@src/router';
import store from '@src/store';

import '@src/style/tailwind.css';
import 'element-plus/dist/index.css';
import '@logicflow/core/lib/style/index.css';
import '@logicflow/extension/lib/style/index.css';
import '@src/style/logic-flow.css';
import '@src/style/element-plus.css';

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(`ElIcon${key}`, component);
}

app.use(ElementPlus).use(store).use(router).mount('#app');
