<template>
  <a-card style="padding:100px">
  <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout" v-if="isEdit">
    <h2 style="margin-left: 150px">修改密码</h2>
    <a-form-model-item has-feedback label="原密码" prop="originalPassword">
      <a-input v-model.number="ruleForm.originalPassword" />
    </a-form-model-item>
    <a-form-model-item has-feedback label="新密码" prop="password">
      <a-input v-model="ruleForm.password" type="password" autocomplete="off" />
    </a-form-model-item>
    <a-form-model-item has-feedback label="确认密码" prop="confirmPassword">
      <a-input v-model="ruleForm.confirmPassword" type="password" autocomplete="off" />
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="submitForm('ruleForm')">
        确认修改
      </a-button>
      <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">
        取消
      </a-button>
    </a-form-model-item>
  </a-form-model>
    <a-result
        v-else
        status="success"
        title="修改成功"
        sub-title="1s后重新登录"
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
import {updatePassword} from '@/services/user'
export default {
  data() {
    let validatePass3=(rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'));
      } else {
        if (this.ruleForm.confirmPassword !== '') {
          this.$refs.ruleForm.validateField('confirmPassword');
        }
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if(value.length<6||value.length>16){
        callback(new Error('请输入6-16位的密码'));
      }
      if (value === '') {
        callback(new Error('请输入新密码'));
      } callback();
    };
    let validatePass2 = (rule, value, callback) => {
      if(value.length<6||value.length>16){
        callback(new Error('请输入6-16位的密码'));
      }
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次密码输入不一致!"));
      } else {
        callback();
      }
    };
    return {
      isEdit:true,
      ruleForm: {
        password: '',
        confirmPassword: '',
        originalPassword: '',
      },
      rules: {
        password: [{ validator: validatePass, trigger: 'change' }],
        confirmPassword: [{ validator: validatePass2, trigger: 'change' }],
        originalPassword:[{validator: validatePass3,trigger:'change'}]
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updatePassword(this.ruleForm).then(res=>{
            console.log(res);
            if(res.data.code===500){
              this.$message.error(res.data.message);
              return false;
            }else{
              this.$message.success('修改成功');
              this.$refs['ruleForm'].resetFields();
              this.isEdit=false;
              setTimeout(()=>{
                this.$router.push('/login')
              },1000);
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
