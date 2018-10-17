<template>
  <div class="app-container">
    <div class="search-box">
      <el-form ref="form" :model="searchForm" label-width="80px">
        <el-form-item label="推广计划" class="inline-block">
          <el-select v-model="searchForm.plan" placeholder="请选择推广计划">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="广告名称" class="inline-block">
          <el-input v-model="searchForm.name"></el-input>
        </el-form-item>

        <el-form-item label="设备组" class="inline-block">
          <el-select v-model="searchForm.device" placeholder="请选择投放设备组">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间" class="inline-block vertical-bottom">
          <el-col>
            <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.startTime" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="结束时间" class="inline-block vertical-bottom">
          <el-col>
            <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.endTime" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item class="inline-block">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button>清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row>
      <el-button type="warning">批量启用</el-button>
      <el-button type="info">批量暂停</el-button>
      <el-button type="danger">批量删除</el-button>
    </el-row>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabListArr" :key="tab.name" :label="tab.label" :name="tab.name"></el-tab-pane>
    </el-tabs>

    <div class="table">
      <el-table
        ref="multipleTable"
        :data="adList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column prop="ad_name" label="广告名称" width="120"></el-table-column>
        <el-table-column prop="name" label="预览图" width="120"></el-table-column>
        <el-table-column prop="address" label="展现量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="投放设备组" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="投放设备" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ad_type" label="广告位规格" show-overflow-tooltip></el-table-column>
        <el-table-column label="投放时间"  show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.start_time}}-{{scope.row.end_time}}</template>
        </el-table-column>
        <el-table-column label="状态"  show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.ad_status | operateFileter}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button @click="adHandler(scope.row, 1)" type="success" size="small" plain>详情</el-button>
            <el-button v-if="scope.row.ad_status == 1 || scope.row.ad_status == 2" @click="adHandler(scope.row, 2)" type="info" size="small"  plain>{{scope.row.ad_status == 1 ? '暂停' : '开启'}}</el-button>
            <el-button @click="adHandler(scope.row, 3)" type="warning" size="small" plain>编辑</el-button>
            <el-button @click="adHandler(scope.row, 4)" type="danger" size="small" plain>删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="审核" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.ad_status == 0" @click="adHandler(scope.row, 5)" type="success" size="small" plain>通过</el-button>
            <el-button v-if="scope.row.ad_status == 0" @click="adHandler(scope.row, 6)" type="danger" size="small" plain>不通过</el-button>
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
  import { planAdDetail, adDetailPage, changeAdStatus } from '@/api/ad_mag'
  import { Message } from 'element-ui'

  export default {
    data() {
      return {
        // 广告列表相关
        adList: [],
        pageData: {
          currentPage: 1,
          pageSizes: [10, 20, 30, 40],
          size: 10,
          total: 1,
          totalPage: 1
        },
        // 搜索表单相关
        searchForm: {
          name: '',
          plan: '',
          startTime: '',
          endTime: '',
          device: '',
          plansArr: [],
          deviceArr: []
        },
        // tab栏
        activeName: 1,
        tabListArr: [
          { label: '全部广告', name: 1 },
          { label: '投放中', name: 2 },
          { label: '待播放', name: 3 },
          { label: '待审核', name: 4 },
          { label: '审核不通过', name: 5 },
          { label: '暂停中', name: 6 },
          { label: '已过期', name: 7 }
        ],
        listLoading: true,
        multipleSelection: [],
        dialogFormVisible: false
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
      },
      operateFileter(status) {
        // -1审核不通过 0:待审核 1:投放中 2:暂停 3:已过期
        const statusMap = {
          '-1': '审核不通过',
          '0': '待审核',
          '1': '投放中',
          '2': '暂停',
          '3': '已过期'
        }
        return statusMap[status]
      }
    },
    created() {
      this.fetchData(this.$route.query.plan_id, this.pageData.page, this.pageData.size)
    },
    methods: {
      onSubmit() {
        console.log(this.searchForm)
      },
      fetchData(plan_id, page, size) {
        this.listLoading = true
        planAdDetail(plan_id, page, size).then(response => {
          if (response.code === 200) {
            this.adList = response.data.list
            this.pageData.total = +response.data.count
            this.pageData.totalPage = response.data.all_page
          }
        })
      },
      // 分页改变
      handleSizeChange(val) {
        this.pageData.size = val
        this.fetchData(this.pageData.currentPage, this.pageData.size)
      },
      handleCurrentChange(val) {
        this.pageData.currentPage = val
        this.fetchData(this.pageData.currentPage, this.pageData.size)
      },
      clearInputData() {
        this.searchVal.name = ''
      },
      // tab切换
      handleClick(tab, event) {
        console.log(tab.name, tab.label)
      },
      //  改变广告状态
      changeAdStatusJsFunc(adId, status) {
        changeAdStatus(adId, status).then(res => {
          if (res.code === 200) {
            Message({
              message: '状态修改成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.fetchData(this.$route.query.plan_id, this.pageData.page, this.pageData.size)
          }
        })
      },
      // 广告相关操作
      adHandler(data, type) {
        if (type === 1) {
          this.$router.push({ path: '/ad_mag/ad_detail', query: { ad_id: data.id }})
        }
        if (type === 2) {
          const changeStatus = data.ad_status == 1 ? 2 : 1
          this.$confirm('是否确认' + (data.ad_status == 1 ? '暂停' : '启用') + '该广告?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.changeAdStatusJsFunc(data.id, changeStatus)
          }).catch(() => {})
        }
        if (type === 3) {
          this.$router.push({ path: '/ad_mag/ad_pub', query: { ad_id: data.id }})
        }
        if (type === 5) {
          this.changeAdStatusJsFunc(data.id, 1)
        }
        if (type === 6) {
          this.changeAdStatusJsFunc(data.id, 2)
        }
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
</style>
