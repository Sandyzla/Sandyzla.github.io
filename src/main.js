import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from "vue-router";
import App from './App.vue'
import Home from './components/TheHome.vue';
import MoveGame2048 from './components/2048/MoveGame.vue'
import MoveGameThree from './components/Three/MoveGame.vue'
import Demo from './components/demo/TheDemo.vue'
// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  { path: '/', component: Home },
  { path: '/2048', component: MoveGame2048 },
  { path: '/Three', component: MoveGameThree },
  { path: '/demo', component: Demo },
];

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router

// 5. 创建并挂载根实例
const app = createApp(App)
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router)
app.config.unwrapInjectedRef = true
app.mount('#app')

// 现在，应用已经启动了！
