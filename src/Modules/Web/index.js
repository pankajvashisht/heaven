import Notfound from "../Notfound.vue";
export default [
  {
    path: "/",
    name: "login",
    component: () => import(/* webpackChunkName: login" */ "./Login"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import(/* webpackChunkName: dashboard" */ "./Profile"),
  },
  {
    path: "*",
    component: Notfound,
  },
];
