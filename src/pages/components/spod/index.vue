<template>
  <div>
    <a-modal v-model="visible" title="新增自提点" @ok="handleOk" @cancel="cancel">
  <a-card>
    <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
    >
      <a-form-model-item prop="signName" label="提货点">
        <a-input v-model="form.signName" placeholder="请输入" :maxLength="20"></a-input>
      </a-form-model-item>
      <a-form-model-item prop="name" label="联系人">
        <a-input v-model="form.name" placeholder="请输入" :maxLength="10"></a-input>
      </a-form-model-item>
      <a-form-model-item prop="phone" label="手机号">
        <a-input v-model="form.phone" placeholder="请输入"></a-input>
      </a-form-model-item>
      <a-form-model-item prop="areaSite" label="区域">
        <area-select
            @change="selectArea"
            :default-value="form.areaSite"
            v-model="form.areaSite"
        />
      </a-form-model-item>
      <a-form-model-item prop="site" label="详细地址">
        <a-textarea v-model="form.site" placeholder="请输入"></a-textarea>
      </a-form-model-item>
<!--      <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">-->
<!--        <a-button type="primary" style="margin-left: 5px" @click="onSubmit()">-->
<!--          保存-->
<!--        </a-button>-->
<!--        <a-button type="default" style="margin-left: 5px" @click="cancel">-->
<!--          取消-->
<!--        </a-button>-->
<!--      </a-form-model-item>-->
    </a-form-model>
  </a-card>
  </a-modal>
  </div>
</template>

<script>
import areaSelect from "@/components/areaPicker/picker";

var checkPhone = (rule, value, callback) => {
  console.log(value);
  if (!value) {
    callback('电话不能为空'); // 校验不通过
    return false;
  } else {
    // const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/; // 0571-86295197
    // const isPhone02 = /^\d{3,4}-\d{3,4}-\d{3,4}$/; // 4001-550-520
    // const isPhone02 = /^[0-9]{3,4}-[0-9]{2,3}-[0-9]{2,3}$/; // 4001-550-520
    // const isPhone02 = /^([0-9]{3,4}-)?([0-9]{3,4}-)?[0-9]{3,4}$/; // 4001-550-520
    const isMob = /^1[0-9]{10}$/;
    // const phone02 = /^0\d{2,3}-?\d{7,8}$/;
    const valuePhone = value.trim();
    if (isMob.test(valuePhone)) { // 正则验证
      callback(); // 校验通过
      return true;
    } else {
      callback('请输入正确手机号'); // 校验不通过
      return false;
    }
  }
};
import {insertCompanyAddress} from '@/services/culture';

export default {
  name: "spot",
  components: {areaSelect},
  data() {
    return {
      selectedValue:[],
      id: 0,
      defaultArea: ['32', '3205', '320571'],
      labelCol: {span: 4},
      wrapperCol: {span: 14},
      rules: {
        signName: [{required: true, message: '请输入提货点', trigger: 'blur'}],
        name: [{required: true, message: '请输入联系人', trigger: 'blur'}],
        phone: [{required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkPhone, trigger: 'true'}],
        site: [{required: true, message: '请输入详细地址', trigger: 'blur'}],
        areaSite: [{required: true, message: '请选择区域', trigger: 'change'}]
      },
      form: {
        signName: '',
        name: '',
        areaSite: [],
        phone: '',
        site: ''
      }
    }
  },
  props:{
    visible:{}
  },
  mounted() {

  },
  methods: {
    cancel() {
      this.form = {
        signName: '',
        name: '',
        areaSite: [],
        phone: '',
        site: ''
      };
      this.$emit('spotCancel');
    },
    selectArea(selectedArea) {
      this.form.areaSite = selectedArea;
    },
    handleOk() {
      var that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$confirm({
            title: '确认保存？',
            content: '',
            onOk() {
                insertCompanyAddress(that.form).then(res => {
                  console.log(res);
                  if(res.data.code===500){
                    this.$message.error(res.data.message);
                    return false;
                  }
                  that.form = {
                    signName: '',
                    name: '',
                    areaSite: [],
                    phone: '',
                    site: ''
                  };
                  that.$message.success('添加成功');
                  that.cancel();
                })
            },
            onCancel() {
              that.btnloading = false;
            },
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
