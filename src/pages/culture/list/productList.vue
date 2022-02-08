<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="listQuery" @submit="handleSearch">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                  label="拍品包"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-decorator="['name']"
                         placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                  label="状态"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-select style="width: 120px" v-decorator="['status',{rules: [{ required: true, message: '请选择' }],initialValue:'0'}]" @change="handleChange">
                  <a-select-option value='0'>
                    全部
                  </a-select-option>
                  <a-select-option value='10'>
                    待发布
                  </a-select-option>
                  <a-select-option value='30'>
                    已发布
                  </a-select-option>
                  <a-select-option value='40'>
                    审核失败
                  </a-select-option>
                  <a-select-option value='20'>
                    审核中
                  </a-select-option>
                  <a-select-option value='50'>
                    已结束
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!--            <a-col :md="8" :sm="24" >-->
            <!--              <a-form-item-->
            <!--                  label="使用状态"-->
            <!--                  :labelCol="{span: 5}"-->
            <!--                  :wrapperCol="{span: 18, offset: 1}"-->
            <!--              >-->
            <!--                <a-select placeholder="请选择">-->
            <!--                  <a-select-option value="1">关闭</a-select-option>-->
            <!--                  <a-select-option value="2">运行中</a-select-option>-->
            <!--                </a-select>-->
            <!--              </a-form-item>-->
            <!--            </a-col>-->
            <!--            <a-col :md="8" :sm="24" >-->
            <!--              <a-form-item-->
            <!--                  label="调用次数"-->
            <!--                  :labelCol="{span: 5}"-->
            <!--                  :wrapperCol="{span: 18, offset: 1}"-->
            <!--              >-->
            <!--                <a-input-number style="width: 100%" placeholder="请输入" />-->
            <!--              </a-form-item>-->
            <!--            </a-col>-->
            <span style="margin-left: 20px;margin-top: 7px">
          <a-button type="primary" html-type="submit">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              <!--          <a @click="toggleAdvanced" style="margin-left: 8px">-->
              <!--            {{advanced ? '收起' : '展开'}}-->
              <!--            <a-icon :type="advanced ? 'up' : 'down'" />-->
              <!--          </a>-->
        </span>
          </a-row>
          <!--          <a-row v-if="advanced">-->
          <!--            <a-col :md="8" :sm="24" >-->
          <!--              <a-form-item-->
          <!--                  label="更新日期"-->
          <!--                  :labelCol="{span: 5}"-->
          <!--                  :wrapperCol="{span: 18, offset: 1}"-->
          <!--              >-->
          <!--                <a-date-picker style="width: 100%" placeholder="请输入更新日期" />-->
          <!--              </a-form-item>-->
          <!--            </a-col>-->
          <!--            <a-col :md="8" :sm="24" >-->
          <!--              <a-form-item-->
          <!--                  label="使用状态"-->
          <!--                  :labelCol="{span: 5}"-->
          <!--                  :wrapperCol="{span: 18, offset: 1}"-->
          <!--              >-->
          <!--                <a-select placeholder="请选择">-->
          <!--                  <a-select-option value="1">关闭</a-select-option>-->
          <!--                  <a-select-option value="2">运行中</a-select-option>-->
          <!--                </a-select>-->
          <!--              </a-form-item>-->
          <!--            </a-col>-->
          <!--            <a-col :md="8" :sm="24" >-->
          <!--              <a-form-item-->
          <!--                  label="描述"-->
          <!--                  :labelCol="{span: 5}"-->
          <!--                  :wrapperCol="{span: 18, offset: 1}"-->
          <!--              >-->
          <!--                <a-input placeholder="请输入" />-->
          <!--              </a-form-item>-->
          <!--            </a-col>-->
          <!--          </a-row>-->
        </div>

      </a-form>
    </div>
    <div>
<!--      <a-space class="operator">-->
        <a-button @click="addNew" type="primary">+新建拍品包</a-button>
