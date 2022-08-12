<template>
  <div>
    <MyDialog button-name="上传文件">
      <uploader :options="options" class="uploader-example"
                @file-complete="fileComplete" @complete="complete">
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <p>选择你要上传的文件</p>
          <uploader-btn>select files</uploader-btn>
        </uploader-drop>
        <uploader-list></uploader-list>
      </uploader>
    </MyDialog>

    <MyDialog
        button-name="下载b站视频"
        :value="this.value"
        :title="title"
        :apiRequest="apiRequest"
    >
    </MyDialog>
  </div>
</template>

<script>
import axios from "axios";
import requests from "@/api/requests";

export default {
  name: "GoodsManagement",

  data() {
    return {
      options: {
        target: '/api/file/uploadFile',
        testChunks: false, //上传前判断块是否已经存在
        simultaneousUploads: 5, //并发数
        chunkSize: 8 * 1024 * 1024, //块大小
      },
      value: {
        "url": "视频链接",
        "filename": "要保存的视频名称",
      },
      title: "下载窗口",
    }
  },

  methods: {
    fileComplete() {
      console.log('file complete', arguments)
      const file = arguments[0].file
      let url = '/api/file/mergeFile?filename=' + file.name + '&guid=' + arguments[0].uniqueIdentifier

      axios.get(url).then(function (response) {
        console.log(response)
      }).catch(function (error) {
        console.log(error)
      })
    },

    complete() {
      console.log('complete', arguments)
    },

    apiRequest(value) {
      return requests({
        url: "/api/file/download",
        method: "POST",
        data: {
          url: value.url,
          filename: value.filename,
        }
      })
    }
  }
};
</script>

<style scoped>

.uploader-example {
  width: 880px;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .4);
}

.uploader-example .uploader-btn {
  margin-right: 4px;
}

.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>