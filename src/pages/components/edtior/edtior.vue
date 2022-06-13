<template>
  <div class="home">
    <div id="demo1"></div>
    <button type="button" class="btn" @click="getEditorData">获取当前内容</button>
  </div>
</template>

<script>
// 引入 wangEditor
import wangEditor from 'wangeditor'
import {uploadFile} from '@/services/culture'
import Cookie from "js-cookie";
export default {
  data() {
    return {
      editor: null,
      a:0
    }
  },
  props:{
    text:{}
  },
  watch:{
    'text': function (value,old) {
      console.log(value,old);
      if(value!=old){
        this.editor.txt.html(value);
      }
    },
    immediate: true,
    deep: true
  },
  mounted() {
    const editor = new wangEditor(`#demo1`);
    editor.config.showLinkImg = false
    // editor.config.uploadImgServer = '/api/file/upload' // 上传图片的接口地址
    editor.config.uploadVideoServer = '/api/file/upload'
    editor.config.uploadFileName = 'file' // formdata中的name属性
    editor.config.debug = true // 开启debug模式
    editor.config.uploadImgHeaders = {
      Authorization: Cookie.get('Authorization') // 设置请求头
    }
    editor.config.customUploadImg = async function (resultFiles, insertImgFn) {
      console.log(resultFiles);
      let form = new FormData()
      for (let i = 0; i < resultFiles.length; i++) {
        // form.append('file' + i, resultFiles[i])
        form.append('file', resultFiles[i])
      }
      // form.append('token', getToken())
      form.append('type', "news")

      let imgUrls = await download(form)
      console.log(imgUrls)
      for (let q = 0; q < imgUrls.length; q++) {
        // insertImgFn(imgUrls[q].url)
        insertImgFn(imgUrls[q]);
      }
      // content.imgsrc = getSrc(instance.txt.html())
      // // resultFiles 是 input 中选中的文件列表
      // // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      // // 上传图片，返回结果，将图片插入到编辑器中
      // insertImgFn('imgUrl')
    }

    editor.config.customUploadVideo = async function (resultFiles, insertVideoFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertVideoFn 是获取视频 url 后，插入到编辑器的方法
      console.log(resultFiles);
      let form = new FormData()
      for (let i = 0; i < resultFiles.length; i++) {
        // form.append('file' + i, resultFiles[i])
        form.append('file', resultFiles[i])
      }
      // form.append('token', getToken())
      form.append('type', "news")

      let imgUrls = await download(form)
      console.log(imgUrls)
      for (let q = 0; q < imgUrls.length; q++) {
        // insertImgFn(imgUrls[q].url)
        insertVideoFn(imgUrls[q]);
      }
    }
    async function  download (formdata) {
      let a;
      let b=[];
      await uploadFile(formdata).then(res=>{
        console.log(res);
        a=res.data.data;
        a=a.split(',');
        a.forEach(res=>{
          b.push(res)
        })
      }).catch((err)=>{
        console.log(err)
      })
      console.log(b)
      return b;
    }

    editor.config.uploadImgHooks = {
      // 图片上传并返回结果，但图片插入错误时触发
      fail: function (xhr, editor, result) {
        console.log(result)
      },
      success: function (xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
        console.log(result, 'success')
      }
    }
    // 配置 onchange 回调函数，将数据同步到 vue 中
    // editor.config.onchange = (newHtml) => {
      // this.text = newHtml;
      // this.$emit('editorChange',this.text);
    // }
    // 创建编辑器
    editor.create();
    // $('#div1').attr('style','height:auto;');
    setTimeout(()=>{
      editor.txt.html(this.text);
    },1000)
    this.editor = editor;
  },
  methods: {
    getEditorData() {
      // 通过代码获取编辑器内容
      let editorChange = this.editor.txt.html()
      this.$emit('editorChange',editorChange);
    }
  },
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  }
}
</script>

<style lang="less">
.home {
  width: 600px;
  margin: auto;
  position: relative;
}
.btn {
  position: absolute;
  right: 0;
  top: 0;
  padding: 5px 10px;
  cursor: pointer;
}
h3 {
  margin: 30px 0 15px;
}
.w-e-text-container {
// 文本框里面的层级调低
  height: auto !important;
  z-index: 1 !important;
}
.w-e-text p{
  margin:0;
}
.w-e-toolbar {
// 给工具栏换行
  flex-wrap: wrap;
  z-index: 2 !important;
}
.w-e-menu {
// 最重要的一句代码
z-index: auto !important;

.w-e-droplist {
// 触发工具栏后的显示框调高
z-index: 2 !important;
}
}

.w-e-text-container {
  z-index: 1 !important;
}
</style>
