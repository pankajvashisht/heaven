import VueRouter from "vue-router";
import login from "../Modules/login";
import adminRoutes from "../Modules/adminRoutes";
import Web from "../Modules/Web";
import Notfound from "../Modules/Notfound";

const router = new VueRouter({
  mode: "history",
  routes: [
    ...Web,
    ...adminRoutes,

    // {
    // 	path: '/',
    // 	redirect: '/login',
    // },
    // {
    // 	path: '/login',
    // 	component: login,
    // 	name: 'login',
    // 	meta: { layout: 'login' },
    // },
    // {
    // 	path: '/dashboard',
    // 	component: () => import('../Modules/dashboard'),
    // 	name: 'home',
    // 	meta: { layout: 'dashboard' },
    // },
    // {
    // 	path: '/users',
    // 	component: () => import('../Modules/Users/users'),
    // 	name: 'users',
    // 	meta: { layout: 'dashboard' },
    // },
    // {
    // 	path: '/add-users',
    // 	component: () => import('../Modules/Users/add-user'),
    // 	name: 'add-user',
    // 	meta: { layout: 'dashboard' },
    // },
    // {
    // 	path: '/edit-users',
    // 	component: () => import('../Modules/Users/edit-user'),
    // 	name: 'edit-user',
    // 	props: true,
    // 	meta: { layout: 'dashboard' },
    // },
    // {
    // 	path: '/seeds',
    // 	component: () => import('../Modules/Seeds'),
    // 	name: 'seeds',
    // 	props: true,
    // 	meta: { layout: 'dashboard' },
    // },
    // {
    // 	path: '/alms',
    // 	component: () => import('../Modules/Alms'),
    // 	name: 'alms',
    // 	props: true,
    // 	meta: { layout: 'dashboard' },
    // },
    // {
    // 	path: '/tithe',
    // 	component: () => import('../Modules/Tithe'),
    // 	name: 'tithe',
    // 	props: true,
    // 	meta: { layout: 'dashboard' },
    // },
    // {
    // 	path: '/information',
    // 	component: () => import('../Modules/Information'),
    // 	name: 'information',
    // 	meta: { layout: 'dashboard' },
    // },
    // {
    // 	path: '/transaction',
    // 	component: () => import('../Modules/Transactions'),
    // 	name: 'transaction',
    // 	meta: { layout: 'dashboard' },
    // },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem("users") == null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      });
    } else {
      const user = JSON.parse(localStorage.getItem("users"));
      if (to.matched.some((record) => record.meta.is_admin)) {
        if (user.is_admin == 1) {
          next();
        } else {
          next({ name: "dashboard" });
        }
      } else {
        next();
      }
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (localStorage.getItem("usersInfo") == null) {
      next();
    } else {
      next({ name: "profile" });
    }
  } else {
    next();
  }
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ["/login"];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem("users");

//   if (authRequired && !loggedIn) {
//     return next({
//       path: "/login",
//       query: { returnUrl: to.path },
//     });
//   } else if (to.path == "/login" && loggedIn) {
//     return next({
//       path: "/dashboard",
//     });
//   }
//   next();
// });

export default router;