<!--        <a-button>批量操作</a-button>-->
<!--        <a-dropdown>-->
<!--          <a-menu @click="handleMenuClick" slot="overlay">-->
<!--            <a-menu-item key="delete">删除</a-menu-item>-->
<!--            <a-menu-item key="audit">审批</a-menu-item>-->
<!--          </a-menu>-->
<!--          <a-button>-->
<!--            更多操作-->
<!--            <a-icon type="down"/>-->
<!--          </a-button>-->
<!--        </a-dropdown>-->
<!--      </a-space>-->
<!--      <a-tabs :default-active-key="data.status" @change="callback">-->
<!--        <a-tab-pane key="20" tab="已上架商品">-->
<!--        </a-tab-pane>-->
<!--        <a-tab-pane key="0" tab="待提交商品">-->
<!--        </a-tab-pane>-->
<!--        <a-tab-pane key="10" tab="审核中商品">-->
<!--        </a-tab-pane>-->
<!--        <a-tab-pane key="30" tab="审核驳回商品">-->
<!--        </a-tab-pane>-->
<!--      </a-tabs>-->
      <standard-table
          :loading="loading"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :rowKey="(record,index)=>{return index}"
          @clear="onClear"
          @change="onChange"
          @selectedRowChange="onSelectChange"
      >
        <span slot="name" slot-scope="{text,record}">
          {{text}} <a-icon type="edit" v-if="[10,40].includes(record.status)" @click="edit(record)"></a-icon>
      </span>
        <span slot="startTime" slot-scope="{text,record}">
          <p>开始：{{ record.startTime }}</p>
          <p>截止：{{record.endTime}}</p>
        </span>
        <span slot="amount" slot-scope="{text,record}">
          <a-progress :percent="Math.round((record.sale/record.amount)*100)" :strokeWidth="10"/>
          ￥{{record.sale}}/{{record.amount}}
        </span>
        <span slot="status" slot-scope="{text,record}">
          <a-tooltip
              v-if="text==40"
          >
            <template slot="title">
              {{ record.errMsg }}
            </template>
          <a href="#">{{ record.status|handleStatus }}</a>
        </a-tooltip>
          <span v-else>{{ record.status|handleStatus }}</span>
        </span>
        <div slot="action" slot-scope="{text, record}">
          <a style="margin-right: 8px" v-if="[10,40].includes(record.status)"  @click="submitRecord(record.id)">
            提交
          </a>
          <a style="margin-right: 8px" @click="deleteRecord(record.id)" v-if="[0,10,20,40].includes(record.status)">
            删除
          </a>
          <a @click="toDetail(record.id)">拍品列表</a>

          <!--          <a @click="deleteRecord(record.key)" v-auth="`delete`">-->
          <!--            <a-icon type="delete"/>-->
          <!--            删除2-->
          <!--          </a>-->
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle"/>
        </template>
      </standard-table>
    </div>
    <a-modal
        title="新建拍品包"
        :visible="editVisible"
        :confirm-loading="confirmLoading"
        @ok="handleEdit"
        @cancel="handleEditCancel"
    >
      <a-form-model ref="ruleForm"
                    :model="editInfo"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <a-form-model-item label="拍品包名称" prop="name">
          <a-input v-model="editInfo.name" :maxLength='20'></a-input>
        </a-form-model-item>
        <a-form-model-item label="发售时间">
          <a-range-picker
              :value="[editInfo.startTime,editInfo.endTime]"
              :show-time="{ format: 'HH:mm' }"
              format="YYYY-MM-DD HH:mm"
              :placeholder="['开始时间', '结束时间']"
              @change="onDateChange"
              @ok="onOk"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'

const columns = [
  {
    title: '拍品包',
    dataIndex: 'name',
    align:'center',
    scopedSlots: {customRender: 'name'}
  },
  {
    title: '发售日期',
    dataIndex: 'startTime',
    scopedSlots: {customRender: 'startTime'}
  },
  {
    title: '资产',
    dataIndex: 'amount',
    scopedSlots: {customRender: 'amount'}
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: {customRender: 'status'}
  },
  {
    title: '操作',
    scopedSlots: {customRender: 'action'}
  }
]

const data2={
  current:1,
  pageSize: 10,
  status:null,
  name:null
};
import {listPackets,editPackets,deletePackets,createPackets,commitPackets} from '@/services/culture'
import {mapMutations} from "vuex";

