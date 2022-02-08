<template>
  <a-card>
    <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        v-if="isEdit"
    >
      <a-form-model-item label="企业logo">
        <a-avatar :size="50" icon="user" :src="user.avatar"/>
      </a-form-model-item>
      <a-form-model-item label="企业名称">
        <span style="color: #d2d2d2">{{ user.name }}</span>
      </a-form-model-item>
      <a-form-model-item label="联系方式" prop="phone">
        <a-input type="number" v-model="form.phone" placeholder="请输入"></a-input>
      </a-form-model-item>
      <a-form-model-item label="企业简介" prop="desc">
        <a-textarea type="text" v-model="form.desc" :maxLength='100' placeholder="请输入" style="height: 100px"></a-textarea>
      </a-form-model-item>
      <a-form-model-item label="企业主图" prop="poster">
        <a-upload
            v-model="form.poster"
            :headers="headers"
            :file-list="fileList1"
            :data="posterData"
            list-type="picture-card"
            action="/api/file/upload"
            accept=".jpeg,.png,.jpg"
            :before-upload="beforeUpload"
            @preview="handlePreview"
            :remove="handleRemove"
            @change="handleChange"
        >
          <div v-if="fileList1.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">
              Upload
            </div>
          </div>
        </a-upload>
        尺寸建议750x420（长方形模式）像素以上，大小2M以下
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" style="margin-left: 5px" @click="onSubmit()" :loading="btnloading">
          保存
        </a-button>
        <a-button type="default" style="margin-left: 5px" @click="cancel">
          取消
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <a-result
        v-else
        status="success"
        title="保存成功"
        sub-title="想继续编辑请按下返回按钮"
    >
      <template #extra>
        <a-button key="console" type="primary" @click="isEdit=true">
          返回
        </a-button>
      </template>
    </a-result>
  </a-card>
</template>

<script>
import {mapGetters} from "vuex";
import {getCompanyInfo,updateCompanyInfo} from '@/services/culture'
import Cookie from "js-cookie";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
var checkPhone = (rule, value, callback) => {
  console.log(value);
  if (!value) {
    callback('电话不能为空'); // 校验不通过
    return false;
  } else {
    const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/; // 0571-86295197
    const isPhone02 = /^\d{3,4}-\d{3,4}-\d{3,4}$/; // 4001-550-520
    // const isPhone02 = /^[0-9]{3,4}-[0-9]{2,3}-[0-9]{2,3}$/; // 4001-550-520
    // const isPhone02 = /^([0-9]{3,4}-)?([0-9]{3,4}-)?[0-9]{3,4}$/; // 4001-550-520
    const isMob=/^1[3|5|8]\d{9}$/;
    // const phone02 = /^0\d{2,3}-?\d{7,8}$/;
    const valuePhone = value.trim();
    if (isMob.test(valuePhone) || isPhone.test(valuePhone) || isPhone02.test(valuePhone)) { // 正则验证
      callback(); // 校验通过
      return true;
    } else {
      callback('请输入正确手机号或座机电话'); // 校验不通过
      return false;
    }
  }
};
export default {
  name: "manuInfo",
  data(){
    return{
      headers:{
        // 'Access-Token-PC': this.$store.state.user.token,
        'Authorization': Cookie.get('Authorization')
      },
      posterData:{},
      btnloading:false,
      isEdit:true,
      loading:false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      fileList1: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: '',
        }],
      previewVisible: false,
      previewImage: '',
      form:{
        logo:'',
        name:'',
        phone:'',
        desc:"",
        poster:''
      },
      rules:{
        phone:[
            { required: true,message: '请输入',trigger: 'blur'},
            { validator:checkPhone,trigger: 'true'}
        ],
        poster:[
          { required: true,message: '请上传',trigger: 'change'}
        ],
        desc:[
          {required: true,message: '请输入',trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    ...mapGetters('account', ['user']),
  },
  mounted() {
    console.log(this.user.avatar);
    this.getInfo();
  },
  watch: {
    '$route': function (){
      //重新新页面的数据信息
      this.getInfo();//重新加载数据
    }
  },
  methods:{
    getInfo(){
      getCompanyInfo().then(res=>{
        this.form=res.data.data;
        this.fileList1=[{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: res.data.data.poster
        }];
        console.log(res);
      })
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handleRemove(file){
      this.form.poster='';
      console.log(file)
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({file,fileList,event}) {
      console.log(file,fileList,event);
      this.fileList1 = fileList;
      if(file.status=="done"){
        this.form.poster=file.response.data;
      }else if(file.status=="removed"){
        this.form.poster='';
      }
    },
    beforeUpload(file) {
      console.log(file);
      this.posterData=Object.assign({},{type:'basicinfo'});
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('只能上传jpg格式!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('图片不能大于2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    cancel(){
      this.form={
        signName:'',
        name:'',
        area:[],
        phone:'',
        site:''
      };
      this.$router.go(-1);
    },
    onSubmit() {
      var that=this;
      this.btnloading=true;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$confirm({
            title: '确认保存？',
            content: '确认保存？',
            onOk() {
              updateCompanyInfo(that.form).then(res=>{
                console.log(res);
                that.btnloading=false;
                that.isEdit=false;
              })
              console.log(that.form);
            },
            onCancel() {
              that.btnloading=false;
            },
          });
        } else {
          console.log('error submit!!');
          this.btnloading=false;
          return false;
        }
      });

    }
  }
}
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 256px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
