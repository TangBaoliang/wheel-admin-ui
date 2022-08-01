<template>
  <div style="padding-left: 10px" >
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>服务数据</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="getData">刷新</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column label="类名" align="center" prop="clazzName"/>
        <el-table-column label="群组group" align="center" prop="group"></el-table-column>
        <el-table-column label="ip地址和端口" align="center" prop="ipAndPort"></el-table-column>
        <el-table-column label="负载均衡" align="center" prop="loadBalance"></el-table-column>
        <el-table-column label="版本" align="center" prop="version"></el-table-column>
        <el-table-column label="权重" align="center" prop="weight"></el-table-column>
      </el-table>
    </el-card>
  </div>

</template>

<script>
import {listUser, deleteUser, updateUser, addUser} from '@/api/system/user'
import { Message } from 'element-ui'
import { bindRole, getAllRoles, getRoleById, unBindRole } from '@/api/system/role'
import { sysLogList } from '@/api/monitor/operlog'
import { zkLists } from '@/api/monitor/node'
export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      // debugger
      zkLists().then(res => {
        if (!res['success']) {
          Message({message:res['errorMsg'], type:"error", duration:2000});
        }
        else {
          this.tableData = res['data'];
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
