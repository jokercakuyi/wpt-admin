<template>
  <a-card>
  <a-form-model ref="ruleForm" :rules="rules"  :model="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 13 }">
    <a-form-item label="拍品包">
      <p style="color: rgba(0, 0, 0, 0.85)">{{ pname }}</p>
    </a-form-item>
    <a-form-model-item label="拍品名称" prop="name">
      <a-input
          placeholder="请输入(最大50)"
          :maxLength='50'
          showCount
          v-model="form.name"
      />
    </a-form-model-item>
    <a-form-model-item label="拍品描述" prop="description">
      <a-textarea
          placeholder="请输入(最大70)"
          :maxLength='70'
          allowClear
          showCount
          v-model="form.description"
      />
    </a-form-model-item>
    <a-form-model-item label="市场价" prop="evaluationPrice">
      <a-input-number
          placeholder="请输入"
          style="width: 200px"
          :min="0" :max="1000000000"
          v-model="form.evaluationPrice"
      /> 元
    </a-form-model-item>
    <a-form-model-item label="售卖价" prop="price">
      <a-input-number
          placeholder="请输入"
          style="width: 200px"
          :min="0" :max="1000000000"
          v-model="form.price"
      /> 元
    </a-form-model-item>
    <a-form-model-item label="库存" prop="stock">
      <a-input-number
          placeholder="请输入"
          style="width: 200px"
          :min="0" :max="99999"
          v-model="form.stock"
      /> 件
    </a-form-model-item>
    <a-form-model-item label="拍品图片" prop="albumPics">
      <a-upload
          v-model="form.albumPics"
          :headers="headers"
          :data="albumData"
          action="/api/file/upload"
          list-type="picture-card"
          accept=".jpeg,.png,.jpg"
          :file-list="fileList1"
          :before-upload="beforeUpload"
          :remove="handleAlbumRemove"
          @preview="handlePreview"
          @change="handleChange"
      >
        <div v-if="fileList1.length < 5">
          <a-icon type="plus" />
          <div class="ant-upload-text">
            Upload
          </div>
        </div>
      </a-upload>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
      <span>尺寸建议750x750（正方形模式）像素以上，大小2M以下，最多5张</span>
    </a-form-model-item>
    <a-form-model-item label="拍品参数" prop="attributeList">
      <div v-for="(item2,index) in form.attributeList" :key="index" style="display: flex;flex-direction: row">
        <a-input v-model="item2.attributeName" style="width: 200px"></a-input>
        <a-input v-model="item2.value" style="width: 200px"></a-input>
        <a @click="form.attributeList.splice(index,1)" style="margin-left: 10px">删除</a>
<!--        {{item2.item}}:{{item2.attributeName}}-->
      </div>
      <a-button type="dashed" @click="visible=true">+添加</a-button>
    </a-form-model-item>
    <a-form-model-item label="自提点" prop="addressId">
      <a-select v-model="form.addressId" placeholder="请选择自提点" style="width: 200px" @select="spotChange">
        <a-select-option :value="item.id" v-for="(item,index) in addressList" :key="index">
          {{item.signName}}
        </a-select-option>
      </a-select>
      <a @click="spotVisible=true" style="margin-left: 10px">新增自提点</a>
      <div v-if="address.name">
        <p>联系人：{{address.name}}</p>
        <p>联系方式：{{address.phone}}</p>
        <p>地址：{{address.site}}</p>
      </div>
    </a-form-model-item>
    <a-form-model-item label="拍品详情图片" prop="detailMobileHtml">
      <a-upload
          v-model="form.detailMobileHtml"
          :headers="headers"
          :data="detailData"
          action="/api/file/upload"
          list-type="picture-card"
          :before-upload="beforeUpload"
          :file-list="fileList2"
          accept=".jpeg,.png,.jpg"
          :remove="handleMobileRemove"
          @preview="handlePreview"
          @change="handleMobileChange"
      >
        <div v-if="fileList2.length < 5">
          <a-icon type="plus" />
          <div class="ant-upload-text">
            Upload
          </div>
        </div>
      </a-upload>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
      <span>尺寸建议750x750（正方形模式）像素以上，大小2M以下，最多5张 </span>
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">
<!--      <a-button type="primary" @click="onSubmit(1)">-->
<!--        提交-->
<!--      </a-button>-->
      <a-button type="primary" style="margin-left: 5px" @click="onSubmit(0)">
        提交
      </a-button>
      <a-button type="primary" style="margin-left: 5px" @click="cancel()">
        取消
      </a-button>
    </a-form-model-item>
  </a-form-model>
    <a-modal
        title="拍品参数"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleParamterOk"
        @cancel="handleParamterCancel"
    >
      <a-form-model
          ref="parameterForm"
          :model="parameterForm"
          :rules="parameterRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="参数名" prop="attributeName">
          <a-input v-model="parameterForm.attributeName"></a-input>
        </a-form-model-item>
        <a-form-model-item label="参数值" prop="value">
          <a-input v-model="parameterForm.value"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <add-spot :visible="spotVisible" @spotCancel="spotCancel"></add-spot>
  </a-card>
