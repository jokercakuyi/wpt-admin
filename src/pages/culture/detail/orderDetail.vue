<template>
  <a-card v-if="info.orderSn">
    <template>
      <a-descriptions title="订单信息">
        <a-descriptions-item label="订单ID">
          {{ info.orderSn }}
        </a-descriptions-item>
        <a-descriptions-item label="支付时间">
          {{ info.paymentTime }}
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          {{ info.status | handleStatus }}
        </a-descriptions-item>
      </a-descriptions>
      <a-divider />
      <a-descriptions title="买家信息">
        <a-descriptions-item label="买家姓名">
          {{ info.receiveName }}
        </a-descriptions-item>
        <a-descriptions-item label="联系电话">
          {{ info.userTel }}
        </a-descriptions-item>
        <a-descriptions-item label="身份证">
          {{ info.identityNumber | filterId }}
        </a-descriptions-item>
      </a-descriptions>
      <a-divider />
      <a-descriptions title="收货信息" v-if="[30].includes(info.status)">
        <a-descriptions-item label="联系人">
          {{ addressInfo.addressName }}
        </a-descriptions-item>
        <a-descriptions-item label="联系电话">
          {{ addressInfo.addressPhone }}
        </a-descriptions-item>
        <a-descriptions-item label="收货地址">
          {{ addressInfo.addressSite }}
        </a-descriptions-item>
      </a-descriptions>
      <a-divider v-if="[30].includes(info.status)" />
      <a-descriptions
        title="物流信息"
        v-if="info.status == 30 && addressInfo.deliveryCode"
      >
        <a-descriptions-item label="快递公司">
          {{ addressInfo.deliveryCode }}
        </a-descriptions-item>
        <a-descriptions-item label="快递单号">
          {{ addressInfo.deliverySn }}
        </a-descriptions-item>
      </a-descriptions>
      <a-divider v-if="info.status == 30 && addressInfo.deliveryCode" />
      <a-descriptions title="拍品信息" :column="1">
        <a-descriptions-item label="">
          <a-table
            :columns="columns"
            :rowKey="
              (record, index) => {
                return index;
              }
            "
            :data-source="info.detailItemParams"
            :pagination="false"
          >
            <span slot="posterUrl" slot-scope="text">
              <img style="width: 50px; heigth: 50px" :src="text" />
            </span>
          </a-table>
        </a-descriptions-item>
      </a-descriptions>
      <!--      <a-divider />-->
    </template>
  </a-card>
</template>

<script>
import { getOrdersDetail, getOrderDelivery } from "@/services/culture";
const columns = [
  {
    title: "拍品图片",
    dataIndex: "posterUrl",
    key: "posterUrl",
    scopedSlots: { customRender: "posterUrl" },
  },
  {
    title: "拍品名称",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
  },
  {
    title: "单价",
    dataIndex: "price",
    key: "price",
    customRender: (text) => "￥" + text,
  },
  {
    title: "数量(件)",
    dataIndex: "productQuantity",
    key: "productQuantity",
  },
  {
    title: "金额",
    dataIndex: "itemPrice",
    key: "itemPrice",
    customRender: (text) => "￥" + text,
  },
];

const columns2 = [
  {
    title: "合计",
    dataIndex: "total",
    key: "total",
    scopedSlots: { customRender: "total" },
  },
  {
    title: "拍品名称",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
  },
  {
    title: "单价",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "数量(件)",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "金额",
    dataIndex: "sale",
    key: "sale",
    customRender: (text) => "￥" + text,
  },
];

export default {
  name: "orderDetail",
  data() {
    return {
      columns,
      id: null,
      info: {},
      addressInfo: {},
      data2: [
        {
          key: "1",
          name: "",
          total: "合计",
          price: "",
          sale: 0,
          amount: 0,
        },
      ],
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getDetail();
  },
  filters: {
    filterId(value) {
      return value.replace(/^(.{4})(?:\d+)(.{4})$/, "$1 **** **** $2");
    },
    handleStatus(value) {
      switch (value) {
        case 20:
          return "已支付";
        case 30:
          return "已提货";
        case 35:
          return "已申请退款";
        case 40:
          return "已退款";
      }
    },
  },
  watch: {
    "$route.query.id"(to, from) {
      //监听路由是否变化
      if (this.$route.path === "/order/detail") {
        //仅在当前页面生效
        if (to != from) {
          console.log(to);
          this.id = to;
          this.data2 = [
            {
              key: "1",
              name: "",
              total: "合计",
              price: "",
              sale: 0,
              amount: 0,
            },
          ];
          this.getDetail();
        }
      }
    },
  },
  methods: {
    getDetail() {
      getOrderDelivery({ orderSn: this.id }).then((res) => {
        console.log(res);
        this.addressInfo = res.data.data;
      });
      getOrdersDetail({ orderSn: this.id }).then((res) => {
        console.log(res.data.data);
        this.info = res.data.data;
        this.info.detailItemParams.forEach((res) => {
          this.data2[0].sale += res.itemPrice;
          this.data2[0].amount += res.productQuantity;
        });
        console.log(this.data2);
      });
    },
    handleFooterShow() {
      return (
        <a-table
          rowKey={Math.random}
          bordered={false}
          pagination={false}
          columns={columns2}
          dataSource={this.data2}
          showHeader={false}
        ></a-table>
      );
    },
  },
};
</script>

<style scoped></style>
