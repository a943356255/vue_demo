<template>
  <div>
    <el-button class="button-class" type="primary" @click="addNewController">添加</el-button>
    <MyTable
        :columns="this.columns"
        :table="this.table"
        :conditions="this.conditions"
        :columnsName="this.columnsName"
        v-slot="value">
      <el-button size="small" @click.native="change(value.index)" type="primary"
      >编辑
      </el-button
      >
      <el-button size="small" type="danger" @click.native="del(value.index)"
      >删除
      </el-button
      >
      <el-button size="small" @click.native="add()">添加</el-button>
    </MyTable>
  </div>
</template>

<script>

import {reqGetRole} from "@/api";

export default {
  name: "ControllerManagement",
  data() {
    return {
      columns: {
        id: "id",
        role: "role",
        url_name: "url_name",
      },
      conditions: {
        // id: "1",
      },
      columnsName: {
        id: "主键",
        role: "角色",
        url_name: "具体接口",
      },
      table: "url_menu",
      roles: []
    };
  },
  methods: {
    change(index) {
      this.$bus.$emit("edit", index);
    },
    del(index) {
      this.$bus.$emit("del", index);
    },
    add() {
      this.$bus.$emit("add");
    },
    addNewController() {

    }
  }

}
</script>

<style scoped>
.button-class {
  margin-right: 50px;
  float: right
}
</style>