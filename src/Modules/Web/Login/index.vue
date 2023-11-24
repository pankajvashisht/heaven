<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="login">
    <div class="background">
      <div class="shape"></div>
      <div class="shape"></div>
    </div>

    <form @submit.prevent="handleSubmit">
      <h3>Login</h3>

      <label for="username">Email</label>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        name="Email"
        value="email"
        class="form-control"
        :class="{ 'is-invalid': submitted && !email }"
      />
      <div v-show="submitted && !email" class="invalid-feedback">
        Email is required
      </div>

      <label for="password">Password</label>
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        name="password"
        class="form-control"
        :class="{ 'is-invalid': submitted && !password }"
      />
      <div v-show="submitted && !password" class="invalid-feedback">
        Password is required
      </div>

      <button type="submit">
        Log In
      </button>
      <Spinner v-show="loading" />
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Spinner from "../../../components/Spinner";
import swal from "sweetalert";
export default {
  name: "Login",
  components: {
    Spinner,
  },
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      loading: false,
      returnUrl: "",
      error: "",
    };
  },

  methods: {
    handleSubmit: function(e) {
      e.preventDefault();
      this.submitted = true;
      const { email, password } = this;

      if (!(email && password)) {
        return;
      }
      this.loading = true;
      axios
        .post(`${window.location.origin}/apis/v1/user/login`, {
          email,
          password,
        })
        .then((responce) => {
          const { data } = responce;
          localStorage.setItem("usersInfo", JSON.stringify(data.data));
          this.returnUrl = this.$route.query.returnUrl || "/profile";
          this.$router.push(this.returnUrl);
          this.loading = false;
        })
        .catch((err) => {
          const { response } = err;
          if (response.data.error_message) {
            swal(response.data.error_message, {
              icon: "error",
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Numans");

*,
*:before,
*:after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.login {
  background-color: #080710;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
.background {
  width: 430px;
  height: 520px;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
}
.background .shape {
  height: 200px;
  width: 200px;
  position: absolute;
  border-radius: 50%;
}
.shape:first-child {
  background: linear-gradient(#1845ad, #23a2f6);
  left: -80px;
  top: -80px;
}
.shape:last-child {
  background: linear-gradient(to right, #ff512f, #f09819);
  right: -30px;
  bottom: -80px;
}
form {
  height: 520px;
  width: 400px;
  background-color: rgba(255, 255, 255, 0.13);
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  padding: 50px 35px;
}
form * {
  font-family: "Poppins", sans-serif;
  color: #ffffff;
  letter-spacing: 0.5px;
  outline: none;
  border: none;
}
form h3 {
  font-size: 32px;
  font-weight: 500;
  line-height: 42px;
  text-align: center;
}

label {
  display: flex;
  margin-top: 30px;
  font-size: 16px;
  font-weight: 500;
}
input {
  display: block;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  padding: 0 10px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 300;
}
::placeholder {
  color: #e5e5e5;
}
button {
  margin-top: 50px;
  width: 100%;
  background-color: #ffffff;
  color: #080710;
  padding: 15px 0;
  font-size: 18px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
}
.social {
  margin-top: 30px;
  display: flex;
}
.social div {
  background: red;
  width: 150px;
  border-radius: 3px;
  padding: 5px 10px 10px 5px;
  background-color: rgba(255, 255, 255, 0.27);
  color: #eaf0fb;
  text-align: center;
}
.social div:hover {
  background-color: rgba(255, 255, 255, 0.47);
}
.social .fb {
  margin-left: 25px;
}
.social i {
  margin-right: 4px;
}
.invalid-feedback {
  color: red;

  margin-top: 4px;
}
.is-invalid {
  border: 1px solid red !important;
}
</style>
