<template>
  <a-card style="padding:0 100px 0 100px;font-size: 30px">
    <a-descriptions title="" :column="1">
      <a-descriptions-item label="拍品包">
        {{ info.packetName }}
      </a-descriptions-item>
      <a-descriptions-item label="拍品名称">
        {{ info.name }}
      </a-descriptions-item>
      <a-descriptions-item label="拍品描述">
        {{ info.description }}
      </a-descriptions-item>
      <a-descriptions-item label="评估价">
        {{ info.evaluationPrice }}
      </a-descriptions-item>
      <a-descriptions-item label="销售价">
        {{ info.price }}
      </a-descriptions-item>
      <a-descriptions-item label="库存">
        {{ info.stock }}
      </a-descriptions-item>
      <a-descriptions-item label="拍品图片">
        <img width="100" v-for="(item,key) in info.albumPics" :src="item" :key="key" @click="preview(item)">
      </a-descriptions-item>
      <a-descriptions-item label="拍品参数">
        <div v-for="(item,index) in info.attributeList" :key="index">
          <span>{{item.attributeName}} </span>:<span> {{item.value}}</span>
        </div>
      </a-descriptions-item>
      <a-descriptions-item label="自提点">
        {{ info.signName }}
        联系人：{{info.addressName}}
        联系电话：{{info.phone}}
        自提地址：{{ info.site }}
      </a-descriptions-item>
      <a-descriptions-item label="拍品详情">
        <img width="100" style="height: 100px" v-for="(item,key) in info.detailMobileHtml" :src="item" :key="key" @click="preview(item)">
      </a-descriptions-item>
    </a-descriptions>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
    <a-button type="default">预览</a-button>
    <a-button type="default" @click="back">返回</a-button>
  </a-card>
</template>

<script>
import {getProductInfo} from '@/services/culture'
export default {
  name: "productIInnerDetail",
  data(){
    return {
      info:{},
      previewVisible:false,
      previewImage:''
    }
  },
  watch:{
    '$route.query.id' (to, from) { //监听路由是否变化
      if(this.$route.path === '/culture/innerDetail'){//仅在当前页面生效
        if(to != from){
          this.getProductsInfo();
        }
      }
    }
  },
  mounted() {
    this.getProductsInfo();
  },
  methods:{
    getProductsInfo(){
      getProductInfo({id:this.$route.query.id}).then(res=>{
        console.log(res)
        this.info=Object.assign({},res.data.data);
      })
    },
    preview(url){
      this.previewImage = url;
      this.previewVisible = true;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    back(){
      this.$closePage('/culture/innerDetail','/culture/detail')
    }
  }
}
</script>

<style scoped>

</style>
