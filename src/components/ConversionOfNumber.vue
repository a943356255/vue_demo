<template>
  <div>
    <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="55%"
    >
      <!-- 输入 -->
      <el-input placeholder="请输入要转化的数字" v-model="inputNumber"></el-input>
      <el-radio-group v-model="inputChose" @change="changeType">
        <el-radio v-for="(conValue, index) in inputConversion" :key="index" :label="conValue">
          {{ conValue }}
        </el-radio>
      </el-radio-group>

      <!-- 输出 -->
      <el-input placeholder="转化后的数字" v-model="value" readonly="readonly"></el-input>
      <el-radio-group v-model="valueChose" @change="changeType">
        <el-radio v-for="(conValue, index) in valueConversion" :key="index" :label="conValue">
          {{ conValue }}
        </el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "ConversionOfNumber",

  props: {
    inputConversion: {
      type: Array
    },
    valueConversion: {
      type: Array
    },
    changeMethods: {
      type: Array
    }
  },

  data() {
    return {
      dialogVisible: false,
      inputNumber: '',
      value: '',
      inputChose: '10进制',
      valueChose: '2进制',
      map: {
        "1": "2进制",
        "2": "4进制",
        "3": "8进制",
        "4": "16进制",
        "5": "10进制"
      },
      valueArr: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v'
      ]
    }
  },

  methods: {
    tenToOther(value, otherType) {
      let arr = ['a', 'b', 'c', 'd', 'e', 'f']
      let other = parseInt(otherType);
      let number = parseInt(value);
      let stack = []
      while (number !== 0) {
        if (other === 16 && number % other >= 10) {
          stack.unshift(arr[number % other % 10])
        } else {
          stack.unshift(number % other)
        }
        number = Math.floor(number / other);
      }
      let str = ''
      for (let i = 0; i < stack.length; i++) {
        str += stack[i];
      }
      return str
    },
    otherToTen(value, otherType) {
      let arrMap = {
        "a": 10,
        "b": 11,
        "c": 12,
        "d": 13,
        "e": 14,
        "f": 15
      }
      let length = value.length;
      let result = 0
      let partValue
      if (otherType === 16 || otherType === '16') {
        for (let i = 0; i < length; i++) {
          console.log(arrMap[value[i]])
          if (arrMap[value[i]] === undefined) {
            result += parseInt(value[i]) * Math.pow(16, length - i - 1);
          } else {
            result += arrMap[value[i]] * Math.pow(16, length - i - 1)
          }
        }
        return result
      }
      if (value !== '') {
        partValue = parseInt(value)
      }
      while (partValue > 0) {
        let a = Math.floor(partValue / Math.pow(10, length - 1))
        result = result + a * Math.pow(otherType, length - 1)
        partValue = partValue % Math.pow(10, length - 1);
        length--;
      }
      return result
    },
    changeType() {
      this.inputNumber = ''
    },
    // 获取对应下标
    getIndex(type) {
      let part
      if (type === "input") {
        part = this.inputChose
      } else {
        part = this.valueChose
      }
      for (let i in this.map) {
        if (this.map[i] === part) {
          return i - 1
        }
      }
      return null
    },
    getPoint(value) {
      for (let i = 0; i < value.length; i++) {
        if (value[i] === '.') {
          return true;
        }
      }
      return false
    },

    // 十进制小数后部分转化为其他
    tenToOtherAfter(value, otherType) {
      let arr = ['a', 'b', 'c', 'd', 'e', 'f']
      let other = parseInt(otherType);
      let stack = []
      let number = parseFloat(value);
      while (number % 1 !== 0) {
        if (Math.floor(number * other) >= 10) {
          stack.push(arr[Math.floor(number * other) % 10])
        } else {
          stack.push(Math.floor(number * other))
        }
        //Math.abs(number * other - other + 1)
        number = number * other % 1
      }
      let str = ''
      for (let i = 0; i < stack.length; i++) {
        str += stack[i];
      }
      return str
    },
    // 其他小数部分转十进制
    otherToTenAfter(value, otherType) {
      let arrMap = {
        "a": 10,
        "b": 11,
        "c": 12,
        "d": 13,
        "e": 14,
        "f": 15
      }
      let length = value.length;
      let result = 0
      for (let i = 0; i < length; i++) {
        if (arrMap[value[i]] === undefined) {
          result += parseInt(value[i]) * Math.pow(otherType, -(i + 1));
        } else {
          result += arrMap[value[i]] * Math.pow(otherType, -(i + 1))
        }
      }
      return result
    },
  },

  watch: {
    inputNumber(newValue) {
      let type = ["2", "4", "8", "16", "10"]
      let splitResult = []

      // 判断输入是否是10进制, 如果不是就转化为10进制再转为其他
      if (this.inputChose !== "10进制") {
        let index = this.getIndex("input");
        if (this.getPoint(newValue)) {
          splitResult = newValue.split(".")
          // 此时不是十进制，需要先转化为10进制
          let position = this.otherToTenAfter(splitResult[1], type[index])
          let first = this.otherToTen(splitResult[0], type[index])
          // 转化为10进制的结果
          let valueIndex = this.getIndex("value")
          let trueResultBefore = this.tenToOther(first, type[valueIndex])
          let trueResultAfter = this.tenToOtherAfter(position, type[valueIndex])

          this.value = trueResultBefore + "." + trueResultAfter
        } else {
          // 获取其他进制转化为10进制结果
          let value = this.otherToTen(newValue, parseInt(type[index]));
          // 获取要转化的进制
          let valueIndex = this.getIndex("value");
          // 进行转化
          if (newValue !== '') {
            this.value = this.tenToOther(value, type[valueIndex]);
          } else {
            this.value = undefined
          }
        }
      } else { // 是十进制，直接转化
        if (newValue !== '') {
          let index = this.getIndex("value");
          if (this.getPoint(newValue)) {
            splitResult = newValue.split(".")
            let position = this.tenToOtherAfter("0." + splitResult[1], type[index])
            let integer = this.tenToOther(splitResult[0], type[index])
            this.value = integer + "." + position
          } else {
            this.value = this.tenToOther(newValue, type[index])
          }
        } else {
          this.value = undefined
        }
      }
    }
  },

  mounted() {
  }
}
</script>

<style scoped>
</style>