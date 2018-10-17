<template>
  <div class="app-container">
    <div class="search-box">
      <el-form ref="form" :model="form" label-width="80px">

        <el-form-item label="设备编号" class="inline-block">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="设备名称" class="inline-block">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="设备组" class="inline-block">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开放设备" class="inline-block">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所在地区" class="inline-block">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="公司名称" class="inline-block">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="申请人" class="inline-block">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="联系电话" class="inline-block">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="安装人" class="inline-block">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item class="inline-block">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button>清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row>
      <el-button @click="addNewDevice" type="success">新建设备</el-button>
      <el-button type="warning">批量新增到设备组</el-button>
      <el-button type="danger">批量移除设备组</el-button>
    </el-row>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部设备" name="first"></el-tab-pane>
      <el-tab-pane label="在线设备" name="second"></el-tab-pane>
      <el-tab-pane label="离线设备" name="third"></el-tab-pane>
      <el-tab-pane label="未激活设备" name="fourth"></el-tab-pane>
    </el-tabs>

    <div class="table">
      <el-table
        ref="multipleTable"
        :data="deviceList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>

        <el-table-column label="设备编号" width="120">
          <template slot-scope="scope">{{ scope.row.iot_device_name }}</template>
        </el-table-column>

        <el-table-column prop="device_name" label="设备名称" width="120"></el-table-column>
        <el-table-column prop="group_name" label="归属设备组" show-overflow-tooltip></el-table-column>
        <el-table-column prop="open" label="状态" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="create_time" label="设备创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="update_time" label="心跳时间" show-overflow-tooltip></el-table-column>

        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" class="margin10" type="success" size="small" plain>发布广告</el-button>
            <el-button @click="handleClick(scope.row)" class="margin10" type="primary" size="small"  plain>播放列表</el-button>
            <el-button @click="handleClick(scope.row)" class="margin10" size="small" plain>远程控制</el-button>
            <el-button @click="handleClick(scope.row)" class="margin10" type="info" size="small" plain>编辑设备</el-button>
            <el-button @click="handleClick(scope.row)" class="margin10" type="warning" size="small" plain>删除设备</el-button>
            <el-button @click="handleClick(scope.row)" class="margin10" type="danger" size="small" plain>移除设备组</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
  import { getCurrentGroupDevice } from '@/api/device'

  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        // 计划列表
        deviceList: [],
        pageData: {
          currentPage: 1,
          pageSizes: [10, 20, 30, 40],
          size: 10,
          total: 1,
          totalPage: 1
        },
        activeName: 1,
        list: null,
        listLoading: true,
        currentPage: 1,
        searchVal: {
          name: ''
        },
        multipleSelection: []
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.fetchData(this.$route.query.group_id)
    },
    methods: {
      onSubmit() {
        console.log('submit!')
      },
      fetchData(group_id) {
        this.listLoading = true
        getCurrentGroupDevice(group_id).then(response => {
          this.deviceList = response.data.list
          this.listLoading = false
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
      },
      clearInputData() {
        this.searchVal.name = ''
      },
      handleClick(tab, event) {
        console.log(tab, event)
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      addNewDevice() {
        this.$router.push('/device/add')
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
  .inline-block{
    display: inline-block;
  }
  .vertical-bottom{
    vertical-align: bottom;
  }
  el-date-picker{
    width: 185px;
  }
  .margin10{
    margin: 10px 0 0 0;
  }
</style>
