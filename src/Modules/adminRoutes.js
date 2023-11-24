import Notfound from "./Notfound.vue";
export default [
  {
    path: "*",
    component: Notfound,
  },
  {
    path: "/admin/login",
    name: "login",
    component: () => import(/* webpackChunkName: login" */ "./login.vue"),
    meta: { layout: "login" },
  },
  {
    path: "/admin",
    name: "admin",
    component: () =>
      import(/* webpackChunkName: dashboard" */ "./dashboard.vue"),
    meta: {
      adminAuth: true,
      layout: "dashboard",
    },
    children: [
      {
        path: "dashboard",
        component: () => import("./dashboard"),
        name: "home",
      },
      {
        path: "users",
        component: () => import("./Users/users"),
        name: "users",
      },
      {
        path: "add-users",
        component: () => import("./Users/add-user"),
        name: "add-user",
      },
      {
        path: "edit-users",
        component: () => import("./Users/edit-user"),
        name: "edit-user",
        props: true,
      },
      {
        path: "seeds",
        component: () => import("./Seeds"),
        name: "seeds",
        props: true,
      },
      {
        path: "alms",
        component: () => import("./Alms"),
        name: "alms",
        props: true,
      },
      {
        path: "tithe",
        component: () => import("./Tithe"),
        name: "tithe",
        props: true,
      },
      {
        path: "information",
        component: () => import("./Information"),
        name: "information",
      },
      {
        path: "transaction",
        component: () => import("./Transactions"),
        name: "transaction",
      },
    ],
  },
];
