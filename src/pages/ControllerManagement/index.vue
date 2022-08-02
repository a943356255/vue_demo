<template>
  <div>
    <MyTable
        :columns="this.columns"
        :table="this.table"
        :conditions="this.conditions"
        :columnsName="this.columnsName"
        v-slot="value">
      <el-button size="small" @click.native="change(value.index)"
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
  }

}
</script>

<style scoped>

</style>