<template>
  <div>

    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span=10>

          <el-input clearable @clear="clearSearchResult" placeholder="请输入搜索内容" v-model="pageInfo.searchKey">
            <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span=3>

          <el-button type="primary"
                     @click="dialogVisible = true">
            创建用户
          </el-button>
        </el-col>


      </el-row>
    </el-card>
    <!--        列表-->
    <el-table
        :data="userlist"
        border
        stripe

        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        style="width: 100%">

      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column

          type="index"
          :index="indexMethod"
      >
      </el-table-column>

      <el-table-column
          prop="id"
          label="ID"
          :width="flexColumnWidth('id',userlist,)"

      >
      </el-table-column>
      <el-table-column
          prop="username"
          label="用户名"
          :width="flexColumnWidth('username',userlist,)"
      >
      </el-table-column>
      <el-table-column

          label="性别"
          :width="flexColumnWidth('gender',userlist,)"
          prop="gender"
      >
      </el-table-column>
      <el-table-column
          prop="mobile"
          :width="flexColumnWidth('mobile',userlist,)"
          label="电话">

        <template slot-scope="scope">
          <div>{{ scope.row.mobile|is_mobile_filter }}</div>
        </template>
      </el-table-column>


      <el-table-column
          prop="email"
          :width="flexColumnWidth('email',userlist,)"

          label="邮箱 ">
        <template slot-scope="scope">
          <div>{{ scope.row.email|is_mobile_filter }}</div>
        </template>

      </el-table-column>

      //is_active
      <el-table-column
          prop="is_staff"
          :width="flexColumnWidth('is_staff',userlist,)"
          label="员工">
        <template slot-scope="scope">

          <el-switch
              v-model="scope.row.is_staff"
              active-color="#13ce66"
              @change="changeSwitch_is_staff(scope.row)"
              inactive-color="#ff4949">
          </el-switch>


        </template>
      </el-table-column>
      <el-table-column
          prop="last_login"
          :width="flexColumnWidth('last_login',userlist,)"

          label="最近登陆">
        <template slot-scope="scope">
          <div>{{ scope.row.last_login|is_mobile_filter }}</div>
        </template>
      </el-table-column>

      <el-table-column
          width="220px"
          label="操作">

        <template slot-scope="scop">
          <el-button @click="editUser(scop.row)" type="primary" icon="el-icon-edit" size="min"></el-button>
          <el-button @click="delUser(scop.row)" type="danger" icon="el-icon-delete" size="min"></el-button>

          <el-tooltip :enterable="false" effect="dark" content="setting" placement="top">
            <el-button type="warning" icon="el-icon-setting" size="min"></el-button>
          </el-tooltip>
        </template>


      </el-table-column>


    </el-table>
    <!--    分页-->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.currentPage"
        :page-sizes="[2,4, 5, 10]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
    </el-pagination>

    <!--    add弹出对话框-->
    <el-dialog
        title="创建用户"
        :visible.sync="dialogVisible"
        width="30%"
        @close="editDialogClose"
    >
      <el-form :model="addUserForm" :rules="addUserFormrules" ref="addUserFormref" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密 码" type="password" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>


      </el-form>


      <span slot="footer" class="dialog-footer">
    <el-button @click=" addUserForm= { username: '', password: '', email: '', mobile: ''} ">重置</el-button>
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="createUser">确 定</el-button>
  </span>
    </el-dialog>
<!--    edit dialog -->
      <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="30%"
    >
      <el-form ref="editUserFormRef" :model="editUserForm" :rules="editUserFormrules"
             label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input :disabled="true" v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click=" editUserForm= { username: '', password: '', email: '', mobile: ''} ">重置</el-button>
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateUser">确 定</el-button>
  </span>
    </el-dialog>
  </div>


</template>

<script>
import {request} from "@/plugins/request";

