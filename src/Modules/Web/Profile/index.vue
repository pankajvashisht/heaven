<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <div class="login">
      <nav class="navbar navbar-light bg-light justify-content-between">
        <a class="navbar-brand">Heaven</a>
        <div class="d-flex">
          {{ name }}
          <div class="logout d-flex ml-2" @click="logoutAccount">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <h6>Logout</h6>
          </div>
        </div>
      </nav>
      <div class="container">
        <div class="card">
          <img
            src="https://avatars.githubusercontent.com/u/51825251?v=4"
            alt="John"
            style="width:100%"
            class="image"
          />
          <div class="user-info">
            <h1>{{ name }}</h1>
            <p class="title"></p>
            <p>Email: {{ email }}</p>
            <hr />
            <p>Phone: {{ phone }}</p>
            <hr />
            <p>Wallet Balance: {{ balance }}</p>
            <hr />
            <p>
              Status:
              <span class="badge badge-pill badge-success"> Active </span>
            </p>
          </div>
          <button class="btn btn-danger" @click="removeAccount">
            Remove Account
          </button>
        </div>
      </div>
    </div>

    <Spinner v-show="loading" />
  </div>
</template>

<script>
import axios from "axios";
import Alert from "sweetalert";
import Spinner from "../../../components/Spinner";
export default {
  name: "Login",
  components: {
    Spinner,
  },
  data() {
    return {
      loading: false,
      email: "",
      name: "",
      id: "",
      phone: "",
      balance: "",
      status: "",
      profile: "",
      authorizationToken: "",
    };
  },

  created() {
    const userInfo = localStorage.getItem("usersInfo");
    if (userInfo) {
      const {
        name,
        email,
        id,
        status,
        phone,
        total_amount,
        profile,
        authorization_key,
      } = JSON.parse(userInfo);
      this.name = name;
      this.email = email;
      this.id = id;
      this.status = status;
      this.phone = phone;
      this.balance = total_amount;
      this.profile = profile;
      this.authorizationToken = authorization_key;
    }
  },

  methods: {
    logoutAccount: function() {
      Alert({
        title: `Are you sure want logout?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          localStorage.clear();
          this.$router.push("/");
        }
      });
    },
    removeAccount: async function() {
      const willDelete = await Alert({
        title: `Are you sure want delete?`,
        text: `Are you sure want to delete your account?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (willDelete) {
        this.loading = true;
        axios
          .delete(`${window.location.origin}/apis/v1/remove-user-account`, {
            headers: {
              authorization_key: this.authorizationToken,
            },
          })
          .then(() => {
            Alert("Your Account have been removed", {
              icon: "success",
            });
            localStorage.clear();
            this.$router.push("/");
          })
          .catch((err) => {
            Alert("Something went wrong", {
              icon: "error",
            });
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
.login {
  background-color: #d8d8d8;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  margin: auto;
  text-align: center;
  width: 50%;
  overflow: hidden;
  overflow-y: auto;
}

.title {
  color: grey;
  font-size: 18px;
}

button {
  border: none;
  outline: 0;
  display: inline-block;
  padding: 8px;
  color: white;
  background-color: #000;
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 18px;
}

a {
  text-decoration: none;
  font-size: 22px;
  color: black;
}

button:hover,
a:hover {
  opacity: 0.7;
}
.user-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
}
hr {
  width: 1px;
}
.image {
  height: 350px;
  object-fit: fill;
}
.logout {
  cursor: pointer;
}
</style>
