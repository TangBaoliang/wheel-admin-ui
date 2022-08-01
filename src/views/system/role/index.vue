<template>
  <div style="padding-left: 10px" >
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-form class="inline-form">

        <el-table-column label="account" align="center" key="account" prop="account" />
        <el-table-column label="用户名" align="center" width="150" key="userName"  prop="userName" :show-overflow-tooltip="true" >

        </el-table-column>

        <el-table-column  fixed="right" width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini"
                       @click="startAuth(scope.row['id'], scope.$index)">角色管理</el-button>
          </template>
        </el-table-column>

      </el-form>
    </el-table>

    <el-dialog :close-on-click-modal="false" width="700px" title="角色绑定和解绑" :visible.sync="dialogTableVisible">
      <h1>用户名：{{userName}} 账户：{{userAccount}}</h1>
      <el-table :data="allRoles">
        <el-table-column property="roleCode" label="角色代码" width="150"></el-table-column>
        <el-table-column property="roleName" label="角色名" width="200"></el-table-column>
        <el-table-column property="roleDescription" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="Object.keys(hadRoles).includes(scope.row['roleName'])" type="danger" size="mini"
                       @click="unBindRole(scope.row['roleName'])">解绑</el-button>
            <el-button v-else type="success" size="mini"
                       @click="bindRole(scope.row['roleName'])">绑定</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>

</template>

<script>
import {listUser, deleteUser, updateUser, addUser} from '@/api/system/user'
import { Message } from 'element-ui'
import { bindRole, getAllRoles, getRoleById, unBindRole } from '@/api/system/role'
export default {
  data() {
    return {
      tableData: [],
      queryParam:{
        current:1,
        size:10
      },
      dialogTableVisible:false,
      hadRoles: {},
      allRoles:[],
      userName:'',
      userAccount:"",
      selectUserIdx:-1
    }
  },
  created() {
    this.getData();
    this.getAllRoles();
  },
  methods: {
    getData() {
      // debugger
      listUser(this.queryParam).then(res => {
        if (!res['success']) {
          Message({message:"获取数据失败", type:"error", duration:2000});
        }
        else {
          for (let item of res.data['records']) {
            item['password'] = '';
          }
          this.tableData = res.data['records'];
        }
      }).catch(err => {
        Message({message:err, type:"error", duration:2000});
      });
    },
    getHadRoles(userId) {
      getRoleById({userId:userId}).then(res => {
        if (!res['success']) {
          Message({message:"用户已有角色获取失败", type:"error", duration:4000});
        }
        else {
          this.hadRoles = {};
          for (const item of res['data']) {
            this.hadRoles[item['roleName']] = false;
          }
        }
      }).catch(err => {
        Message({message:err, type:"error", duration:4000});
      })
    },
    getAllRoles() {
      getAllRoles().then(res => {
        if (!res['success']) {
          Message({message:"获取角色列表失败", type:"error", duration:4000});
        }
        else {
          this.allRoles = res['data'];
        }
      }).catch(err => {
        Message({message:err, type:"error", duration:4000});
      })
    },
    startAuth(userId, userIdx) {
      if (this.tableData.length > 0) {
        this.userName = this.tableData[userIdx]['userName'];
        this.userAccount = this.tableData[userIdx]['account'];
        this.selectUserIdx = userIdx;
      }
      // console.log("授权")
      this.dialogTableVisible = true;
      this.getHadRoles(userId)
    },
    unBindRole(roleName) {
      unBindRole({account:this.tableData[this.selectUserIdx]['account'], roleName:roleName}).then(res => {
        if (!res['success']) {
          Message({message:"角色解绑失败", type:"error", duration:4000});
        }
        else {
          Message({message:"角色解绑成功", type:"success", duration:4000});
          this.getHadRoles(this.tableData[this.selectUserIdx]['id']);
        }
      }).catch(err => {
        Message({message:err, type:"error", duration:4000});
      })
    },
    bindRole(roleName) {
      bindRole({account:this.tableData[this.selectUserIdx]['account'], roleName:roleName}).then(res => {
        if (!res['success']) {
          Message({message:"角色绑定失败", type:"error", duration:4000});
        }
        else {
          Message({message:"角色绑定成功", type:"success", duration:4000});
          this.getHadRoles(this.tableData[this.selectUserIdx]['id']);
        }
      }).catch(err => {
        Message({message:err, type:"error", duration:4000});
      })
    }
  },

}
</script>

<style scoped>
.el-table-column>>>input{
  width: 400px;
}
</style>