export default {
  name: "UsersP",
  data() {
    // 邮箱校验规则
    const checkEmail = (rule, value, callback) => {
      let emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (emailReg.test(value) || value == '') {
        return callback();
      } else {
        callback(new Error("邮箱格式错误"));
      }
    };
    const checkPhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入绑定的手机号码"))
      } else if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value)) {
        callback(new Error("请输入正确的手机号码"))
      } else {
        callback()
      }
    };
    return {
      userlist: [],
      pageInfo: {
        currentPage: 1,
        pageSize: 4,
        total: 20,
        searchKey: ""
      },
      dialogVisible: false,
      editDialogVisible:false,
      addUserForm: {
        username: "yoyo", password: "sffsfsfs", email: "fsfss@qq.com", mobile: "13265656565"
      },
      addUserFormrules: {
        username: [{
          required: true, max: 15, min: 3
          , trigger: 'blur',
          message: "用户名长度为3~15个字符"
        }
        ],
        password: [{
          required: true, min: 6, max: 15,
          trigger: 'blur', message: "密码长度为6~15个字符"
        }],
        email: [{
          required: true, validator: checkEmail, trigger: 'blur',
        }],
        mobile: [{
          required: true,
          validator: checkPhone, trigger: 'blur',
        }]
      },
      editUserForm:{ username: '',  email: '', mobile: ''},
      editUserFormrules: {
        username: [{
          required: true, max: 15, min: 3
          , trigger: 'blur',
          message: "用户名长度为3~15个字符"
        }
        ],
        email: [{
          required: true, validator: checkEmail, trigger: 'blur',
        }],
        mobile: [{
          required: true,
          validator: checkPhone, trigger: 'blur',
        }]
      }
    }
  },
  filters: {
    is_active_filter: function (value) {
      if (value) return "是"
      return "否"
    },
    is_mobile_filter: function (value) {
      if (value) return value
      return "null"
    },
  },
  created() {
    this.initdata()
  },
  methods: {
editDialogClose(){
  this.editUserForm= { username: '', password: '', email: '', mobile: ''}
},
    updateUser(){

      let _this=this
    this.$refs.editUserFormRef.validate(function(valid){
          if(!valid) return _this.editDialogVisible=true
            request({
        url:"/api/xadmin/v1/user_profile/"+ this.editUserForm.id,
         method:"put",
         data:{
          last_login: this.editUserForm.last_login ? this.editUserForm.last_login : "2023-03-01 19:45:14"
          // ,is_superuser: this.editUserForm.is_superuser
          // ,username: this.editUserForm.username
          // ,first_name: this.editUserForm.first_name
          // ,last_name: this.editUserForm.last_name
          // ,is_staff: this.editUserForm.is_staff
          // ,is_active:this.editUserForm.is_active
          ,date_joined: this.editUserForm.date_joined
          ,name:this.editUserForm.name
          ,birthday: this.editUserForm.birthday ? this.editUserForm.birthday : "2023-03-30"
          ,gender: this.editUserForm.gender
          ,mobile: this.editUserForm.mobile
          ,email:  this.editUserForm.email
         }
      }).then((res)=>{
        console.log("res:",res)
        if(200<res.status<300) _this.$message.success("修改成功!")
               _this.editDialogVisible=false
        _this.initdata()
       }).catch((err)=>{
         _this.$message.error("query fail:"+JSON.stringify(err.data))
       })

        })


    },
      delUser(row){
      let id = row.id;
        let _this=this
      // recomform messageBox
          this.$confirm('此操作将删除用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
                request({
       url:"/api/xadmin/v1/user_profile/"+ id,
        method:"delete",
      }).then(res=>{
      if(200<=res.status<300) return  _this.$message.success("delete success!"),
          _this.initdata()
      }).catch((err)=>{
         _this.$message.error("erro while delete:",JSON.stringify(err.data))
      })
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });



      },
    editUser(row){
      let id = row.id;
      this.editDialogVisible=true;
      let _this=this

       request({
        url:"/api/xadmin/v1/user_profile/"+ id
      }).then((res)=>{
        console.log("res:",res)
        _this.editUserForm = res.data
       }).catch((err)=>{
         _this.$message.error("query fail:"+err.data)
       })
    },
    createUser(){
      let _this=this
      request({
        url:"/api/xadmin/v1/user_profile",
        data:{
          password: this.addUserForm.password,
          is_superuser: false,
          username: this.addUserForm.username,
          is_staff: false,
          is_active: true,
          gender: "female"
        },
        method:"post"
      }).then(function(response){
        console.log("response:",response)
        if(response&&(200<response.status<300)) return _this.dialogVisible = false,
            _this.$message.success("add success!")

      }).catch(function(err){
         console.log("errro:",err.data);
        return _this.$message.error("添加失败!"+ JSON.stringify(err.data))
      })
    },
    initdata() {
      let _this = this

      request({
        url: "/api/xadmin/v1/user_profile",
        params: {
          "current": 1,
          "pageSize": this.pageInfo.pageSize
        },
        method: "get",
      }).then(function (response) {

        _this.userlist = response.data.data
        _this.pageInfo.total = response.data.total
      })
    },
    clearSearchResult() {
      this.initdata()
    },
    search() {
      let _this = this
      request({
        url: '/api/xadmin/v1/user_profile',
        params: {
          username: this.pageInfo.searchKey
        }
      }).then(function (response) {
        if (response.status == 200) return _this.pageInfo.total = response.data.total
            , _this.userlist = response.data.data
        _this.userlist = []
      })
    },
    changeSwitch_is_staff(scope) {
      let _this = this
      request({
        url: "/api/xadmin/v1/user_profile/" + scope.id,
        method: "put",
        data: {
          last_login: scope.last_login,
          is_superuser: scope.is_superuser,
          username: scope.username,
          first_name: scope.first_name,
          last_name: scope.last_name,
          is_staff: scope.is_staff,
          is_active: scope.is_active,
          date_joined: scope.date_joined,
          name: scope.name,
          birthday: scope.birthday,
          gender: scope.gender,
          mobile: scope.mobile,
          email: scope.email
        }
      }).then(function (response) {
        if (response.status == 200) {
          _this.$message.success("修改成功！")
        } else {
          scope.is_staff = !scope.is_staff
          return _this.$message.error("修改失败:" + response)
        }

      })

    },
    indexMethod(index) {
      return index + (this.pageInfo.currentPage - 1) * (this.pageInfo.pageSize) + 1
    },
    flexColumnWidth(str, tableData, flag) {
      // str为该列的字段名(传字符串);tableData为该表格的数据源(传变量);
      // flag为可选值，可不传该参数,传参时可选'max'或'equal',默认为'max'
      // flag为'max'则设置列宽适配该列中最长的内容,flag为'equal'则设置列宽适配该列中第一行内容的长度。
      str = str + '';
      let columnContent = '';
      if (!tableData || !tableData.length || tableData.length === 0 || tableData === undefined) {
        return;
      }
      if (!str || !str.length || str.length === 0 || str === undefined) {
        return;
      }
      if (flag === 'equal') {
        // 获取该列中第一个不为空的数据(内容)
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i][str].length > 0) {
            columnContent = tableData[i][str] + "";
            break;
          }
        }
      } else {
        // 获取该列中最长的数据(内容)
        let index = 0;
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i][str] === null) {
            // 当数据为空时跳过本次循环获取下一条数据长度
            continue;
          }
          const now_temp = tableData[i][str] + '';
          const max_temp = tableData[index][str] + '';
          if (now_temp.length > max_temp.length) {
            index = i;
          }
        }
        columnContent = tableData[index][str] + "";
      }
      // 以下分配的单位长度可根据实际需求进行调整
      let flexWidth = 0;
      if (columnContent != undefined) {
        for (const char of columnContent) {
          if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
            // 如果是英文字符，为字符分配10个单位宽度
            flexWidth += 10;
          } else if (char >= '\u4e00' && char <= '\u9fa5') {
            // 如果是中文字符，为字符分配16个单位宽度
            flexWidth += 16;
          } else {
            // 其他种类字符，为字符分配10个单位宽度
            flexWidth += 10;
          }
        }
      }
      if (flexWidth < 80) {
        // 设置最小宽度
        flexWidth = 80;
      }
      if (flexWidth > 500) {
        // 设置最大宽度
        flexWidth = 500;
      }
      return flexWidth + 'px';
    },
    handleSizeChange(value) {
      let _this = this
      this.pageInfo.pageSize = value
      request({
        url: "/api/xadmin/v1/user_profile",
        params: {
          "current": 1,
          "pageSize": this.pageInfo.pageSize
        },
        method: "get",
      }).then(function (response) {
        console.log(response)
        _this.userlist = response.data.data
        _this.pageInfo.total = response.data.total
      })
    },
    handleCurrentChange(value) {
      let _this = this

      this.pageInfo.currentPage = value
      request({
        url: "/api/xadmin/v1/user_profile",
        params: {
          "current": value,
          "pageSize": this.pageInfo.pageSize
        },
        method: "get",
      }).then(function (response) {
        console.log(response)
        _this.userlist = response.data.data
        _this.pageInfo.total = response.data.total
      })

    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-bottom: 15px;
}
</style>