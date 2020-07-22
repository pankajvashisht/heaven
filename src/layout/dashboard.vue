<template>
  <div>
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
      <!-- Brand -->
      <img class="img" height="40px" width="40px" alt="logo" :src="logo" />

      <a class="navbar-brand">Heaven</a>

      <!-- Links -->
      <ul class="navbar-nav float-right">
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" to="dashboard">Dashboard</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" to="users">Users</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" to="seeds">Seeds</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" to="tithe">Tiths</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" to="transaction">Transactions</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" active-class="active" to="information">App Information</router-link>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto">
        <img :src="logo" height="30px" width="30px" class="rounded img" />
        <div class="card bg-info">
          <li class="nav-item">
            <a class="nav-link">
              <b>{{ userInfo.name }}</b>
            </a>
          </li>
        </div>
        <li class="nav-item">
          <a class="nav-link" href="#" @click="logout">
            <i class="fa fa-sign-out" aria-hidden="true" /> Logout
          </a>
        </li>
      </ul>
    </nav>
    <div class="container dashboard">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data: function () {
    return {
      userInfo: [],
      logo: require("../assets/logo.png"),
    };
  },
  mounted: function () {
    this.userInfo = JSON.parse(this.authuser);
  },
  methods: {
    logout: function () {
      localStorage.clear();
      this.$router.push({ name: "login" });
    },
  },
};
</script>
<style>
.navbar-dark .navbar-brand {
  color: #fff !important;
  margin-left: 10px;
}
.img {
  margin-right: 10px;
  margin-top: 6px;
}
.dashboard {
  margin-top: 8%;
}
</style>