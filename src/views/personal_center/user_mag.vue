<template>
  <div class="app-container">
    <el-form :inline="true" :model="pageData" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="pageData.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData(pageData)" icon="el-icon-search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="pageData.name = ''">清除</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-button @click="adUserInfo.isDialogShow = true" type="success">新增用户</el-button>
      <el-button @click="addNewRole" type="warning">新增角色</el-button>
    </el-row>
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="userList"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange">

        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="uid" label="id"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column  label="状态">
          <template slot-scope="scope">{{scope.row.status == 1 ? '启用' : '停用'}}</template>
        </el-table-column>
        <el-table-column prop="role_name" label="角色名"></el-table-column>
        <el-table-column prop="created_at" label="创建时间"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editUserInfo(scope.row)"  type="warning" size="small" plain>修改</el-button>
            <el-button :type="scope.row.status == 1 ? 'info' : 'success'" @click="changeUserStatus(scope.row.uid)" size="small" plain>{{scope.row.status == 1 ? '停用' : '启用' }}</el-button>
            <el-button type="danger" @click="changeUserStatus(scope.row.uid)" size="small" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="编辑用户" :visible.sync="currentUserInfo.isDialogShow">
      <el-form>
        <el-form-item label="用户名" :label-width="currentUserInfo.formLabelWidth" >
          <el-input v-model="currentUserInfo.name" clearable placeholder="请输入用户名" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" :label-width="currentUserInfo.formLabelWidth" >
          <el-select v-model="currentUserInfo.role_id" placeholder="请选择用户角色">
            <el-option v-for="role in roleList" :label="role.group_name" :value="role.role_id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="currentUserInfo.isDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditUserInfo">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增用户" :visible.sync="adUserInfo.isDialogShow">
      <el-form>
        <el-form-item label="用户手机号" :label-width="adUserInfo.formLabelWidth" >
          <el-input v-model="adUserInfo.phone"  clearable placeholder="请输入用户手机号" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="adUserInfo.formLabelWidth" >
          <el-input v-model="adUserInfo.password" clearable placeholder="请输入密码" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" :label-width="adUserInfo.formLabelWidth" >
          <el-select v-model="adUserInfo.role_id" placeholder="请选择用户角色">
            <el-option v-for="role in roleList" :label="role.group_name" :value="role.role_id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adUserInfo.isDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddUser">确 定</el-button>
      </div>
    </el-dialog>

    <div class="block pagnation">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageData.currentPage"
        :page-sizes="pageData.pageSizes"
        :page-size="pageData.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getUserList, getRoleList, modifyUserStatus, modifyUserInfo, addNewUser } from '@/api/user'
  import { Message } from 'element-ui'

  export default {
    data() {
      return {
        userList: [],
        // 分页数据
        pageData: {
          currentPage: 1,
          pageSizes: [10, 20, 30, 40],
          size: 10,
          total: 1,
          totalPage: 1,
          type: '0',
          group_type: '0',
          name: '',
          status: 0,
          phone: 123,
          role_id: '1'
        },
        // 当前用户信息
        currentUserInfo: {
          uid: '',
          name: '',
          role_id: '',
          isDialogShow: false,
          formLabelWidth: '80px'
        },
        roleList: [],
        selectedArrList: [],
        //
        adUserInfo: {
          isDialogShow: false,
          phone: '',
          password: '',
          role_id: '',
          formLabelWidth: '150px'
        },
        // 其他
        listLoading: true
      }
    },
    created() {
      getRoleList().then(res => {
        if (res.code === 200) {
          this.roleList = res.data
          this.adUserInfo.role_id = res.data[0].role_id
        }
      })
      this.fetchData()
    },
    filters: {
      materialTypeFilter(status) {
        const statusMap = {
          image: '图片',
          video: '视频',
          url: '网址'
        }
        return statusMap[status]
      }
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getUserList(this.pageData).then(response => {
          if (response.code === 200) {
            this.userList = response.data.list
            this.pageData.total = +response.data.count
            this.pageData.totalPage = response.data.all_page
            this.listLoading = false
          }
        })
      },
      // 新增用户
      confirmAddUser() {
        addNewUser(this.adUserInfo).then(res => {
          this.adUserInfo.isDialogShow = false
          if (res.code == 200) {
            Message({
              message: '用户新增成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.fetchData()
          }
        })
      },
      // 修改用户信息
      editUserInfo(user) {
        console.log(user)
        this.currentUserInfo.isDialogShow = true
        this.currentUserInfo.uid = +user.uid
        this.currentUserInfo.name = user.username
        this.currentUserInfo.role_id = this.roleList.filter(item => item.group_name == user.role_name)[0].role_id
      },
      confirmEditUserInfo() {
        this.currentUserInfo.isDialogShow = false
        modifyUserInfo(this.currentUserInfo).then(res => {
          if (res.code === 200) {
            Message({
              message: '用户信息修改成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.fetchData()
          }
        })
      },
      changeUserStatus(id) {
        modifyUserStatus(id).then(res => {
          if (res.code === 200) {
            Message({
              message: '状态修改成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.fetchData()
          }
        })
      },
      addNewRole() {
        this.$router.push('/personal_center/add_role')
      },
      // 分页改变
      handleSizeChange(val) {
        this.pageData.size = val
        this.fetchData(this.pageData)
      },
      handleCurrentChange(val) {
        this.pageData.currentPage = val
        this.fetchData(this.pageData)
      },
      handleSelectionChange(listArr) {
        this.selectedArrList = []
        listArr.map(item => this.selectedArrList.push(item.id))
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .pagnation{
    text-align: center;
    margin-top: 20px;
  }
  .func-btn-box{
    float: right;
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  .img-box{
    width: 60px;
    height: 60px;
    display: inline-block;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .preview-image{
    width: 100%;
    height: auto;
  }
</style>
