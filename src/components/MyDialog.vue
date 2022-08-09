<template>
  <div>
    <el-button type="text" @click="dialogVisible = true">{{ this.buttonName }}</el-button>
    <el-dialog :visible.sync="dialogVisible" :title="this.title">
      <slot></slot>

      <el-form>
        <el-form-item v-for="(value, key, index) of this.value"
                      :label="value"
                      :label-width="formLabelWidth">
          <el-input v-model="bindValue[key]" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="mySubmit">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "MyDialog",

  props: ["value", "title", "buttonName", "apiRequest"],

  data() {
    return {
      dialogVisible: false,
      formLabelWidth: "120px",
      bindValue: {}
    }
  },

  methods: {
    async mySubmit() {
      this.dialogVisible = false;
      let result = await this.apiRequest(this.bindValue);
    }
  },
}

</script>

<style scoped>

</style>