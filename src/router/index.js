import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Menu from '../components/Power/Menu.vue'
import Role from '../components/Power/Role.vue'
import Cate from '../components/Cate/Cate.vue'
import Attr from '../components/Attr/Attr.vue'
import Goods from '../components/Goods/Goods.vue'
import Add from '../components/AddGoods/Add.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/user_list',
        component: User
      },
      {
        path: '/menu_list',
        component: Menu
      },
      {
        path: '/role_list',
        component: Role
      },
      {
        path: '/cate_list',
        component: Cate
      },
      {
        path: '/attr_list',
        component: Attr
      },
      {
        path: '/goods_list',
        component: Goods
      },
      {
        path: '/add_good',
        component: Add
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
// 验证token，页面跳转 时需要携带用户信息，每一个路由跳转都会执行这一个函数，其中beforeEach其内部三个参数，=> 代表的是函数执行语句
router.beforeEach((to, from, next) => {
  // 如果要前往的路径是登录界面，则直接跳转登录
  if (to.path === '/login') return next()
  // 从请求头获取token数据
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果token不存在，则进行登录页面跳转
  if (!tokenStr) return next('/login')
  next()
})
