<template>
  <a-card>
    <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
      <a-form-model-item prop="title" label="资讯标题">
        <a-input v-model="form.title" :maxLength="50" placeholder="请输入(最大50)"></a-input>
      </a-form-model-item>
      <a-form-model-item prop="poster" label="资讯首图">
        <a-upload
            v-model="form.poster"
            :before-upload="beforeUpload"
            action="/api/file/upload"
            list-type="picture-card"
            :headers="headers"
            :data="posterData"
            :file-list="fileList1"
            accept=".jpeg,.png,.jpg"
            :remove="handleAlbumRemove"
            @preview="handlePreview"
            @change="handleChange"
        >
          <div v-if="fileList1.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">
              Upload
            </div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
        <span>尺寸建议750x750（长方形模式）像素以上，大小2M以下</span>
      </a-form-model-item>
      <a-form-model-item label="资讯正文">
      <richText
          ref="rich"
          :text="form.mobileHtml"
          @editorChange="editorChange"
      />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }" style="margin-top: 150px">
        <a-button type="primary" @click="onSubmit(10)" v-if="!id">
          发布
        </a-button>
        <a-button type="default" style="margin-left: 5px" @click="getRich">
          预览
        </a-button>
        <a-button type="default" style="margin-left: 5px" @click="onSubmit(5)">
          保存
        </a-button>
        <a-button type="default" style="margin-left: 5px" @click="cancel()">
          取消
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <article-detail :visible="richVisible" :content="form.mobileHtml" @closeRich="richVisible=false"></article-detail>
  </a-card>
</template>
<script>
import richText from '../../components/edtior/edtior'
import {getNewsInfo,insertNews,updateNews} from '@/services/culture'
import articleDetail from '../detail/articleDetail'
import Cookie from "js-cookie";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  components: {richText,articleDetail},
  data() {
    return {
      richVisible:false,
      id:null,
      headers:{
        // 'Access-Token-PC': this.$store.state.user.token,
        'Authorization': Cookie.get('Authorization')
      },
      posterData:Object.assign({},{type:'news'}),
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form:{
        title:'',
        mobileHtml:'',
        poster:''
      },
      previewVisible: false,
      previewImage: '',
      rules:{
        title:[{ required: true, message: '请输入资讯标题', trigger: 'blur' }],
        mobileHtml:[{ required: true, message: '请输入资讯内容', trigger: 'blur' }],
        poster:[{ required: true, message: '请上传图片', trigger: 'change' }]
      },
      fileList1: [
      ]
    }
  },
  watch:{
    $route(){
      this.form={
        title:'',
        mobileHtml:'',
        poster:''
      };
      this.fileList1=[];
    },
    '$route.query.id' (to, from) { //监听路由是否变化
      if(this.$route.path === '/article/add'){//仅在当前页面生效
        if(to != from){
          console.log(to);
          this.id = to;
          console.log(this.id);
          if (this.id != 0) {
            this.form={
              title:'',
              mobileHtml:'',
              poster:''
            };
            this.fileList1=[];
            this.getInfo();
          } else {
            this.form={
              title:'',
              mobileHtml:'',
              poster:''
            };
            this.fileList1=[];
          }
        }
      }
    }
  },
  mounted() {
    this.id=this.$route.query.id;
    this.getInfo();
  },
  methods: {
    getRich(){
      this.richVisible=true;
      this.$refs.rich.getEditorData();
    },
    beforeUpload(file) {
      console.log(file);
      this.posterData=Object.assign({},{type:'news'});
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('只能上传jpg格式!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('图片不能大于2MB');
      }
      return isJpgOrPng && isLt2M;
    },
    getInfo(){
      getNewsInfo({id:this.id}).then(res=>{
        this.form=res.data.data;
        this.fileList1.push({
          uid: -1,
          name: 'image.png',
          status: 'done',
          url:res.data.data.poster});
        console.log(res);
      })
    },
    cancel(){
      this.$closePage('/article/add','/article/list')
    },
    onSubmit(type){
      console.log(type);
      this.$refs.rich.getEditorData();
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if(type==10){
            this.form.status=20;
            insertNews(this.form).then(res=>{
              console.log(res);
              this.form={
                title:'',
                mobileHtml:'',
                poster:''
              };
              this.cancel();
            })
          }else if(type===5){
            this.form.status=5;
            if(!this.id){
              insertNews(this.form).then(res=>{
                console.log(res);
                this.form={
                  title:'',
                  mobileHtml:'',
                  poster:''
                };
                this.cancel();
              })
            }else{
              updateNews(this.form).then(res=>{
                console.log(res);
                this.form={
                  title:'',
                  mobileHtml:'',
                  poster:''
                };
                this.cancel();
              })
            }
          }
          console.log(this.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    firstFresh(){
      console.log(1);
    },
    editorChange(html) {
      console.log(html);
      this.form.mobileHtml = html;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleAlbumRemove(file){
      this.form.poster='';
      console.log(file)
    },
    handleChange({ file,fileList }) {
      this.fileList1 = fileList;
      if(file.status=="done"){
        this.form.poster=file.response.data;
      }else if(file.status=="removed"){
        this.form.poster="";
      }
    },
    handleCancel() {
      this.previewVisible = false;
    }
  }
}
</script>

