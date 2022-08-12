<template>
  <div>
    <MyDialog
        :buttonName="buttonName"
        :title="title"
        :value="value"
        :apiRequest="apiRequest"
    >
    </MyDialog>

    <el-upload
        class="upload-demo"
        action=""
        :on-change="handleChange"
        :on-remove="handleRemove"
        :limit="limitValue"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        :auto-upload="false"
    >
      <el-tooltip content="只能上传xls/xlsx 文件" placement="top-start">
        <el-button style="margin-right: 20px" type="primary">点击上传</el-button>
      </el-tooltip>
    </el-upload>

    <el-table
        v-if="excelData && excelData.length"
        :data="excelData"
    >
      <el-table-column
          v-for="(item, key, index) of colData[0]"
          :key="key"
          :label="key"
      >
        <template v-slot="scope">
          <span>{{ scope.row[key] }}</span>
        </template>
      </el-table-column>
    </el-table>

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
      buttonName: "按钮名称",
      excelButtonName: "导入excel",
      excelData: [], //存放数据的数组
      fileTemp: "", //导入函数需要的File内容
      colData: [], //维护table列
      limitValue: 1
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
    },

    handleChange(file) {
      //file.raw就是我们的导入函数需要的参数
      this.fileTemp = file.raw;
      if (this.fileTemp) {
        if (
            this.fileTemp.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            this.fileTemp.type === "application/vnd.ms-excel"
        ) {
          this.importFxx(this.fileTemp);
        } else {
          this.$message({
            type: "warning",
            message: "附件格式错误，请重新上传！",
          });
          this.handleRemove();
        }
      } else {
        this.$message({
          type: "warning",
          message: "请上传附件！",
        });
      }
    },

    handleRemove() {
      this.fileTemp = null;
    },

    importFxx(obj) {
      // 通过DOM取文件数据
      let rABS = false; //是否将文件读取为二进制字符串
      let f = obj;
      let reader = new FileReader();
      const self = this;
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function (f) {
        let binary = "";
        // var pt = this;
        let wb; //读取完成的数据
        let outdata;
        let reader = new FileReader();
        reader.onload = function (e) {
          let bytes = new Uint8Array(reader.result);
          let length = bytes.byteLength;
          for ( let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }

          let XLSX = require("xlsx");
          wb = XLSX.read(binary, {
            type: "binary",
          });
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是需要的那个数组
          //   console.table(outdata);
          self.excelData = [...outdata];
          self.colData = outdata
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
  }
};
</script>

<style>
</style>