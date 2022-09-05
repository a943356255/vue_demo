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
<!--      <el-button size="small" @click.native="add()">添加</el-button>-->
    </MyTable>

    <el-dialog title="添加接口权限" :visible.sync="dialogFormVisible">
      <el-form :model="form">

        <el-form-item label="输入具体接口" :label-width="formLabelWidth">
          <el-input v-model="form.controller" autocomplete="off"></el-input>
        </el-form-item>

        <div style="margin-left: 30px">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
          </el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedRoles" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(role, index) in roles" :label="role" :key="role">{{ role }}</el-checkbox>
          </el-checkbox-group>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitController">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {reqGetRole, reqInsertController} from "@/api";

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
        // and: {
        //   '=': {
        //     role: 'admin'
        //   },
        //   '!=': {
        //     id: '1'
        //   }
        // },
        // or: {
        //
        // }
      },
      columnsName: {
        id: "主键",
        role: "角色",
        url_name: "具体接口",
      },
      table: "url_menu",
      roles: [],
      dialogFormVisible: false,
      checkedRoles: [],
      formLabelWidth: '120px',
      checkAll: true,
      isIndeterminate: false,
      form: {
        controller: ""
      }
    };
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedRoles = val ? this.roles : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.roles.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roles.length;
    },
    change(index) {
      this.$bus.$emit("edit", index);
    },
    del(index) {
      this.$bus.$emit("del", index);
    },
    add() {
      this.$bus.$emit("add");
    },
    async addNewController() {
      let result = await reqGetRole()
      this.roles = result.data.data
      this.dialogFormVisible = true
      this.checkedRoles = this.roles
      this.form.controller = ""
    },
    async submitController() {
      this.dialogFormVisible = false
      let data = {
        checkedRoles: this.checkedRoles,
        controller: this.form.controller
      }
      // 发请求插入数据
      await reqInsertController(data)
      // 刷新table数据
      this.$bus.$emit("fresh")
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