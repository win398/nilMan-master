<template>
  <div class="userlist">
    <el-table :data="tableData">
      <el-table-column prop="uid" label="编号" width="100"></el-table-column>
      <el-table-column prop="userName" label="用户名" width="150"></el-table-column>
      <el-table-column prop="phoneNum" label="手机号" width="200"></el-table-column>
      <el-table-column label="注册时间" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{
             scope.row.registerTime
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户类型"
        width="150">
        <template slot-scope="scope">          
          <span style="margin-left: 10px" v-if="scope.row.type==2">管理员用户</span>
          <span style="margin-left: 10px" v-else-if="scope.row.type==1">普通用户</span>
          <span style="margin-left: 10px" v-else-if="scope.row.type==0">封禁用户</span>
          <span style="margin-left: 10px" v-else>未知用户</span>
        </template>
      </el-table-column>
      <el-table-column
        label="头像"
        width="150">
        <template slot-scope="scope">          
          <el-avatar :size="50" :src="picIp+scope.row.header"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="signature" label="个性签名" width="300"></el-table-column>
      <el-table-column prop="sex" label="性别" width="100"></el-table-column>
      <el-table-column prop="birth" label="出生日期" width="300"></el-table-column>
      <el-table-column prop="province" label="省" width="150"></el-table-column>
      <el-table-column prop="city" label="市" width="150"></el-table-column>
      <el-table-column fixed="right" width="150">
        <template #header>
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" @keyup.enter.native="searchUser(search)"/>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleSave(scope.$index, scope.row)"
            >导出</el-button
          >
          <el-button size="mini" type="danger" @click="handleForbid(scope.row)" v-if="scope.row.type==1"
            >禁用</el-button
          >
          <el-button size="mini" type="primary" @click="handleForbid(scope.row)" v-if="scope.row.type==0"
            >解禁</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="page-bottom">
      <el-pagination
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
      <download-excel
            class = "export-excel-wrapper"
            :data = "tableData"
            :fields = "json_fields"
            name = "userlist.xls">
            <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
            <el-button type="primary" size="large">导出当前页为EXCEL</el-button>
      </download-excel>
    </div>
    
  </div>
</template>

<script>
import docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'
import ImageModule from 'docxtemplater-image-module-free'
import store from '../../store/index'
export default {
  name: 'UserList',
  data () {
    return {
      picIp: "http://175.24.179.240:8085/npic/",
      tableData:[],
      json_fields: {
        "用户编号": "uid", 
        "用户名": "userName",
        "手机号": "phoneNum",
        "注册时间": "registerTime", 
        "性别": "sex", 
        "生日": "birth", 
        "省": "province", 
        "市": "city", 
        "个性签名": "signature", 
        "用户类型": {
        field: "type",
        //自定义回调函数
          callback: type => {
            switch (type) {
              case 1:
                return "普通用户";
              case 2:
                return "管理员用户";
              case 0:
                return "封禁用户";
              default:
                return "未知用户";
            }        
          }
        }
      },
      pageSize:10,//每页显示条目个数
      search: "",
      pageCount:10,//总页数
      total:100,//总条目数
      currentPage:1,//当前页数
      token: store.state.LoginModule.userinfo.token,
    }
  }, 
  created() {
    this.getList();
  },
  methods: {
    getList(){
      this.axios.get("user/getUserList?current="+this.currentPage+"&size="+this.pageSize, {
          headers: {
            'token': this.token,
          }
      }).then(response=>{
        this.tableData=response.data.records;
        this.pageCount=response.data.pages;
        this.total=response.data.total;
      })
    },
    handleSave(index, row) {
      console.log(row);
      switch (row.type) {
        case 1:
          row.typeName = "普通用户";
          break;
        case 2:
          row.typeName = "管理员用户";
          break;
        case 0:
          row.typeName = "封禁用户";
          break;
        default:
          row.typeName = "未知用户";
          break;
      }
      row.userImage = this.picIp+row.header;
      // 读取并获得模板文件的二进制内容
      JSZipUtils.getBinaryContent("../../../static/user.docx", function(error, content) {
        // model.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
        // 抛出异常
        if (error) {
          throw error;
        }
        var opts = {}
        opts.centered = false;
        opts.getImage = function (tagValue, tagName) {
          return new Promise(function (resolve, reject) {
            JSZipUtils.getBinaryContent(tagValue, function (error, content) {
              if (error) {
                return reject(error);
              }
              return resolve(content);
            });
          });
        }
        opts.getSize = function (img, tagValue, tagName) {
            return [50, 50];//图片大小 
        }
        var imageModule = new ImageModule(opts);
        // 创建一个PizZip实例，内容为模板的内容
        var zip = new PizZip(content);
        var doc = new docxtemplater()
          .loadZip(zip)
          .attachModule(imageModule)
          .compile();
        doc.resolveData(row).then(function () {
          doc.render();
          var out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          //输出文档
          saveAs(out, row.userName+"_Info.docx");
        })
      });
    },
    handleForbid(row) {  
      //console.log(row);
      this.axios.post("user/disableUser", {
          uid: row.uid,
          type: row.type,
        },{
          headers: {
            'token':  this.token,
          }
        }).then(res=>{
        if (res.data != null && row.type != res.data.type) {
          row.type=res.data.type;
          this.$message.success('操作成功！');
        } else {
          this.$message.fail('操作失败！');
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    changePage(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },
    searchUser(val) {
      this.currentPage = 1;
      this.axios.get("user/searchUser?keyword=" + val + "&current="+ this.currentPage +"&size=" + this.pageSize, {
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

<style scoped>
.userlist {
  padding-top: 16px;
}
.el-pagination {
  padding-top: 40px;
  padding-bottom: 60px;
  text-align: center;
}
.page-bottom {
  position: relative;
}
.export-excel-wrapper {
  position: absolute;
  right: 20px;
  bottom: 60px;
}
</style>