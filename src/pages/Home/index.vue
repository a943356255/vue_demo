<template>
  <el-container style="height: 100%">
    <!-- 头部 -->
    <el-header>
      <!-- <img src="../assets/logo.png" style="width: 50px; height: 50px" /> -->
      <span>后台管理系统</span>
    </el-header>

    <el-container class="size">
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- :default-active="$route.path" 解决路由高亮问题 -->
        <el-menu :default-active="activeMenu" class="el-menu-vertical-demo">
          <el-submenu
            v-for="(value, index) in demo.pathList"
            :key="value.path"
            :item="value.authName"
            :index="value.path + index"
          >
            <template slot="title">
              <i class="el-icon-present"></i>
              <span>{{ value.authName }}</span>
            </template>

            <el-menu-item
              v-for="route in value.children"
              :key="route.path + index"
              :index="route.path + index"
              @click="change(route.path)"
              >{{ route.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主题内容 -->
      <el-main>
        <router-view :key="key"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Home",
  computed: {
    key() {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    },
    ...mapState(["permission", "demo"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
  },
  methods: {
    change(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style>
.part-a {
  text-decoration: none;
  color: #303133;
}
.size {
  height: 100%;
}
</style>