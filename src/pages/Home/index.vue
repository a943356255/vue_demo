<template>
  <el-container style="height: 100%">
    <!-- 头部 -->
    <el-header class="header-style">

      <div class="header-background">
        <img src="../../assets/logo.png" alt=""/>
        <span class="span-font">后台管理系统</span>
      </div>

      <div class="box">
        <div class="bread">
          <el-breadcrumb separator="/" class="bread-children">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="value in breadcrumb">
              {{ value }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
`
         <!-- 这里是点击面包屑下边的东西进行跳转 -->
        <div class="column-table">
          <el-tag size="small"
                  :key="tag"
                  v-for="(tag, index) in dynamicTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, index)"
                  @click="breadChange(index, null)"
                  :color="getColor(index)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </el-header>

    <el-container class="size">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside-class">
        <!--  :default-active="$route.path"解决路由高亮问题 -->
        <el-menu class="el-menu-vertical-demo"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 :default-active="$route.path"
        >
          <el-submenu
              v-for="(value, index) in demo.pathList"
              :key="value.path"
              :item="value.authName"
              :index="value.path"
          >
            <template slot="title" class="use">
              <i class="el-icon-present"></i>
              <span>{{ value.authName }}</span>
            </template>

            <!-- 侧边栏点击跳转 -->
            <el-menu-item
                class="menu-color"
                v-for="route in value.children"
                :key="route.path"
                :index="route.path"
                @click="change(route.path, route.authName, value.authName)"
            ><span>{{ route.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主题内容 -->
      <el-main>
          <router-view :key="key" />
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
import {mapState} from "vuex";
import Vue from "vue"

export default {
  name: "Home",

  data() {
    return {
      // 点击按钮
      dynamicTags: [],
      // 面包屑
      breadcrumb: [],
      // 记录路由地址
      routePath: [],

      inputVisible: false,
      inputValue: '',
      pathMap: {},
      activeMenu: "",
      index: 1
    };
  },

  computed: {
    key() {
      return this.$route.name !== undefined
          ? this.$route.name + +new Date()
          : this.$route + +new Date()
    },
    ...mapState(["permission", "demo"]),
  },

  methods: {
    change(path, name, fatherName) {
      this.breadcrumb = [];
      if (this.dynamicTags.indexOf(name) === -1) {
        // 添加标签
        this.dynamicTags.push(name)
      }
      // 将路由路径添加到数组
      if (this.routePath.indexOf(path) === -1) {
        this.routePath.push(path)
      }
      // 添加面包屑
      this.breadcrumb.push(fatherName, name)
      this.$router.push(path)

      for (let i = 0; i < this.dynamicTags.length; i++) {
        if (this.dynamicTags[i] === name) {
          this.index = i
        }
      }
    },

    getColor(index) {
      return this.index === index ? "white" : null;
    },

    // 关闭按钮
    handleClose(tag, index) {
      // index是要删除的路由
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.routePath.splice(index, 1)

      if (this.index !== index) {
        if (this.index > index) {
          this.index--
        }
        return
      }

      if (this.routePath.length !== 0) {
        this.$router.push(this.routePath[0])
      }
      // 修改面包屑
      this.breadChange(0, "notNull")
      this.index = 0
    },

    breadChange(index, from) {
      if (this.pathMap[this.dynamicTags[index]] === undefined) {
        let arr = []
        this.dfs(this.demo.pathList, arr)
      }

      this.breadcrumb = this.pathMap[this.dynamicTags[index]]?.split(",")
      if (from === null) {
        this.$router.push(this.routePath[index])
      }

      this.index = index
    },

    // 递归添加所有所有路径
    dfs(children, arr) {
      if (children !== null && children !== undefined) {
        for (let i = 0; i < children.length; i++) {
          // 添加路径名称
          arr.push(children[i].authName)
          if (children[i].children === null || children[i].children === undefined) {
            if (this.pathMap[children[i].authName] === undefined) {
              Vue.set(this.pathMap, children[i].authName, arr.toString())
            }
          }
          this.dfs(children[i].children, arr)
          arr.pop()
        }
      }
    },
  },

  watch: {
    demo: {
      deep: true,
      handler(newValue) {
        console.log("newValue = ", newValue)
        let arr = []
        this.dfs(newValue.pathList, arr)
      }
    }
  },
};
</script>

<style scoped>

.part-a {
  text-decoration: none;
  color: #303133;
}

/* 解决侧边栏突出问题 */
.el-menu {
  border-right: none;
}

.header-background {
  background-color: #545c64;
  width: 200px;
  height: 70px;
  margin-left: 0;
  display: flex;
}

.header-background img {
  width: 50px;
  height: 70px;
  margin-top: 5px;
}

.span-font {
  margin-left: 10px;
  margin-top: 20px;
}

.header-style {
  padding: 0;
  color: white;
  display: flex;
  flex-direction: row;
}

.box {
  display: flex;
  flex-direction: column;
  height: 70px;
  flex: 2;
}

.bread {
  margin-left: 20px;
  margin-top: 5px;
  flex: 1.3;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.bread-children {
  align-items: center;
}

.column-table {
  flex: 0.7;
  margin-left: 20px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.size {
  height: 100%;
}
.el-tag {
  cursor: pointer;
}
.aside-class {
  background-color: #545c64;
}
</style>