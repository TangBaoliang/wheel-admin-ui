<template>
  <div style="padding-left: 10px" >
    <el-button size="small" type="primary" @click="dialogFormVisible = true">+添加用户</el-button>
    <el-table
      :data="tableData"
      max-height="650">

        <el-table-column label="account" align="center" key="account" prop="account" />
        <el-table-column label="用户名" align="center" width="150" key="userName"  prop="userName" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
              <el-input :disabled="curEditRow !== scope.$index" style="width:100%" v-model="tableData[scope.$index].userName" autocomplete="off"></el-input>
          </template>
        </el-table-column>

        <el-table-column v-show="curEditRow !== -1" label="密码" align="center" prop="password" width="160">
          <template slot-scope="scope">
            <el-input placeholder="提交空值不修改" :disabled="curEditRow !== scope.$index" show-password style="width:100%" v-model="tableData[scope.$index].password" autocomplete="off"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="最后一次登录" align="center" prop="lastLoginTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.lastLoginTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center" key="enabled" prop="enabled" :show-overflow-tooltip="true" >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              @change="updateUserStatus(scope.$index, 'enabled')">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="未过期" align="center" key="notExpired" prop="notExpired" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.notExpired"
              @change="updateUserStatus(scope.$index, 'notExpired')">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="凭证未过期" align="center" key="credentialsNotExpired" prop="credentialsNotExpired">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.credentialsNotExpired"
              @change="updateUserStatus(scope.$index, 'credentialsNotExpired')">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column  fixed="right" width="200" label="操作">
          <template slot-scope="scope">
            <el-button v-if="curEditRow !== scope.$index"
              size="mini"
              @click="curEditRow = scope.$index">编辑</el-button>
            <el-button v-else
                       size="mini"
                       @click="updateUserStatus(scope.$index)" type="success">提交</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteUser({userId:scope.row.id})">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination style="position: fixed; bottom: 0"
      @current-change="getData"
      background
      :page-size="queryParam.size"
      :current-page.sync="queryParam.current"
      layout="prev, pager, next"
      :total="total">
    </el-pagination>

    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" title="新增用户" :visible.sync="dialogFormVisible" width="700">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="账户名(用于登录)" prop="account" >
          <el-input v-model="addForm.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="密码"  prop="password">
          <el-input show-password v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="确认密码" prop="rePassword">
          <el-input show-password v-model="addForm.rePassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import {listUser, deleteUser, updateUser, addUser} from '@/api/system/user'
import { Message } from 'element-ui'
export default {
  data() {
    var validateRePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      curEditRow:-1,
      tableData: [],
      total:0,
      queryParam:{
        current:1,
        size:10
      },
      ifDialogShow:false,
      addForm: {
        "account": "",
        "password": "",
        "userName": "",
        "rePassword":"",
      },

      dialogFormVisible:false,
      rules: {
        account: [
          { required: true, message: '请输入账户名，用于登录', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输用户名', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '输入密码', trigger: 'blur' },
          { min: 6, max: 64, message: '长度在 6 到 64 个字符', trigger: 'blur' }
        ],
        rePassword: [
          {validator: validateRePassword, trigger: 'blur'}
        ]
      }
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
          Message({message:"获取数据失败", type:"error", duration:2000});
        }
        else {
          this.total = Number(res.data['total']);
          for (let item of res.data['records']) {
            item['password'] = '';
          }
          this.tableData = res.data['records'];
        }
      }).catch(err => {
        Message({message:err, type:"error", duration:2000});
      });
    },
    deleteUser(param) {
      deleteUser(param).then(res => {
        if (!res['success']) {
          Message({message:"删除失败：" + res['errorMsg'], type:"error", duration:2000});
        }
        else {
          Message({message:"删除成功", type:"success", duration:2000});
          this.getData();
        }
      }).catch(err => {
        Message({message:err, type:"error", duration:2000});
      })
    },
    updateUserStatus(index) {
      if (this.tableData[index].userName === undefined || this.tableData[index].userName.length === 0 || this.tableData[index].userName.length > 32) {
        Message({message:"用户名不能为空且长度在 1 到 32之间", type:"error", duration:4000});
        return;
      }
      if (this.tableData[index].password) {
        if (this.tableData[index].password.length < 6 || this.tableData[index].password.length > 64) {
          Message({message:"密码长度在 1 到 32之间，为空不修改", type:"error", duration:4000});
          return;
        }
      }
      this.updateUser(this.tableData[index]);
      this.curEditRow = -1;
    },

    updateUser(data) {
      updateUser(data).then(res => {
        if (!res['success']) {
          Message({message:"修改失败：" + res['errorMsg'], type:"error", duration:2000});
        }
        else {
          Message({message:"修改成功", type:"success", duration:2000});
          this.getData();
        }
      }).catch(err => {
        Message({message:err, type:"error", duration:2000});
      });
    },
    submitAddForm(addFormName) {
      this.$refs[addFormName].validate((valid) => {
        if (valid) {
          this.addUser();
        } else {
          return false;
        }
      });
    },

    addUser() {
      addUser(this.addForm).then(res => {
        if (!res['success']) {
          Message({message:"添加失败" + res['errorMsg'], type:"error", duration:2500});
        }
        else {
          Message({message:"添加成功", type:"success", duration:1500});
          this.dialogFormVisible = false;
          this.getData();
        }
      }).catch(err => {
        Message({message:err, type:"error", duration:3000});
      });
    }
  }
}
</script>

<style scoped>
.el-table-column>>>input{
  width: 400px;
}
</style>