export default {
  name: 'QueryList',
  components: {StandardTable},
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      rules:{
        name:[{required:'true', message: '请输入', trigger: 'blur'  }],
        startTime:[{required:'true', message: '请选择', trigger: 'change'  }]
      },
      pagination:{
        position:'bottom',
        pageSize: 10,
        current: 1,
        total: 0
      },
      editInfo:{
        startTime:'',
        endTime:'',
        name:''
      },
      editVisible: false,
      confirmLoading: false,
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      loading: true,
      listQuery: this.$form.createForm(this),
      page:{
        current:1,
        pageSize:10
      },
      data:Object.assign({},data2)
    }
  },
  // authorize: {
  //   deleteRecord: 'delete'
  // },
  mounted() {
    this.fetchList();
  },
  watch: {
    '$route': function (){
      //重新新页面的数据信息
      this.fetchList();//重新加载数据
    }
  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    },
    handleStatus(value) {
      switch (value) {
        case 10:
          return '待发布';
        case 20:
          return '审核中';
        case 30:
          return '已发布';
        case 40:
          return '审核失败';
        case 50:
          return '已结束';
      }
    }
  },
  methods: {
    ...mapMutations('account', ['setPacketId']),
    toDetail(id){
      this.setPacketId(id);
      this.$cookies.set('packetId',id);
      console.log(this.$store.state.account.packetId);
      this.$router.push('/culture/detail');
    },
    onDateChange(value, dateString) {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
      this.editInfo.startTime=dateString[0];
      this.editInfo.endTime=dateString[1];
      console.log(this.editInfo);
    },
    confirm(e) {
      console.log(e);
    },
    cancel(e) {
      console.log(e);
    },
    onOk(value) {
      console.log(this.editInfo);
      console.log('onOk: ', value);
    },
    handleEdit(){
      this.confirmLoading = true;
      console.log(this.editInfo)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if(this.editInfo.id){
            editPackets(this.editInfo).then(res=>{
              console.log(res.data);
              if(res.data.code===500){
                this.$message.error(res.data.message);
                return false;
              }else{
                this.$message.success('编辑成功');
                this.fetchList();
              }
            })
          }else{
            createPackets(this.editInfo).then(res=>{
              console.log(res.data);
              if(res.data.code===500){
                this.$message.error(res.data.message);
                return false;
              }else{
                this.$message.success('新建成功');
                this.fetchList();
              }
            })
          }
          this.handleEditCancel();
        } else {
          this.confirmLoading = false;
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleEditCancel(){
      this.editInfo={
        id:null,
        name:null,
        endTime:null,
        startTime:null
      };
      this.confirmLoading=false;
      this.editVisible=false;
      this.fetchList();
    },
    edit(record){
      this.editVisible=true;
      this.editInfo={
        id:record.id,
        name:record.name,
        endTime:record.endTime,
        startTime:record.startTime
      };
      console.log(record);
    },
    reset() {
      this.listQuery.resetFields();
    },
    handleSearch(e) {
      this.loading = true;
      e.preventDefault();
      this.listQuery.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        this.data=Object.assign(this.page,fieldsValue);
        this.fetchList();
        console.log(this.data);
      });
    },
    handleChange(value) {
      this.fetchList();
      console.log(value);
    },
    // callback(key) {
    //   this.loading = true;
    //   this.pagination.current=1;
    //   this.dataSource = [];
    //   if (key == 20) {
    //     this.fetchList();
    //   } else if (key == 10) {
    //     this.fetchList();
    //   } else if (key == 0) {
    //     this.fetchList();
    //   } else if (key == 30) {
    //     this.fetchList();
    //   }
    //   console.log(key);
    // },
    fetchList() {
      console.log(this.data);
      listPackets(this.data).then(res=>{
        console.log(res);
        this.pagination.total=res.data.data.total;
        this.dataSource=res.data.data.list;
        this.loading = false;
      })
      // for (let i = 0; i < 100; i++) {
      //   this.dataSource.push({
      //     key: i,
      //     no: 'NO ' + i,
      //     name: '这是一段描述',
      //     amount:200,
      //     saleAmount:33,
      //     startTime:'2016-09-21  08:50',
      //     endTime:'2016-09-21  08:50',
      //     status: 0
      //   })
      // }
    },
    submitRecord(id){
      console.log(id);
      var that=this;
      let ids=[];
      ids.push(id);
      this.$confirm({
        title: '确认要提交此拍品包吗?',
        centered:true,
        onOk() {
          commitPackets(ids).then(res=>{
            console.log(res);
            // this.dataSource = this.dataSource.filter(item => item.id !== key);
            // this.selectedRows = this.selectedRows.filter(item => item.id !== key);
            that.fetchList();
            if(res.data.code===500){
              that.$message.error(res.data.message);
            }else{
              that.$message.success('提交成功');
            }
          })
        },
        onCancel() {
          console.log('Cancel');
        }
      });
    },
    deleteRecord(key) {
      var that=this;
      let ids=[];
      ids.push(key);
      this.$confirm({
        title: '确认要删除此拍品包吗?',
        okType: 'danger',
        centered:true,
        onOk() {
          deletePackets(ids).then(res=>{
            console.log(res);
            // this.dataSource = this.dataSource.filter(item => item.id !== key);
            // this.selectedRows = this.selectedRows.filter(item => item.id !== key);
            that.fetchList();
            if(res.data.code===500){
              that.$message.error(res.data.message);
            }else{
              that.$message.success('删除成功');
            }
          })
        },
        onCancel() {
          console.log('Cancel');
        }
      });
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    remove() {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.selectedRows = []
    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange(page) {
      this.pagination.current=page.current;
      this.data.current=page.current;
      this.fetchList();
      console.log(this.data);
    },
    onSelectChange() {
    },
    addNew() {
      this.editVisible=true;
    },
    handleMenuClick(e) {
      if (e.key === 'delete') {
        this.remove()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
