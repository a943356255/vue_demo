<template>
  <div>
    <el-button>用户管理</el-button>
    <MyDialog
        :buttonName="buttonName"
        :title="title"
        :value="value"
        :apiRequest="apiRequest"
    >
    </MyDialog>
  </div>
</template>

<script>

import requests from "@/api/requests";

export default {
  name: "UserManagement",

  data() {
    return {
      value: {
        "key1": "第一行",
        "key2": "第二行",
        "key3": "第三行",
      },
      title: "测试title",
      buttonName: "按钮名称"
    }
  },

  methods: {
    apiRequest(value) {
      return requests({
        url: "/api/user/getRoles",
        method: "POST",
        data: {
          result: value
        }
      })
    }
  }
};
</script>

<style>
</style>