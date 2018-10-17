<template>
  <div class="app-container">
    <el-form  ref="roleInfo" :model="roleInfo" label-width="80px" >
      <el-form-item label="角色名称" style="width: 48%;" prop="role">
        <el-input v-model="roleInfo.role"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" style="width: 48%;" prop="role">
        <el-input v-model="roleInfo.info"></el-input>
      </el-form-item>
      <el-row>
        <el-button @click="selectAllPermission" type="success">全选</el-button>
        <el-button @click="resetChecked" type="info">全不选</el-button>
        <el-button @click="refreshCache" style="margin-left: 50px;" type="primary">刷新缓存</el-button>
      </el-row>
    </el-form>
    <div class="tree">
      <el-tree
        :data="permissionList"
        show-checkbox
        default-expand-all
        node-key="menu_code"
        ref="tree"
        :default-checked-keys="checkedKey"
        highlight-current
        :props="defaultProps">
      </el-tree>
    </div>
    <div class="buttons">
      <el-button type="primary" @click="getCheckedNodes">保存权限</el-button>
    </div>
  </div>
</template>

<script>
  import { getRoleList, permissionList, refreshCache, savePermission } from '@/api/user'
  import { Message } from 'element-ui'

  export default {
    data() {
      return {
        data2: [],
        defaultProps: {
          children: 'sub',
          label: 'menu_name'
        },
        permissionList: [],
        checkedKey: [],
        roleInfo: {
          roleArr: [],
          role: ''
        }
      }
    },
    created() {
      this.getRolePageList(() => {
        this.getPermissionList(this.roleInfo.role)
      })
    },
    methods: {
      getRolePageList(callback) {
        getRoleList().then(res => {
          this.roleInfo.roleArr = res.data
          this.roleInfo.role = res.data[0].role_id || 1
          callback()
        })
      },
      getPermissionList(roleId) {
        permissionList(roleId).then(res => {
          console.log(res)
          this.permissionList = res.data.permission_node
          this.setDefautKeys(this.permissionList)
        })
      },
      setDefautKeys(permissionList) {
        const tempArr = []
        permissionList.map(item => {
          if (item.status === 1) {
            tempArr.push(item.menu_code)
          }
          if (item.sub && item.sub.length) {
            item.sub.map(sub_item => {
              if (sub_item.status === 1) {
                tempArr.push(sub_item.menu_code)
              }
            })
          }
        })
        this.checkedKey = tempArr
      },
      getCheckedNodes() {
        const tempUrlList = []
        const checkList = this.$refs.tree.getCheckedNodes()
        console.log(checkList)
        checkList.map(item => {
          if (item.menu_url) tempUrlList.push(item.menu_url)
          if (item.sub && item.sub.length > 0) {
            item.sub.map(node => {
              if (node.menu_url) tempUrlList.push(node.menu_url)
              if (node.sub && node.sub.length > 0) {
                node.sub.map(url => {
                  if (url.menu_url) tempUrlList.push(url.menu_url)
                })
              }
            })
          }
        })
        const reqPermission = [...new Set(tempUrlList)].join(',')
        savePermission(this.roleInfo.role, reqPermission).then(res => {
          if (res.code == 200) {
            Message({
              message: '权限保存成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.getRolePageList(() => {
              this.getPermissionList(this.roleInfo.role)
            })
          }
        })
      },
      selectAllPermission() {
        const tempArr = []
        this.permissionList.map(item => {
          tempArr.push(item.menu_code)
        })
        this.$refs.tree.setCheckedKeys(tempArr)
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([])
      },
      refreshCache() {
        refreshCache(this.roleInfo.role).then(res => {
          if (res.code == 200) {
            Message({
              message: '缓存已刷新',
              type: 'success',
              duration: 3 * 1000
            })
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
