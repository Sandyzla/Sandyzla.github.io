import { createRouter, createWebHistory } from 'vue-router'
import Home from '.././components/TheHome.vue'
import MoveGame2048 from '.././components/2048/MoveGame.vue'
import MoveGameThree from '.././components/Three/MoveGame.vue'
import MathGame from '.././components/24Point/MathGame.vue'
import Demo from '.././components/demo/TheDemo.vue'

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  { path: '/', component: Home },
  { path: '/2048', component: MoveGame2048 },
  { path: '/Three', component: MoveGameThree },
  { path: '/24point', component: MathGame },
  { path: '/demo', component: Demo },
]

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
