<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form-model layout="horizontal" :form="listQuery">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="订单编号"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="listQuery.orderSn"
                  placeholder="请输入订单编号"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="拍品名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="listQuery.productName"
                  placeholder="请输入拍品名称"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="订单时间"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 15, offset: 1 }"
              >
                <a-range-picker @change="onDateChange" :value="createValue" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="买家姓名"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="listQuery.userName"
                  placeholder="请输入买家姓名"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="手机号码"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="listQuery.userTel"
                  placeholder="请输入手机号码"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item
                label="状态"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-select
                  style="width: 120px"
                  v-model="listQuery.status"
                  @change="fetchList"
                >
                  <a-select-option value="0"> 全部 </a-select-option>
                  <a-select-option value="30"> 已提货 </a-select-option>
                  <a-select-option value="40"> 已退款 </a-select-option>
                  <a-select-option value="20"> 已支付 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
      <span style="float: right; margin-top: 7px">
        <a-button type="primary" @click="fetchList">查询</a-button>
        <a-button style="margin-left: 8px" @click="reset">重置</a-button>
        <a @click="toggleAdvanced" style="margin-left: 8px">
          {{ advanced ? "收起" : "展开" }}
          <a-icon :type="advanced ? 'up' : 'down'" />
        </a>
      </span>
    </div>
    <div>
      <a-space class="operator">
        <a-button type="primary" @click="exportDataMethod">导出报表</a-button>
      </a-space>
      <standard-table
        :pagination="pagination"
        :loading="loading"
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows.sync="selectedRows"
        :rowKey="
          (record, index) => {
            return record.orderSn;
          }
        "
        @clear="onClear"
        @change="onChange"
        @selectedRowChange="onSelectChange"
      >
        <span slot="name" slot-scope="{ text }">
          {{ text }}
        </span>
        <span slot="detail" slot-scope="{ text, record }">
          {{ record.userName }}
          {{ record.userTel }}
        </span>
        <span slot="status" slot-scope="{ text }">
          {{ text | handleStatus }}
        </span>
        <div slot="action" slot-scope="{ text, record }">
          <a style="margin-right: 8px" @click="edit(record.orderSn)">
            查看详情
          </a>
          <!-- <a @click="pickOrder(record.orderSn)" v-if="record.status===20">
            提货
          </a> -->
          <a
            @click="openSendForm(record.orderSn)"
            v-if="record.status === 30 && !record.deliverySn"
          >
            设置物流
          </a>
          <a-modal
            :visible="logisticsVisible"
            title="设置物流"
            @ok="pickOrder"
            @cancel="logisticsVisible = false"
          >
            <a-form-model
              ref="ruleForm"
              :model="sendForm"
              :rules="sendRules"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-form-model-item prop="deliveryCode" label="快递公司">
                <a-select
                  v-model="sendForm.deliveryCode"
                  show-search
                  placeholder="请选择快递公司"
                >
                  <a-select-option
                    :key="index"
                    :value="item.code"
                    v-for="(item, index) in logisticsList"
                  >
                    {{ item.companyName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="快递单号" prop="deliverySn">
                <a-input
                  v-model="sendForm.deliverySn"
                  placeholder="请输入快递单号"
                  :maxLength="30"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item label="收货人">
                {{ addressInfo.addressName }}
              </a-form-model-item>
              <a-form-model-item label="手机号">
                {{ addressInfo.addressPhone }}
              </a-form-model-item>
              <a-form-model-item label="收货地址">
                {{ addressInfo.addressSite }}
              </a-form-model-item>
              <a-form-model-item label="订单号">
                {{ addressInfo.orderSn }}
              </a-form-model-item>
            </a-form-model>
          </a-modal>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getOrders, getOrderDelivery, deliverGoods } from "@/services/culture";
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'
const defaultQueryList = {
  orderSn: null,
  productName: null,
  pageSize: 10,
  pageIndex: 1,
  status: "0",
  userName: null,
  userTel: null,
  startTime: null,
  endTime: null,
};
const columns = [
  {
    title: "订单编号",
    dataIndex: "orderSn",
  },
  {
    title: "拍品名称",
    dataIndex: "productName",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "件数",
    dataIndex: "productQuantity",
    align: "center",
    customRender: (text) => text + " 个",
  },
  {
    title: "拍品单价",
    dataIndex: "productSinglePrice",
    align: "center",
    customRender: (text) => "￥" + text/100,
  },
  {
    title: "总金额",
    dataIndex: "payAmount",
    align: "center",
    customRender: (text) => "￥" + text/100,
  },
  {
    title: "买家信息",
    dataIndex: "detail",
    align: "center",
    scopedSlots: { customRender: "detail" },
  },
  {
    title: "支付时间",
    dataIndex: "paymentTime",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
const defaultSendForm = {
  deliveryCode: "yuantong",
  deliverySn: "",
};
export default {
  name: "QueryList",
  components: { StandardTable },
  data() {
    return {
      sendRules: {
        deliveryCode: [
          { required: true, message: "请选择快递公司", trigger: "change" },
        ],
        deliverySn: [
          { required: true, message: "请输入快递单号", trigger: "blur" },
        ],
      },
      sendForm: Object.assign({}, defaultSendForm),
      addressInfo: {},
      logisticsList: [
        {
          code: "yuantong",
          companyName: "圆通速递",
        },
        {
          code: "yunda",
          companyName: "韵达快递",
        },
        {
          code: "zhongtong",
          companyName: "中通快递",
        },
        {
          code: "huitongkuaidi",
          companyName: "百世快递",
        },
        {
          code: "shentong",
          companyName: "申通快递",
        },
        {
          code: "shunfeng",
          companyName: "顺丰速运",
        },
        {
          code: "youzhengguonei",
          companyName: "邮政快递包裹",
        },
        {
          code: "jd",
          companyName: "京东物流",
        },
        {
          code: "ems",
          companyName: "EMS",
        },
        {
          code: "jtexpress",
          companyName: "极兔速递",
        },
        {
          code: "youzhengbk",
          companyName: "邮政标准快递",
        },
        {
          code: "debangwuliu",
          companyName: "德邦",
        },
        {
          code: "debangkuaidi",
          companyName: "德邦快递",
        },
        {
          code: "zhaijisong",
          companyName: "宅急送",
        },
        {
          code: "youshuwuliu",
          companyName: "优速快递",
        },
        {
          code: "yuantongkuaiyun",
          companyName: "圆通快运",
        },
        {
          code: "baishiwuliu",
          companyName: "百世快运",
        },
        {
          code: "zhongyouex",
          companyName: "众邮快递",
        },
        {
          code: "zhongtongkuaiyun",
          companyName: "中通快运",
        },
        {
          code: "shunfengkuaiyun",
          companyName: "顺丰快运",
        },
      ],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      logisticsVisible: false,
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "10000"],
        position: "bottom",
        pageSize: 10,
        start: 1,
        total: 0,
        onShowSizeChange: (start, pageSize) =>
          (this.listQuery.pageSize = pageSize),
      },
      createValue: null,
      listQuery: Object.assign({}, defaultQueryList),
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      loading: true,
    };
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
          return "待付款";
        case 20:
          return "已支付";
        case 30:
          return "已提货";
        case 40:
          return "已退款";
      }
    },
  },
  methods: {
    openSendForm(sn) {
      this.sendForm = Object.assign({}, defaultSendForm);
      getOrderDelivery({ orderSn: sn }).then((res) => {
        this.addressInfo = res.data.data;
        console.log(this.addressInfo);
        if (this.addressInfo.deliverySn) {
          this.$message.error("已设置物流");
        } else {
          this.logisticsVisible = true;
        }
      });
    },
    exportDataMethod() {
      if (this.selectedRows == null || this.selectedRows.length < 1) {
        this.$message.error("请选择订单");
        return;
      }
      var that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../../utils/Export2Excel"); //这里必须使用绝对路径
        const tHeader = [
          "订单编号",
          "商品名",
          "提货人",
          "提货人手机号",
          "付款金额",
          "支付时间",
        ]; // 导出的表头名
        const filterVal = [
          "orderSn",
          "productName",
          "userName",
          "userTel",
          "payAmount",
          "paymentTime",
        ]; // 导出的表头字段名
        const list = that.selectedRows;
        const data = that.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "1"); // 导出的表格名称，根据需要自己命名
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    pickOrder() {
      var that = this;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$confirm({
            title: "是否发货？",
            content: "",
            onOk() {
              console.log(that.sendForm);
              deliverGoods({
                orderSn: that.addressInfo.orderSn,
                deliverySn: that.sendForm.deliverySn,
                deliveryCode: that.sendForm.deliveryCode,
              }).then((res) => {
                console.log(res);
                that.$message.success("提货成功");
                that.logisticsVisible = false;
                that.fetchList();
              });
              // pickOrder(orderSns).then((res) => {
              //   that.fetchList();
              //   console.log(res);
              // });
            },
            onCancel() {},
          });
        }
      });
    },
    edit(sn) {
      this.$router.push({ path: "/order/detail", query: { id: sn } });
    },
    reset() {
      this.createValue = null;
      this.listQuery = Object.assign({}, defaultQueryList);
    },
    onDateChange(value, dateString) {
      console.log("Selected Time: ", value);
      console.log("Formatted Selected Time: ", dateString);
      this.createValue = value;
      this.listQuery.startTime = dateString[0];
      this.listQuery.endTime = dateString[1];
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
      console.log(this.$store.state.account.userName);
      console.log(localStorage.getItem(process.env.VUE_APP_NAME_KEY));
      const userName = localStorage.getItem(process.env.VUE_APP_NAME_KEY);
      this.listQuery.admin = JSON.parse(userName);
      this.loading = true;
      getOrders(this.listQuery).then((res) => {
        console.log(res);
        this.dataSource = res.data.data.list;
        this.pagination.total = res.data.data.total;
        this.loading = false;
      });
    },
    deleteRecord(key) {
      this.dataSource = this.dataSource.filter((item) => item.key !== key);
      this.selectedRows = this.selectedRows.filter((item) => item.key !== key);
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    remove() {
      this.dataSource = this.dataSource.filter(
        (item) =>
          this.selectedRows.findIndex((row) => row.key === item.key) === -1
      );
      this.selectedRows = [];
    },
    onClear() {
      this.$message.info("您清空了勾选的所有行");
    },
    onStatusTitleClick() {
      this.$message.info("你点击了状态栏表头");
    },
    onChange(page) {
      this.pagination.start = page.current;
      this.listQuery.pageIndex = page.current;
      this.fetchList();
    },
    onSelectChange() {},
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100%);
  display: inline-block;
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
