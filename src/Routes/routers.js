import VueRouter from "vue-router";
import adminRoutes from "../Modules/adminRoutes";
import Web from "../Modules/Web";

const router = new VueRouter({
  mode: "history",
  routes: [...Web, ...adminRoutes],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log("fuck", to);
    if (
      localStorage.getItem("users") == null &&
      to.matched.some((record) => record.meta.authAdmin)
    ) {
      next({
        path: "/admin/login",
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
  } else if (
    to.matched.some((record) => record.meta.web) &&
    to.matched.some((record) => record.meta.requiresAuth)
  ) {
    if (localStorage.getItem("usersInfo") === null) {
      return next({
        path: "/",
        params: { nextUrl: to.fullPath },
      });
    }
    return next({ name: "profile" });
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
