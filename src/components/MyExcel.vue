<template>
  <div>
    <el-button type="warning" @click="dialogFormVisible = true">导出为excel</el-button>

    <el-dialog title="导出格式" :visible.sync="dialogFormVisible">
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
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="getExcel">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
const {export_json_to_excel} = require("../excel/expor2Excel");

export default {
  name: "MyExcel",

  props: ["columnsName", "tableList", "pageSize", "dataSize", "getExcelData"],

  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "120px",
      excelName: "",
      beginPage: "",
      endPage: "",
      showMessage: "请先选择起始页"
    }
  },

  methods: {

    getExcel() {
      let arrData = this.columnsName
      let keys = [], values = []

      for (let i in arrData) {
        keys.push(i)
        values.unshift(arrData[i])
      }

      let data = []
      for (let i = 0; i < this.tableList.length; i++) {
        let part = []
        for (let j in this.tableList[i]) {
          part.push(this.tableList[i][j])
        }
        data.push(part)
      }

      let result = this.getExcelData()
      console.log(result)

      if (this.excelName === "") {
        this.excelName = "默认名称"
      }
      // export_json_to_excel(values, data, this.excelName);


      this.dialogFormVisible = false
      this.excelName = ""
    },

    getData(data) {
      console.log(data)
    },
  },

  watch: {
    dialogFormVisible: {
      handler() {
        this.beginPage = ""
        this.endPage = ""
        this.excelName = ""
      }
    },

    beginPage: {
      handler(newValue) {
        if (newValue !== '') {
          this.showMessage = "请选择尾页"
        }
      }
    }
  }
}

</script>

<style scoped>

</style>