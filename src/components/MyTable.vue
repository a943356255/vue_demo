<template>
  <div>
    <div class="top-class">
      <el-input placeholder="请输入要搜索的内容" style="width: 300px" v-model="searchQuery"/>
      <el-select v-model="selectValue" placeholder="选择搜索条件，默认匹配所有项" class="dropdown-class">
        <el-option
            key="all"
            label="匹配所有"
            value=""
        >
        </el-option>
        <el-option
            v-for="(item, key) in this.columnsName"
            :key="item"
            :label="item"
            :value="key"
        >
        </el-option>
      </el-select>

      <el-button @click="searchValue" style="margin-left: 10px" type="primary" icon="el-icon-search">搜索</el-button>

      <!-- 导出excel -->
      <el-button type="warning" @click="dialogFormVisible1 = true">导出为excel</el-button>
      <el-dialog title="导出格式" :visible.sync="dialogFormVisible1">
        <el-form :columnsName="this.columnsName">
          <el-form-item
              label="文件名称："
              :label-width="formLabelWidth"
          >
            <el-input v-model="excelName" autocomplete="off" placeholder="请输入导出excel的名称"/>
          </el-form-item>
          <el-form-item label="起始页："  :label-width="formLabelWidth">
            <el-select v-model="beginPage" placeholder="请选择要导出数据的起始页">
              <el-option
                  v-for="val in Math.ceil(this.dataSize / this.pageSize)"
                  :label="val"
                  :value="val">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="尾页：" :label-width="formLabelWidth">
            <el-select v-model="endPage" :placeholder="showMessage" >
              <el-option
                  v-for="val in Math.ceil(this.dataSize / this.pageSize)"
                  v-show="val >= beginPage && beginPage !== ''"
                  :label="val"
                  :value="val">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth">
            <span>注：如果不进行选择或者选择不完整，则只打印当前页</span>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="getExcel">确 定</el-button>
        </div>
      </el-dialog>
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
        <template slot="header"> {{ columnsName[key] }}</template>
        <template v-slot="scope">
          {{ scope.row[key] }}
        </template>

      </el-table-column>

      <el-table-column label="操作">
        <template v-slot="scope">
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

const {export_json_to_excel} = require("../excel/expor2Excel");

export default {
  name: "MyTable",

  props: ["table", "columns", "columnsName", "conditions"],

  data() {
    return {
      tableList: [],
      dialogFormVisible: false,
      dialogFormVisible1: false,
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
      searchQuery: "",
      selectValue: "",
      // 导出excel相关的
      fileListUpload: [],
      limit: 1,
      excelName: "",
      beginPage: "",
      endPage: "",
      showMessage: "请先选择起始页"
    };
  },

  methods: {
    getParameter(operate) {
      let map = {
        operate: operate,
        table: this.table,
        column: this.columns,
        condition: this.conditions,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        selectValue: this.selectValue
      }

      // 封装搜索信息
      if (this.searchQuery !== "" && this.searchQuery !== undefined) {
        let like = {}
        if (this.selectValue !== "" && this.selectValue !== undefined) {
          Vue.set(like, this.selectValue, this.searchQuery)
        } else {
          for (let i in this.columns) {
            if (i !== 'id') {
              Vue.set(like, i, this.searchQuery)
            }
          }
        }
        map["like"] = like
      }
      return map
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
          like: data.like,
          searchValue: data.searchValue,
          excelPageSize: data.excelPageSize
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

            this.apiRequest(map).then(() => {
              Message({
                type: "success",
                message: "删除成功!",
              });

              let num = this.dataSize % this.pageSize
              if (this.pageNo === (Math.floor(this.dataSize / this.pageSize) + 1) && num === 1) {
                this.pageNo -= 1
              }
              this.fresh()
            })
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
      map.condition = {id: this.dialogList.id};

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
      this.setData(result)
    },

    async changeSize() {
      let map = this.getParameter("select");
      let result = await this.apiRequest(map);
      this.setData(result)
    },

    async handleCurrentChange(currentPage) {
      this.pageNo = currentPage;
      let map = this.getParameter("select");
      let result = await this.apiRequest(map);
      this.setData(result)
    },

    add() {
      this.title = "添加信息";
      this.dialogList = {};
      this.dialogFormVisible = true;
    },

    async searchValue() {
      let map = this.getParameter("select")
      let result = await this.apiRequest(map)
      this.setData(result)
    },

    // 刷新数据
    async fresh() {
      let map = this.getParameter("select")
      let result = await this.apiRequest(map)
      this.setData(result)
    },

    setData(result) {
      this.tableList = result.data.valueList;
      this.dataSize = result.data.size
    },

    // 导出excel
    async getExcel() {
      let arrData = this.columnsName
      let keys = [], values = []

      for (let i in arrData) {
        keys.push(i)
        values.unshift(arrData[i])
      }

      let partList = []

      if (this.beginPage !== "" && this.endPage !== "") {
        let paramsData = this.getParameter("select")

        paramsData.pageNo = this.beginPage
        paramsData.excelPageSize = (this.endPage - this.beginPage + 1) * this.pageSize

        let result = await this.apiRequest(paramsData)
        partList = result.data.valueList
      } else {
        partList = this.tableList
      }

      console.log(partList)

      let data = []
      for (let i = 0; i < partList.length; i++) {
        let part = []
        for (let j in partList[i]) {
          part.push(partList[i][j])
        }
        data.push(part)
      }

      if (this.excelName === "") {
        this.excelName = "默认名称"
      }
      export_json_to_excel(values, data, this.excelName);

      this.dialogFormVisible1 = false
    },
  },

  watch: {
    table: {
      immediate: true,
      deep: true,
      async handler() {
        let map = this.getParameter("select");
        let result = await this.apiRequest(map);
        this.tableList = result.data.valueList;
        this.dataSize = result.data.size;
      },
    },

    searchQuery: {
      handler(newValue) {
        if (newValue === "" || newValue === undefined) {
          this.fresh()
        }
      }
    },

    dialogFormVisible1: {
      handler() {
        this.beginPage = ""
        this.endPage = ""
        this.excelName = ""
      }
    },
  },

  mounted() {
    this.$bus.$on("edit", this.edit);
    this.$bus.$on("del", this.del);
    this.$bus.$on("add", this.add);
    this.$bus.$on("fresh", this.fresh)
    this.$bus.$on("excelData")
  },
};
</script>
<style scoped>

.top-class {
  margin-bottom: 10px;
}

/*.el-icon-arrow-down {*/
/*  font-size: 12px;*/
/*}*/

.footer-div {
  width: 300px;
  margin-left: 40px;
}

.dropdown-class {
  margin-left: 10px;
  margin-right: 10px;
  width: 250px;
}

.inner-div {
  float: left;
  height: 100%;
}

.width {
  width: 70px;
}
</style>