</template>

<script>
import Cookie from "js-cookie";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
import {insertProducts,getProductAddress,getProductsInfo,updateProducts} from '@/services/culture';
import addSpot from '../../components/spod/index'
export default {
  name: "addProduct",
  components:{addSpot},
  data() {
    return {
      packetId:null,
      address:{},
      spotVisible:false,
      headers:{
        // 'Access-Token-PC': this.$store.state.user.token,
        'Authorization': Cookie.get('Authorization')
      },
      albumData:Object.assign({},{type:'product',pid:this.$cookies.get('packetId')}),
      detailData:Object.assign({},{type:'product',pid:this.$cookies.get('packetId')}),
      pname:'',
      addressList:[],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      visible: false,
      confirmLoading: false,
      parameterRules:{
        attributeName:[{ required: true, message: '请输入参数名', trigger: 'blur' }],
        value:[{ required: true, message: '请输入参数值', trigger: 'blur' }]
      },
      parameterForm:{
        attributeName:'',
        value:''
      },
      rules:{
        albumPics:[{ required: true, message: '请上传图片', trigger: 'change' }],
        detailMobileHtml:[{ required: true, message: '请上传图片', trigger: 'change' }],
        name:[{ required: true, message: '请输入拍品名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入拍品描述', trigger: 'blur' }],
        evaluationPrice:[{ required: true, message: '请输入评估价',trigger:'blur' }],
        price:[{ required: true, message: '请输入售卖价' }],
        stock:[{ required: true, message: '请输入库存' }],
        addressId:[{ required: true, message: '请选择自提点',trigger:'change' }],
        attributeList:[{ required: true, message: '请输入参数',trigger:'change' }]
      },
      formLayout: 'horizontal',
      form:{
        packetId:this.$cookies.get('packetId'),
        name:'',
        description:'',
        evaluationPrice:'',
        price:'',
        stock:'',
        addressId:undefined,
        attributeList:[],
        albumPics:[],
        detailMobileHtml:[]
      },
      previewVisible: false,
      previewImage: '',
      fileList1: [
      ],
      fileList2: [
      ]
    };
  },
  watch: {
    '$route.query.productId' (to, from) { //监听路由是否变化
      if(this.$route.path == '/culture/add'){//仅在当前页面生效
        if(to != from){
          this.form={
                packetId:this.$cookies.get('packetId'),
                name:'',
                description:'',
                evaluationPrice:'',
                price:'',
                stock:'',
                addressId:undefined,
                attributeList:[],
                albumPics:[],
                detailMobileHtml:[]
          }
          this.address={};
          this.form.packetId=this.$cookies.get('packetId');
          this.getProductsInfo();//重新加载数据
        }
      }
    }
  },
  mounted() {
    this.packetId=this.$cookies.get('packetId');
    this.form.packetId=this.packetId;
    this.$nextTick(()=>{
      this.pname=this.$route.query.name;
    })
    if(this.$route.query.productId){
      this.getProductsInfo();
    }
    this.getAddress();
  },
  methods: {
    cancel(){
      this.$closePage('/culture/add','/culture/detail')
    },
    spotChange(e){
      this.addressList.forEach(item=>{
        console.log(item);
        if(item.id==e){
          this.address=Object.assign({},item);
          console.log(item);
        }
      })
    },
    spotCancel(){
      this.spotVisible=false;
      this.getAddress();
    },
    getAddress(){
      getProductAddress().then(res=>{
        this.addressList=res.data.data;
        console.log(res);
      })
    },
    beforeUpload(file) {
      console.log(file);
      this.posterData=Object.assign({},{type:'product'});
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
    getProductsInfo(){
      this.fileList1=[];
      this.fileList2=[];
      this.form={
        packetId:this.$cookies.get('packetId'),
        name:'',
        description:'',
        evaluationPrice:'',
        price:'',
        stock:'',
        addressId:undefined,
        attributeList:[],
        albumPics:[],
        detailMobileHtml:[]
      };
      getProductsInfo({id:this.$route.query.productId}).then(res=>{
        this.form=res.data.data;
        let albumPics=res.data.data.albumPics;
        albumPics.forEach((item,index)=>{
          this.fileList1.push({
            uid: index,
            name: 'image.png',
            status: 'done',
            url: item,
          });
        })
        let detailMobileHtml=res.data.data.detailMobileHtml;
        detailMobileHtml.forEach((item,index)=>{
          this.fileList2.push({
            uid: index,
            name: 'image.png',
            status: 'done',
            url: item,
          });
        })
        console.log(res);
      })
    },
    handleParamterOk() {
      this.$refs.parameterForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          setTimeout(() => {
            console.log(this.parameterForm);
            this.form.attributeList.push(this.parameterForm);
            this.visible = false;
            this.confirmLoading = false;
            this.parameterForm={
              item:'',
              attributeName: ''
            };
          }, 1000);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleParamterCancel() {
      console.log('Clicked cancel button');
      this.visible = false;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
    handleSelectChange(value) {
      console.log(value);
      this.form.setFieldsValue({
        note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
      });
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ file,fileList,event }) {
      console.log(event);
      console.log(file);
      console.log(fileList)
      this.fileList1 = fileList;
      if(file.status=="done"){
        this.form.albumPics.push(file.response.data);
      }else if(file.status=="removed"){
        this.form.albumPics.forEach((item,index)=>{
          console.log(item,file.url);
          if(item===file.response.data||item===file.url){
            this.form.albumPics.splice(index,1);
          }
        })
      }
      console.log(this.form.albumPics);
    },
    handleMobileChange({ file,fileList }){
      this.fileList2 = fileList;
      if(file.status=="done"){
        this.form.detailMobileHtml.push(file.response.data);
      }else if(file.status=="removed"){
        this.form.detailMobileHtml.forEach((item,index)=>{
          if(item===file.response.data||item===file.url){
            this.form.detailMobileHtml.splice(index,1);
          }
        })
      }
      console.log(this.form.albumPics);
    },
    handleAlbumRemove(file){
      console.log(file)
      this.form.albumPics.forEach((item,index)=>{
        if(item===file.url){
          this.form.albumPics.splice(index,1);
        }
      })
    },
    handleMobileRemove(file){
      this.form.detailMobileHtml.forEach((item,index)=>{
        if(item===file.url){
          this.form.detailMobileHtml.splice(index,1);
        }
      })
      console.log(file)
    },
    onSubmit(type) {
      if(type===0){
        setTimeout(()=>{
          this.$refs.ruleForm.validate(valid => {
            if (valid) {
              this.form.packetId=this.$store.state.account.packetId;
              if(!this.$route.query.productId){
                insertProducts(this.form).then(res=>{
                  if(res.data.code==500){
                    this.$message.error(res.data.message);
                    return false;
                  }
                  this.form={
                    packetId:0,
                    name:'',
                    description:'',
                    evaluationPrice:'',
                    price:'',
                    stock:'',
                    addressId:undefined,
                    attributeList:[],
                    albumPics:[],
                    detailMobileHtml:[]
                  }
                  this.fileList1=[];
                  this.fileList2=[];
                  this.$message.success('上传成功');
                  this.$closePage('/culture/add');
                  this.$router.push({path: '/culture/detail',query:{id:this.packetId}});
                  console.log(res);
                })
              }else{
                updateProducts(this.form).then(res=>{
                  if(res.data.code==500){
                    this.$message.error(res.data.message);
                    return false;
                  }
                  this.form={
                    packetId:0,
                    name:'',
                    description:'',
                    evaluationPrice:'',
                    price:'',
                    stock:'',
                    addressId:undefined,
                    attributeList:[],
                    albumPics:[],
                    detailMobileHtml:[]
                  }
                  this.fileList1=[];
                  this.fileList2=[];
                  this.$message.success('编辑成功');
                  this.$closePage('/culture/add');
                  this.$router.push({path: '/culture/detail',query:{id:this.packetId}});
                  console.log(res);
                })
              }

            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },500)

      }else if(type===1){
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            alert('提交!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }

    }
  },
}
</script>

<style scoped>

</style>
