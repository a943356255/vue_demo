<template>
  <div>
    <el-input type="text" v-model="phone" placeholder="请输入账号" />
    <el-input type="password" v-model="password" placeholder="请输入密码" />
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
    };
  },
  methods: {
    async login() {
      let data = { phone: this.phone, password: this.password };
      await this.$store.dispatch("getToken", data);
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>