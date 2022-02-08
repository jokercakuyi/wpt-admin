<template>
  <a-card>
    <a-button type="primary" @click="handleEdit(0)">+新建自提点</a-button>
  <a-table @change="onChange" :pagination="pagination" :columns="columns" :data-source="data" :loading="loading" :rowKey="(record,index)=>{return index}" style="margin-top: 10px">
    <a slot="name" slot-scope="text">{{ text }}</a>
    <span slot="action" slot-scope="text, record">
      <a style="margin-right: 8px" @click="handleEdit(record.id)">
            <a-icon type="edit"/>
            编辑
          </a>
          <a style="margin-right: 8px" @click="handleDelete(record.id)">
            <a-icon type="delete"/>
            删除
          </a>
    </span>
  </a-table>

  </a-card>
</template>
<script>

const columns = [
  {
    title: '自提点',
    dataIndex: 'signName',
    key: 'signName',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '联系人',
    dataIndex: 'name',
    key: 'name',
    width: 80,
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
    ellipsis: true,
  },
  {
    title: '自提地址',
    dataIndex: 'site',
    key: 'site',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  },
];

const defaultQueryList={
  current:1,
  pageSize: 10
};
import {getCompanyAddress,deleteCompanyAddress} from '@/services/culture'
export default {
  data() {
    return {
      pagination:{
        position:'bottom',
        pageSize: 10,
        current: 1,
        total: 0
      },
      listQuery:Object.assign({},defaultQueryList),
      data:[],
      columns,
      loading:true
    }
  },
  mounted() {
    this.fetchList();
  },
  watch: {
    $route(to, from) {
      console.log(to,from);
      if (this.$route.query.type) {
        this.fetchList();
      }
    }
  },
  methods:{
    onChange(page) {
      this.pagination.current=page.current;
      this.listQuery.current=page.current;
      this.fetchList();
    },
    handleEdit(scope){
      console.log(scope)
      if(scope==0&&this.pagination.total>=5){
        this.$message.warn('自提点已超上限(5个)');
        return false;
      }
      this.$router.push({path:'/setting/add',query:{id:scope}});
    },
    fetchList(){
      this.loading=true;
      getCompanyAddress(this.listQuery).then(res=>{
        console.log(res);
        this.data=res.data.data.list;
        this.pagination.total=res.data.data.total;
        this.loading=false;
      })
    },
    handleDelete(scope){
      var that=this;
      let ids=[];
      ids.push(scope);
      console.log(scope)
        this.$confirm({
          centered:true,
          title: '确认要删除此提货点吗',
          content: '',
          onOk() {
            deleteCompanyAddress(ids).then(res=>{
              console.log(res);
              that.$message.success('删除成功');
              that.fetchList();
            })
          },
          onCancel() {},
        });
    }
  }
};
</script>
