<template>
  <div class="logs">
    <div class="search">
      <el-input
        placeholder="请输入搜索内容"
        v-model="input"
        clearable
        @keyup.enter.native="searchLog(input)">
      </el-input>
      <el-button type="primary" plain @click="searchLog(input)">搜索</el-button>
    </div>
    <el-table :data="tableData">
      <el-table-column prop="logId" label="编号" width="100"></el-table-column>
      <el-table-column label="记录时间" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{
              scope.row.logTime
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="logContent" label="日志内容" width="500"></el-table-column>
      <el-table-column prop="uid" label="用户编号" width="100"></el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 10px"
      :page-size="pageSize"
      :page-count="pageCount"
      :current-page="currentPage"
      layout="sizes, prev, pager, next"
      :total="total"
      @current-change="changePage"
      @size-change="handleSizeChange"
      :page-sizes="[5, 10, 20]"
    >
    </el-pagination>
  </div>
</template>

<script>
import store from '../../store/index'
export default {
  data() {
    return {
      input: '',
      tableData: [],
      pageSize: 10, //每页显示个数
      pageCount: 10, //总页数
      total: 100, //总条目数
      currentPage: 1, //当前页
      picIp: "http://175.24.179.240:8085/npic/",
      token: store.state.LoginModule.userinfo.token,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    getList() {
      this.axios
        .get(
          "log/getLogs?current=" +
          this.currentPage +
          "&size=" +
          this.pageSize, {
          headers: {
            'token':  this.token,
          }
      }
        )
        .then((response) => {
          this.tableData = response.data.records;
          this.pageCount = response.data.pages;
          this.total = response.data.total;
        });
    },
    changePage(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },
    searchLog(val) {
      this.currentPage = 1;
      this.axios.get("log/searchLog?keyword=" + val + "&current="+ this.currentPage +"&size=" + this.pageSize, {
          headers: {
            'token':  this.token,
          }
      }).then (response => {
        this.tableData=response.data.records;
        this.pageCount=response.data.pages;
        this.total=response.data.total;
      })
    }
  }
}
</script>

<style scoped lang="less">
.logs {
  text-align: center;
}
.search {
  display: flex;
  margin: 20px;
  padding-left: 20px;
  padding-right: 20px;
  .el-button {
    margin-left: 10px;
  }
}
</style>