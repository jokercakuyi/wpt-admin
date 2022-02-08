<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form-model :model="listQuery" ref="ruleForm" layout="horizontal"  @submit="handleSearch">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                  label="拍品名称"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-model="listQuery.name"
                         placeholder="请输入"/>
              </a-form-model-item>
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
              <a-button style="margin-left: 8px" @click="reset()">重置</a-button>
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

      </a-form-model>
    </div>
    <div>
            <a-space class="operator">
      <a-button @click="addNew" type="primary" v-if="[10,40].includes(status)">+新建拍品</a-button>
      <a-button @click="handleMenuClick('delete')" type="default" style="margin-left: 10px" v-if="[10,40].includes(status)">批量删除</a-button>
            </a-space>
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
      <standard-table
          :loading="loading"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :selectedRows.sync="selectedRows"
          :rowKey="(record,index)=>{return record.id}"
          @clear="onClear"
          @change="onChange"
          @selectedRowChange="onSelectChange"
      >
        <span slot="posterUrl" slot-scope="{text}">
        <img style="width:50px;heigth:50px" :src="text"/>
      </span>
        <span slot="name" slot-scope="{text}">
          {{text}}
        </span>
        <span slot="amount" slot-scope="{text,record}">
          <a-progress :percent="(record.saleAmount/record.amount)*100" :strokeWidth="10"/>
          ￥{{record.saleAmount}}/{{record.amount}}
        </span>
        <div slot="action" slot-scope="{text, record}">
          <a style="margin-right: 8px"  @click="edit(record)" v-if="[10,40].includes(status)">
            <a-icon type="edit" />
            编辑
          </a>
          <a style="margin-right: 8px" @click="remove2(record)" v-if="[10,40].includes(status)">
            <a-icon type="delete"/>
            删除
          </a>
          <a style="margin-left: 8px" @click="toDetail(record)" v-if="[20,30,50].includes(status)">查看详情</a>

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
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'

const columns = [
  {
    title: '拍品图片',
    dataIndex: 'posterUrl',
    align:'center',
    scopedSlots: {customRender: 'posterUrl'}
  },
  {
    title: '拍品名称',
    dataIndex: 'name',
    scopedSlots: {customRender: 'name'},
    ellipsis: true
  },
  {
    title: '市场价',
    dataIndex: 'evaluationPrice',
    scopedSlots: {customRender: 'evaluationPrice'},
    customRender: (text) => '￥' + text
  },
  {
    title: '售卖价',
    dataIndex: 'price',
    scopedSlots: {customRender: 'price'},
    customRender: (text) => '￥' + text
  },
  {
    title: '库存',
    dataIndex: 'stock',
    scopedSlots: {customRender: 'stock'}
  },
  {
    title: '操作',
    scopedSlots: {customRender: 'action'}
  }
]

const defaultQueryList={
  current:1,
  pageSize: 10,
  status:null,
  packetId:null
}


import {getProducts,deleteProducts} from '@/services/culture'
export default {
  name: 'productDetail',
  components: {StandardTable},
  data() {
    return {
      packetId:null,
      pname:'',
      status:0,
      pagination:{
        position:'bottom',
        pageSize: 10,
        current: 1,
        total: 0
      },
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      loading: true,
      listQuery: Object.assign({},defaultQueryList),
      page:{
        current:1,
        pageSize:10
      }
    }
  },
  // authorize: {
  //   deleteRecord: 'delete'
  // },
  watch: {
    '$route': function (){
      //重新新页面的数据信息
      this.fetchList();//重新加载数据
    },
    '$store.state.account.packetId' (to, from) { //监听路由是否变化
      if(this.$route.path == '/culture/detail'){//仅在当前页面生效
        if(to != from){
          console.log(to);
          this.listQuery.packetId = to;
          this.fetchList();//重新加载数据
        }
      }
    }
  },
  mounted() {
    this.packetId=this.$cookies.get('packetId');
    this.$set(this.listQuery,'packetId',this.packetId);
    // this.listQuery.packetId=this.$route.query.pid
    this.fetchList();
  },
  filters: {
    handleStatus(value) {
      switch (value) {
        case 0:
          return '待发布';
        case 10:
          return '审核中';
        case 20:
          return '已发布';
        case 30:
          return '审核失败';
        case 40:
          return '已结束';
      }
    }
  },
  methods: {
    toDetail(record){
      this.$router.push({path:'/culture/innerDetail',query:{id:record.id}})
    },
    reset() {
      this.listQuery.name='';
    },
    handleSearch() {
      this.fetchList();
    },
    handleChange(value) {
      console.log(value);
    },
    callback(key) {
      this.loading = true;
      this.pagination.current=1;
      this.dataSource = [];
      if (key == 20) {
        this.fetchList();
      } else if (key == 10) {
        this.fetchList();
      } else if (key == 0) {
        this.fetchList();
      } else if (key == 30) {
        this.fetchList();
      }
      console.log(key);
    },
    fetchList() {
      // this.listQuery.packetId=this.$route.query.id;
      getProducts(this.listQuery).then(res=>{
        console.log(res.data.data);
        this.status=res.data.data.status;
        this.pname=res.data.data.name;
        this.pagination.total=res.data.data.productLists.total;
        this.dataSource=res.data.data.productLists.list;
        this.loading = false;
      })
    },
    deleteRecord(key) {
      this.dataSource = this.dataSource.filter(item => item.key !== key)
      this.selectedRows = this.selectedRows.filter(item => item.key !== key)
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    remove() {
      var that=this;
      let ids=[];
      this.selectedRows.forEach(item=>{
        ids.push(item.id);
      })
      this.$confirm({
        title: '确认要删除此拍品吗?',
        okType: 'danger',
        centered:true,
        onOk() {
          deleteProducts(ids).then(res=>{
            console.log(res);
            if(res.data.code===500){
              that.$message.error(res.data.message)
              return false;
            }
            that.$message.success('删除成功');
            that.dataSource = that.dataSource.filter(item => that.selectedRows.findIndex(row => row.id === item.id) === -1)
            that.selectedRows = [];
            that.fetchList();
          })
        },
        onCancel() {
          console.log('Cancel');
        }
      });

    },
    remove2(id) {
      var that=this;
      let ids=[];
      ids.push(id.id);
      this.$confirm({
        title: '确认要删除此拍品吗?',
        okType: 'danger',
        centered:true,
        onOk() {
          deleteProducts(ids).then(res=>{
            console.log(res);
            if(res.data.code===500){
              that.$message.error(res.data.message)
              return false;
            }
            that.$message.success('删除成功');
            that.dataSource = that.dataSource.filter(item => that.selectedRows.findIndex(row => row.id === item.id) === -1)
            that.selectedRows = []
            that.fetchList();
          })
        },
        onCancel() {
          console.log('Cancel');
        }
      });
    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange(page) {
      this.pagination.current=page.current;
      this.listQuery.current=page.current;
      this.fetchList();
      console.log(this.data);
      this.$message.info('表格状态改变了')
    },
    onSelectChange() {
      console.log(this.selectedRows);
    },
    addNew() {
      this.$router.push({path:'/culture/add',query:{id:this.$route.query.id,name:this.pname}});
    },
    edit(record){
      this.$router.push({path:'/culture/add',query:{id:this.$route.query.id,productId:record.id,name:this.pname}});
    },
    handleMenuClick(e) {
      if (e === 'delete') {
        this.remove()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 14px;
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
