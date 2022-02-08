<template>
  <a-modal v-model="visible" title="预览效果" @ok="handleOk" @cancel="handleOk">
    <div class="head">
      <a-avatar :src="user.avatar" size="small" shape="circle"></a-avatar>
      <div class="head-right">
        <span class="company-name">{{user.name}}</span>
        <span class="create-time">{{createTime}}</span>
      </div>
    </div>
    <div v-html="content"></div>
  </a-modal>
</template>

<script>
import {mapGetters} from "vuex";
import moment from "moment";

export default {
  name: "articleDetail",
  data(){
    return{
    }
  },
  computed: {
    ...mapGetters('account', ['user']),
    createTime(){
      return moment().format('YYYY-MM-DD');
    }
  },
  props:{
    content:{},
    visible:{}
  },
  methods:{
    handleOk(){
      this.$emit('closeRich')
    }
  }
}
</script>

<style scoped>
.head-right{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 18px;
}
.head{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 34px;
}
.company-name{
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #312E2A;
}
.create-time{
  font-size: 10px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #66645F;
}
.head-right{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 18px;
}
</style>
