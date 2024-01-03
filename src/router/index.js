import { createWebHashHistory, createRouter } from 'vue-router'
import HelloWorld from '/src/components/HelloWorld.vue'
import Chat from '/src/components/Chat.vue'
import UserList from '/src/components/UserList.vue'
import RoomList from '/src/components/RoomList.vue'
import Login from '/src/view/Login.vue'
import SignUp from '/src/view/SignUp.vue'


// ルーティング設定
const routes = [
  {
    path: '/',
    component: HelloWorld,
  },
  {
    path: '/chat',
    component: Chat,
    meta: { requiresAuth: true },
  },
  {
    path: '/user-list',
    component: UserList,
    meta: { requiresAuth: true },
  },
  {
    path: '/room-list',
    component: RoomList,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/sign-up',
    component: SignUp,
  },
]

//Routerインスタンスを作成
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// ページを開くごとに実行
router.beforeEach((to, from, next) => {
    // このルートはログインされているユーザかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    const requiresAuth = to.matched.some(route => route.meta.requiresAuth)
    if (requiresAuth) {
        const user = sessionStorage.getItem('user')
        if (!user) {
            localStorage.message = 'You require to log in'
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }

        // firebase.auth()
        // .onAuthStateChanged((user) => {
        //     if (!user) {
        //         localStorage.message = 'You require to log in'
        //         next({
        //             path: '/login',
        //             query: { redirect: to.fullPath }
        //         })
        //     } else {
        //         next()
        //     }
        // })
    } else {
        next() // next() を常に呼び出すようにしてください!
    }
})

export default router
