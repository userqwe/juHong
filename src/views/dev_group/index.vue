<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="审批人">
        <el-input v-model="searchForm.name" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="推广计划" class="inline-block">
        <el-select v-model="searchForm.plan" placeholder="请选择推广计划">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="clearInputData">清除</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-button @click="addDevGroup" type="success">新建设备组</el-button>
      <el-button type="info">批量删除</el-button>
    </el-row>

    <div class="table">
      <el-table
        ref="multipleTable"
        :data="planList"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column label="设备组名称">
          <template slot-scope="scope"><a class="hover-blue" @click="gotoDetailPage(scope.row)" href="javascript:;">{{ scope.row.group_name }}</a></template>
        </el-table-column>

        <el-table-column width="150" label="设备模板">
          <template slot-scope="scope">{{ scope.row.template_name }}({{scope.row.width}}*{{scope.row.height}})</template>
        </el-table-column>

        <el-table-column
          prop="id"
          label="总数"  width="150"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop="id" width="150"
          label="在线数"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop="id" width="150"
          label="离线数"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          label="操作" width="400">
          <template slot-scope="scope">
            <!--<el-button @click="operateDevGroup(scope.row, 1)" class="margin10" type="success" size="mini" plain>发布广告</el-button>-->
            <!--<el-button @click="operateDevGroup(scope.row, 2)" class="margin10" type="info"   size="mini"  plain>播放列表</el-button>-->
            <!--<el-button @click="operateDevGroup(scope.row, 3)" class="margin10" type="warning" size="mini" plain>远程控制</el-button>-->
            <el-button @click="operateDevGroup(scope.row, 4)" class="margin10" type="danger" size="mini" plain>删除设备组</el-button>
            <el-button @click="operateDevGroup(scope.row, 5)" class="margin10" type="success" size="mini" plain>查看设备</el-button>
            <!--<el-button @click="operateDevGroup(scope.row, 6)" class="margin10" type="info" size="mini" plain>添加设备</el-button>-->
            <el-button @click="operateDevGroup(scope.row, 7)" class="margin10" type="warning" size="mini" plain>编辑设备组</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="新建设备组" :visible.sync="addAdDialogShow">
      <el-form>
        <el-form-item label="设备组名称" :label-width="formLabelWidth">
          <el-input v-model="newDevGroupName" placeholder="设备组名称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择模板" :label-width="formLabelWidth" class="inline-block">
          <el-select v-model="newDevGroupModel" placeholder="选择模板">
            <el-option v-for="list in templateList" :label="list.template_name+'('+list.width+'*'+list.height+')'" :value="list.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAdDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="newDevGroupJsFunc">确 定</el-button>
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
  import { getDevGroupList, addDevGroup, getTemplateList, editDevGroup, delDevGroup } from '@/api/device'
  import { Message } from 'element-ui'
  export default {
    data() {
      return {
        // 新增设备组
        addAdDialogShow: false,
        formLabelWidth: '120px',
        newDevGroupName: '',
        newDevGroupModel: '',
        addOrEditDevGroup: false,
        currentDevGroupId: '',
        // 计划列表
        planList: [],
        pageData: {
          currentPage: 1,
          pageSizes: [10, 20, 30, 40],
          size: 10,
          total: 1,
          totalPage: 1
        },
        // 相关操作
        multipleSelection: [],
        list: null,
        listLoading: true,
        currentPage: 1,
        searchForm: {
          name: '',
          plan: ''
        },
        activeName: 'first',
        dialogFormVisible: false,
        templateList: []
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
      this.fetchData(this.pageData.currentPage, this.pageData.size)
      this.getTemplateList()
    },
    methods: {
      // 获取列表
      fetchData(page, size) {
        this.listLoading = true
        getDevGroupList(0, size).then(response => {
          if (response.code === 200) {
            this.planList = response.data.list
            this.pageData.total = +response.data.count
            this.pageData.totalPage = response.data.all_page
          }
        })
      },
      addDevGroup() {
        this.addAdDialogShow = true
        this.addOrEditDevGroup = false
        this.newDevGroupName = ''
        this.newDevGroupModel = ''
      },
      // 添加计划
      newDevGroupJsFunc() {
        this.addAdDialogShow = false
        if (!this.addOrEditDevGroup) {
          addDevGroup(this.newDevGroupName, this.newDevGroupModel).then(response => {
            if (response.code === 200) {
              Message({
                message: '设备组添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.fetchData(this.pageData.currentPage, this.pageData.size)
            }
          })
        } else {
          editDevGroup(this.currentDevGroupId, this.newDevGroupName, this.newDevGroupModel).then(response => {
            if (response.code === 200) {
              Message({
                message: '设备组修改成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.fetchData(this.pageData.currentPage, this.pageData.size)
            }
          })
        }
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
      // 对单个计划进行操作
      operateDevGroup(tab, event) {
        // 编辑设备组
        if (event === 7) {
          this.addAdDialogShow = true
          this.newDevGroupModel = tab.template_name
          this.newDevGroupName = tab.group_name
          this.addOrEditDevGroup = true
          this.currentDevGroupId = +tab.id
        }
        // 查看设备
        if (event === 5) {
          this.$router.push({ path: '/device/exa_dev', query: { group_id: tab.id }})
        }
        // 删除设备组
        if (event === 4) {
          delDevGroup(tab.id).then(res => {
            if (res.code === 200) {
              Message({
                message: '设备组删除成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.fetchData(this.pageData.currentPage, this.pageData.size)
            }
          })
        }
      },
      // 跳转到详情页
      gotoDetailPage(tab) {
        this.$router.push({ path: '/device/exa_dev', query: { group_id: tab.id }})
      },
      onSubmit() {
        console.log('submit!')
      },
      clearInputData() {
        this.searchVal.name = ''
      },
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val
      },
      getTemplateList() {
        getTemplateList().then(response => {
          if (response.code === 200) {
            this.templateList = response.data.list
          }
        })
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
  .hover-blue{
    color: #409eff;
  }
  .hover-blue:hover{
    text-decoration: underline;
  }
  .margin10{
    margin: 10px 0 0 0;
  }
</style>
