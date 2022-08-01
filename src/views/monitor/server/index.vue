<template>
  <div style="padding-left: 10px" >

    <el-select v-model="selectedAccount" placeholder="请选择账户" @change="getLogs">
      <el-option
        v-for="(item, index) in accounts"
        :key="index"
        :label="item"
        :value="item">
      </el-option>
    </el-select>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column label="请求地址" align="center" prop="uri" key="uri"/>
      <el-table-column label="请求方法" align="center" width="150" prop="method"></el-table-column>
      <el-table-column label="参数" align="center" width="150" prop="params"></el-table-column>
      <el-table-column label="用户名" align="center" width="150" prop="username"></el-table-column>
      <el-table-column label="IP地址" align="center" width="150" prop="ip"></el-table-column>
      <el-table-column label="浏览器型号" align="center" width="150" prop="browser"></el-table-column>
      <el-table-column label="操作日期" align="center" width="150" prop="createDate"></el-table-column>
      <el-table-column label="操作说明" align="center" width="150" prop="methodDescribe"></el-table-column>
    </el-table>
  </div>

</template>

<script>
import {listUser, deleteUser, updateUser, addUser} from '@/api/system/user'
import { Message } from 'element-ui'
import { bindRole, getAllRoles, getRoleById, unBindRole } from '@/api/system/role'
import { sysLogList } from '@/api/monitor/operlog'
export default {
  data() {
    return {
      tableData: [],
      queryParam:{
        current:1,
        size:10
      },
      accounts:[],
      selectedAccount:'',
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      // debugger
      listUser(this.queryParam).then(res => {
        if (!res['success']) {
          Message({message:"获取用户数据失败", type:"error", duration:2000});
        }
        else {
          for (const user of res.data['records']) {
            this.accounts.push(user['account']);
          }
        }
      }).catch(err => {
        Message({message:err, type:"error", duration:2000});
      });
    },
    getLogs() {
      sysLogList(this.queryParam, {account:this.selectedAccount}).then(res => {
        if (!res['success']) {
          Message({message:"获取日志数据失败", type:"error", duration:2000});
        }
        else {
          this.tableData = res['data']['records'];
        }
      }).catch(err => {
        Message({message:err, type:"error", duration:2000});
      });
    }
  },

}
</script>

<style scoped>
</style>
