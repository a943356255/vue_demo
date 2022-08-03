<template>
  <div>
    <div class="top-class">
      <el-input placeholder="请输入要搜索的内容" style="width: 300px" v-model="searchQuery"/>
      <el-button @click="searchValue" style="margin-left: 10px" type="primary" icon="el-icon-search">搜索</el-button>
    </div>

    <!-- table表单 -->
    <el-table
      :data="this.tableList"
      :columnsName="this.columnsName"
      border
      style="width: 100%"
    >
      <el-table-column
        v-for="(obj, key, index) of this.tableList[0]"
        :key="index"
      >
        <template slot="header"> {{ columnsName[key] }} </template>
        <template slot-scope="scope">
          {{ scope.row[key] }}
        </template>

      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- scope.$index可以取该元素在数组中的下标 -->
          <!-- <el-button type="danger" size="small" @click="del(scope.$index)"
            >删除</el-button -->
          <!-- v-bind:clickIndex="scope.$index" -->
          <slot v-bind:index="scope.$index"></slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="dialogList" :columnsName="this.columnsName">
        <el-form-item
          v-for="(obj, key, index) of this.tableList[0]"
          :key="index + key"
          :label="columnsName[key]"
          :label-width="formLabelWidth"
          v-show="key !== 'id'"
        >
          <el-input v-model="dialogList[key]" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 每页展示的数据量 -->
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <div class="footer-div">
            <div class="inner-div" style="margin-top: 50px">
              <span>每页展示数据量：</span>
            </div>
            <div class="inner-div" style="margin-top: 43px">
              <el-select
                v-model="pageSize"
                placeholder="1"
                class="width"
                @change="changeSize"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 分页器 -->
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="dataSize"
            style="margin-left: 500px; margin-top: 50px"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from "vue";
import requests from "../../src/api/requests";
import {Message, MessageBox} from "element-ui";

export default {
  name: "MyTable",

  props: ["table", "columns", "columnsName", "conditions"],

  data() {
    return {
      tableList: [],
      dialogFormVisible: false,
      dialogList: {},
      formLabelWidth: "120px",
      isShow: true,
      dataSize: 0,
      pageSize: 5,
      pageNo: 1,
      options: [
        {
          value: 1,
          label: "1",
        },
        {
          value: 2,
          label: "2",
        },
        {
          value: 3,
          label: "3",
        },
        {
          value: 4,
          label: "4",
        },
        {
          value: 5,
          label: "5",
        },
      ],
      title: "",
      searchQuery: ""
    };
  },

  methods: {
    getParameter(operate) {
      return {
        operate: operate,
        table: this.table,
        column: this.columns,
        condition: this.conditions,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      };
    },

    // 请求方法
    apiRequest(data) {
      return requests({
        url: "api/crudInterface/allCRUD",
        method: "POST",
        data: {
          operate: data.operate,
          table: data.table,
          pageSize: data.pageSize,
          pageNo: data.pageNo,
          column: data.column,
          condition: data.condition,
          like: data.like
        },
      });
    },

    edit(index) {
      this.title = "修改表格信息";
      this.dialogFormVisible = true;
      for (let i in this.tableList[index]) {
        Vue.set(this.dialogList, i, this.tableList[index][i]);
      }
    },

    del(index) {
      MessageBox.confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          // 在这里发起请求删除数据
          let map = this.getParameter("delete");
          map.condition = {
            id: this.tableList[index].id,
          };

          this.apiRequest(map).then((res) => {
            Message({
              type: "success",
              message: "删除成功!",
            });
            map.condition = null;
            map.operate = "select";
            this.apiRequest(map).then((res) => {
              this.tableList = res.data.valueList;
            });
          });
        })
        .catch(() => {
          Message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    async submit() {
      this.dialogFormVisible = false;
      let map = this.getParameter("update");
      map.column = this.dialogList;
      map.condition = { id: this.dialogList.id };

      if (this.dialogList.id == null) {
        map.operate = "add";
      }
      console.log(map.column);
      // 发请求更改数据;
      await this.apiRequest(map);

      map.condition = null;
      map.operate = "select";
      if (map.column.id == null) {
        Vue.set(map.column, "id", "id");
      }
      // 发请求获取更改后的数据;
      let result = await this.apiRequest(map);
      this.tableList = result.data.valueList;
    },

    async changeSize() {
      let map = this.getParameter("select");
      let result = await this.apiRequest(map);
      this.tableList = result.data.valueList;
    },

    async handleCurrentChange(currentPage) {
      this.pageNo = currentPage;
      let map = this.getParameter("select");
      let result = await this.apiRequest(map);
      this.tableList = result.data.valueList;
    },

    add() {
      this.title = "添加信息";
      this.dialogList = {};
      this.dialogFormVisible = true;
    },

    async searchValue() {
      let map = this.getParameter("select")
      let like = {}

      for (let i in this.columns) {
        console.log(i)
        if (i !== 'id') {
          Vue.set(like, i, this.searchQuery)
        }
      }

      map["like"] = like
      let result = await this.apiRequest(map)
      this.tableList = result.data.valueList;
      this.dataSize = result.data.size
    }
  },

  watch: {
    table: {
      immediate: true,
      deep: true,
      async handler(newVal, oldVal) {
        console.log("获得数据");
        let map = this.getParameter("select");
        let result = await this.apiRequest(map);
        this.tableList = result.data.valueList;
        this.dataSize = result.data.size;
      },
    },
  },

  mounted() {
    this.$bus.$on("edit", this.edit);
    this.$bus.$on("del", this.del);
    this.$bus.$on("add", this.add);
  },
};
</script>

<style scoped>
.top-class {
  margin-bottom: 10px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.footer-div {
  width: 300px;
  margin-left: 40px;
}
.inner-div {
  float: left;
  height: 100%;
}
.width {
  width: 70px;
}
</style>