<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form-model layout="horizontal" :form="listQuery">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                  label="订单编号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-model="listQuery.orderSn" placeholder="请输入订单编号"/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                  label="拍品名称"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-model="listQuery.productName" placeholder="请输入拍品名称"/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="订单时间" :labelCol="{span: 5}"
                           :wrapperCol="{span:15, offset: 1}">
                <a-range-picker @change="onDateChange" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-model-item
                  label="买家姓名"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-model="listQuery.userName" placeholder="请输入买家姓名"/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                  label="手机号码"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-model="listQuery.userTel" placeholder="请输入手机号码"/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                  label="状态"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-select style="width: 120px" v-model="listQuery.status" @change="fetchList">
                  <a-select-option value='0'>
                    全部
                  </a-select-option>
                  <a-select-option value='30'>
                    已提货
                  </a-select-option>
                  <a-select-option value='40'>
                    已退款
                  </a-select-option>
                  <a-select-option value='20'>
                    已支付
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
      <span style="float: right;margin-top: 7px">
          <a-button type="primary" @click="fetchList">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
                  <a @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? '收起' : '展开' }}
                    <a-icon :type="advanced ? 'up' : 'down'"/>
                  </a>
        </span>
    </div>
    <div>
      <a-space class="operator">
        <a-button  type="primary" @click="exportDataMethod">导出报表</a-button>
      </a-space>
      <standard-table
          :pagination="pagination"
          :loading="loading"
          :columns="columns"
          :dataSource="dataSource"
          :selectedRows.sync="selectedRows"
          :rowKey="(record,index)=>{return record.orderSn}"
          @clear="onClear"
          @change="onChange"
          @selectedRowChange="onSelectChange"
      >
        <span slot="name" slot-scope="{text}">
          {{ text }}
        </span>
        <span slot="detail" slot-scope="{text,record}">
          {{ record.userName }}
          {{ record.userTel }}
        </span>
        <span slot="status" slot-scope="{text}">
          {{ text|handleStatus }}
        </span>
        <div slot="action" slot-scope="{text, record}">
          <a style="margin-right: 8px" @click="edit(record.orderSn)">
            查看详情
          </a>
          <a @click="pickOrder(record.orderSn)" v-if="record.status===20">
            提货
          </a>
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
import {getOrders,pickOrder} from '@/services/culture'
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'
const defaultQueryList={
  orderSn:null,
  productName:null,
  pageSize:10,
  current:1,
  status:'0',
  userName:null,
  userTel:null,
  startTime:null,
  endTime:null
};
const columns = [
  {
    title: '订单编号',
    dataIndex: 'orderSn'
  },
  {
    title: '拍品名称',
    dataIndex: 'productName',
    scopedSlots: {customRender: 'name'}
  },
  {
    title: '件数',
    dataIndex: 'productQuantity',
    align: 'center',
    customRender: (text) =>  text+' 个'
  },
  {
    title: '拍品单价',
    dataIndex: 'productSinglePrice',
    align: 'center',
    customRender: (text) => '￥' + text
  },
  {
    title: '总金额',
    dataIndex: 'payAmount',
    align: 'center',
    customRender: (text) => '￥' + text
  },
  {
    title: '买家信息',
    dataIndex: 'detail',
    align: 'center',
    scopedSlots: {customRender: 'detail'}
  },
  {
    title: '支付时间',
    dataIndex: 'paymentTime',
    align: 'center'
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


export default {
  name: 'QueryList',
  components: {StandardTable},
  data() {
    return {
      pagination:{
        position:'bottom',
        pageSize: 10,
        current: 1,
        total: 0
      },
      listQuery:Object.assign({},defaultQueryList),
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      loading: true
    }
  },
  // authorize: {
  //   deleteRecord: 'delete'
  // },
  mounted() {
    this.fetchList();
  },
  filters: {
    handleStatus(value) {
      switch (value) {
        case 10:
          return '待付款';
        case 20:
          return '已支付';
        case 30:
          return '已提货';
        case 40:
          return '已退款';
      }
    }
  },
  methods: {
    exportDataMethod() {
      if (this.selectedRows == null || this.selectedRows.length < 1) {
        this.$message.error('请选择订单');
        return;
      }
      var that = this;
      require.ensure([], () => {
        const {export_json_to_excel} = require('../../../utils/Export2Excel'); //这里必须使用绝对路径
        const tHeader = ['订单编号', '商品名', '提货人', '提货人手机号',  '付款金额', '支付时间']; // 导出的表头名
        const filterVal = ['orderSn', 'productName', 'userName', 'userTel',  'payAmount', 'paymentTime']; // 导出的表头字段名
        const list = that.selectedRows;
        const data = that.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '1');// 导出的表格名称，根据需要自己命名
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    pickOrder(sn){
      var that=this;
      let orderSns=[];
      orderSns.push(sn);
      this.$confirm({
        title: '是否确认提货？',
        content: '',
        onOk() {
          pickOrder(orderSns).then(res=>{
            that.$message.success('提货成功');
            that.fetchList();
            console.log(res);
          })
        },
        onCancel() {

        },
      });

    },
    edit(sn){
      this.$router.push({path:'/order/detail',query:{id:sn}});
    },
    reset(){
      this.listQuery=Object.assign({},defaultQueryList);
    },
    onDateChange(value, dateString) {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
      this.listQuery.startTime=dateString[0];
      this.listQuery.endTime=dateString[1];
      console.log(this.listQuery);
    },
    callback(key) {
      this.loading = true;
      this.dataSource = [];
      if (key == 1) {
        this.fetchList();
      } else if (key == 2) {
        this.fetchList();
      } else if (key == 3) {
        this.fetchList();
      } else if (key == 4) {
        this.fetchList();
      }

      console.log(key);
    },
    fetchList() {
      this.loading=true;
      getOrders(this.listQuery).then(res=>{
        console.log(res);
        this.dataSource=res.data.data.list;
        this.pagination.total=res.data.data.total;
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
      this.listQuery.current=page.current;
      this.fetchList();

    },
    onSelectChange() {
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
  width: calc(100%);
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
