import Notfound from "../Notfound.vue";
export default [
  {
    path: "/",
    name: "login",
    component: () => import(/* webpackChunkName: login" */ "./Profile"),
    meta: {
      web: true,
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import(/* webpackChunkName: dashboard" */ "./Profile"),
    meta: {
      web: true,
    },
  },
  {
    path: "*",
    component: Notfound,
  },
];
