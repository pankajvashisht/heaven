import Notfound from "../Notfound.vue";
export default [
  {
    path: "/",
    name: "login",
    component: () => import(/* webpackChunkName: login" */ "./Login"),
    meta: {
      web: true,
      requiresAuth: false,
    },
  },
  {
    path: "/user/profile",
    name: "profile",
    component: () => import(/* webpackChunkName: dashboard" */ "./Profile"),
    meta: {
      web: true,
      requiresAuth: true,
    },
  },
  {
    path: "*",
    component: Notfound,
  },
];
