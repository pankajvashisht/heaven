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
      import(/* webpackChunkName: dashboard" */ "./commonAdmin.vue"),
    meta: {
      authAdmin: true,
      requiresAuth: true,
    },
    children: [
      {
        path: "dashboard",
        component: () => import("./dashboard"),
        name: "home",
        meta: {
          authAdmin: true,
          requiresAuth: true,
        },
      },
      {
        path: "users",
        component: () => import("./Users/users"),
        name: "users",
        meta: {
          authAdmin: true,
          requiresAuth: true,
        },
      },
      {
        path: "add-users",
        component: () => import("./Users/add-user"),
        name: "add-user",
        meta: {
          authAdmin: true,
          requiresAuth: true,
        },
      },
      {
        path: "edit-users",
        component: () => import("./Users/edit-user"),
        name: "edit-user",
        props: true,
        meta: {
          authAdmin: true,
          requiresAuth: true,
        },
      },
      {
        path: "seeds",
        component: () => import("./Seeds"),
        name: "seeds",
        props: true,
        meta: {
          authAdmin: true,
          requiresAuth: true,
        },
      },
      {
        path: "alms",
        component: () => import("./Alms"),
        name: "alms",
        props: true,
        meta: {
          authAdmin: true,
          requiresAuth: true,
        },
      },
      {
        path: "tithe",
        component: () => import("./Tithe"),
        name: "tithe",
        props: true,
        meta: {
          authAdmin: true,
          requiresAuth: true,
        },
      },
      {
        path: "information",
        component: () => import("./Information"),
        name: "information",
        meta: {
          authAdmin: true,
          requiresAuth: true,
        },
      },
      {
        path: "transaction",
        component: () => import("./Transactions"),
        name: "transaction",
        meta: {
          authAdmin: true,
          requiresAuth: true,
        },
      },
    ],
  },
];
