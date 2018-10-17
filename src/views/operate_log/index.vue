<template>
  <div class="app-container">
    <el-form :inline="true" :model="pageData" class="demo-form-inline">
      <el-form-item label="操作内容">
        <el-input v-model="pageData.content" placeholder="输入操作内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData(pageData)" icon="el-icon-search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="pageData.content = ''">清除</el-button>
      </el-form-item>

    </el-form>

    <div class="table">
      <el-table
        ref="multipleTable"
        :data="logList"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="create_time" label="操作时间"></el-table-column>
        <el-table-column prop="operator" label="操作者"></el-table-column>

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
  import { operateLog } from '@/api/user'

  export default {
    data() {
      return {
        logList: [],
        // 分页数据
        pageData: {
          currentPage: 1,
          pageSizes: [10, 20, 30, 40],
          size: 10,
          total: 1,
          totalPage: 1,
          content: '',
          start_time: '',
          end_time: ''
        },
        selectedArrList: [],
        // 其他
        listLoading: true
      }
    },
    created() {
      this.fetchData(this.pageData)
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
      fetchData(searchData) {
        this.listLoading = true
        operateLog(searchData).then(response => {
          if (response.code === 200) {
            this.logList = response.data.list
            this.pageData.total = +response.data.count
            this.pageData.totalPage = response.data.all_page
            this.listLoading = false
          }
        })
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
