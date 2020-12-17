import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        name: "welcome",
        component: Welcome
      },
      {
        path: "/users",
        name: "Users",
        component: () => import("../components/user/Users.vue")
      },
      {
        path: "/rights",
        name: "Rights",
        component: () => import("../components/power/Rights.vue")
      },
      {
        path: "/roles",
        name: "Roles",
        component: () => import("../components/power/Roles.vue")
      }
    ]
  }

  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  // component: () =>
  //   import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  routes
});
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径， from从哪个路径跳转过来， next 是一个函数，表示放行
  // next() 放行   next('/路径')强制跳转的路径

  if (to.path === "/login") return next();
  // 获取 token
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;
