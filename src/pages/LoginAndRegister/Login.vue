<template>
  <div>
    <el-input type="text" v-model="phone" placeholder="请输入账号" />
    <el-input type="password" v-model="password" placeholder="请输入密码" />
    <el-checkbox v-model="rememberMe">记住我</el-checkbox>
    <el-button @click="login">登录</el-button>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      phone: "",
      password: "",
      rememberMe: ""
    };
  },
  methods: {
    async login() {
      let data = { phone: this.phone, password: this.password, rememberMe:  this.rememberMe};
      await this.$store.dispatch("getToken", data);
      await this.$router.push("/home");
    },
  },
};
</script>

<style>
</style>