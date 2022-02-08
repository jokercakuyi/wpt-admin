<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form-model layout="inline" :model="listQuery" style="margin-bottom: 20px">
        <a-form-model-item label="资讯标题">
          <a-input v-model="listQuery.title" placeholder="请输入">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select style="width: 120px" v-model="listQuery.status" @change="fetchList">
            <a-select-option value='0'>
              全部
            </a-select-option>
            <a-select-option value='10'>
              未发布
            </a-select-option>
            <a-select-option value='20'>
              已发布
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-button
              type="primary"
              @click="onSubmit()"
          >
            查询
          </a-button>
          <a-button
              type="default"
              @click="reset()"
              style="margin-left: 10px"
          >
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
      <div style="margin-bottom: 20px">
        <a-button type="primary" @click="addNews">+新建资讯</a-button>
        <a-button type="default" style="margin-left: 10px;" @click="deleteNews(selectedRows)">删除选择</a-button>
      </div>
      <standard-table :columns="columns" :data-source="data"
                      :pagination="pagination"
                      :loading="loading"
                      :selectedRows.sync="selectedRows"
                      :rowKey="record => record.id"
                      @selectedRowChange="onSelectChange"
                      @clear="onClear"
                      @change="onChange">
        <span slot="status" slot-scope="{text,record}">
          {{record.status|handleStatus}}
        </span>
        <span slot="action" slot-scope="{text, record}">
          <a style="margin-right: 8px" @click="handleSubmit(record.id)" v-if="[10,5,30].includes(record.status)">发布</a>
          <a style="margin-right: 8px" @click="handleReback(record.id)" v-if="record.status===20">撤回</a>
          <a style="margin-right: 8px" @click="handleEdit(record.id)" v-if="[10,5,30].includes(record.status)">编辑</a>
          <a style="margin-right: 8px" @click="handleDelete(record.id)">删除</a>
        </span>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import {getNews,rebackNews, releaseNews,deleteNews} from '@/services/culture'
const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    width: 300
  },
  {
    title: '浏览量',
    dataIndex: 'browserNum',
    key: 'browserNum',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: {customRender: 'status'}
  },
  {
    title: '发布时间',
    key: 'passTime',
    dataIndex: 'passTime'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'},
  },
];
const defaultListQuery = {
  current: 1,
  pageSize: 10,
  title: null,
  status: '0'
}
export default {
  name: "articleList",
  data() {
    return {
      pagination:{
        position:'bottom',
        pageSize: 10,
        current: 1,
        total: 0
      },
      listQuery:Object.assign({},defaultListQuery),
      advanced: true,
      formInline: Object.assign({}, defaultListQuery),
      columns,
      data:[],
      selectedRows: [],
      loading:true
    }
  },
  components:{StandardTable},
  filters:{
    handleStatus(value){
      switch (value){
        case 5:
          return '未发布';
        case 10:
          return '未发布';
        case 20:
          return '已发布';
        case 30:
          return '未发布';
      }
    }
  },
  mounted() {
    this.fetchList();
  },
  watch: {
    '$route': function (){
      //重新新页面的数据信息
      this.fetchList();//重新加载数据
    }
  },
  methods: {
    addNews(){
      this.$openPage('/article/add');
    },
    deleteNews(selectRow){
      var that=this;
      let ids=[];
      selectRow.forEach(item=>{
        ids.push(item.id);
      });
      console.log(ids.length);
      if(ids.length===0){
        this.$message.warn('请先选择要删除的选项');
        return false;
      }
      this.$confirm({
        title: '确认要删除此资讯吗?',
        okType: 'danger',
        centered:true,
        onOk() {
          deleteNews(ids).then(res=>{
            that.$message.success('删除成功');
            that.selectedRows=[];
            console.log(res);
            that.fetchList();
          })
        },
        onCancel() {
          console.log('Cancel');
        }
      });
    },
    handleSubmit(id){
      var that=this;
      let ids=[];
      ids.push(id);
      this.$confirm({
        title: '确认要发布吗?',
        centered:true,
        onOk() {
          releaseNews(ids).then(res=>{
            console.log(res);
            that.$message.success('发布成功');
            that.fetchList();
          })
        },
        onCancel() {
          console.log('Cancel');
        }
      });
    },
    handleReback(id){
      var that =this;
      let ids=[];
      ids.push(id);
      this.$confirm({
        title: '确认要撤回吗?',
        centered:true,
        onOk() {
          rebackNews(ids).then(res=>{
            that.$message.success('撤回成功');
            that.fetchList();
            console.log(res);
          })
        },
        onCancel() {
          console.log('Cancel');
        }
      });
    },
    handleEdit(id){
      this.$router.push({path:'/article/add',query:{id:id}})
      // window.location='https://apitest.equnshang.com/equnshang/culture/article?id='+id;
      console.log(id);
    },
    handleDelete(id){
      var that=this;
      let ids=[];
      ids.push(id);
      this.$confirm({
        title: '确认要删除此资讯吗?',
        okType: 'danger',
        centered:true,
        onOk() {
          deleteNews(ids).then(res=>{
            if(res.data.code===500){
              that.$message.error(res.data.message);
            }else{
              that.$message.success('删除成功');
            }
            that.fetchList();
            console.log(res);
          })
        },
        onCancel() {
          console.log('Cancel');
        }
      });

      console.log(id);
    },
    fetchList(){
      this.loading=true;
      getNews(this.listQuery).then(res=>{
        this.data=res.data.data.list;
        this.pagination.total=res.data.data.total;
        this.loading=false;
        console.log(res);
      })
    },
    onSubmit() {
      this.fetchList();
      console.log(this.formInline);
    },
    reset() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onChange(page) {
      this.pagination.current=page.current;
      this.listQuery.current=page.current;
      this.fetchList();
    },
    onSelectChange() {
      console.log(this.selectedRows);
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
</style>
