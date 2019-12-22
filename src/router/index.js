import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () =>
    import ('../components/login.vue')
const Home = () =>
    import ("../components/home.vue")
const Welcome = () =>
    import ('../components/welcome.vue')
const User = () =>
    import ('../components/user/user.vue')
const Rights = () =>
    import ('../components/power/rights.vue')
const Roles = () =>
    import ('../components/power/roles.vue')
const Cate = () =>
    import ('../components/goods/cate.vue')
Vue.use(VueRouter)

const routes = [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }

    {
        path: '/',
        redirect: "/login"
    }, {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [{
            path: '/welcome',
            component: Welcome
        }, {
            //和index中的路径一致
            path: '/users',
            component: User
        }, {
            path: '/rights',
            component: Rights
        }, {
            path: '/roles',
            component: Roles
        }, {
            path: '/categories',
            component: Cate
        }]
    },


]

const router = new VueRouter({
    routes,
    mode: "history"
})

// 挂载导航守卫,及通过特定链接访问需要登陆才能看到的页面时,没有token,强制返回登陆页面
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪一个路径跳转而来
    if (to.path === '/login')
        return next()
    const getToken = window.sessionStorage.getItem("token");
    if (!getToken)
        return next("/login");
    else next()

})
export default router