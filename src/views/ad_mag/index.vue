<template>
  <div class="app-container">
    <el-row>
      <el-button @click="addAdDialogShow=true" type="success">新建推广计划</el-button>
      <el-button type="warning">批量启用</el-button>
      <el-button type="info">批量暂停</el-button>
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

        <el-table-column label="内容名称">
          <template slot-scope="scope"><a class="hover-blue" @click="gotoDetailPage(scope.row)" href="javascript:;">{{ scope.row.plan_name }}</a></template>
        </el-table-column>

        <el-table-column
          prop="plan_name" width="150"
          label="广告数">
        </el-table-column>

        <!--<el-table-column-->
          <!--prop="status"-->
          <!--label="展现数"  width="150"-->
          <!--show-overflow-tooltip>-->
        <!--</el-table-column>-->

        <el-table-column width="150"
          label="状态"
          show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.status == 1 ? '开启' : '关闭'}}</template>
        </el-table-column>

        <el-table-column
          label="操作" >
          <template slot-scope="scope">
            <el-button @click="planHanlder(scope.row, 1)" type="success" size="small" plain>启用</el-button>
            <el-button @click="planHanlder(scope.row, 0)" type="info" size="small"  plain>暂停</el-button>
            <el-button @click="planHanlder(scope.row, 3)" type="warning" size="small" plain>编辑</el-button>
            <el-button @click="planHanlder(scope.row, 4)" type="danger" size="small" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="新建推广计划" :visible.sync="addAdDialogShow">
      <el-form>
        <el-form-item label="推广计划名称" :label-width="formLabelWidth">
          <el-input v-model="newPlanVal" placeholder="请填写推广计划" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAdDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="newPlanJsFunc">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改推广计划" :visible.sync="editPlanDialogShow">
      <el-form>
        <el-form-item label="修改计划名称" :label-width="formLabelWidth">
          <el-input v-model="editPlanName" placeholder="推广计划" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPlanDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="eidtPlanName">确 定</el-button>
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
  import { getPlanList, newPlan, changePlanStatus, editPlan } from '@/api/ad_mag'
  import { Message, MessageBox } from 'element-ui'
  export default {
    data() {
      return {
        // 新增计划
        addAdDialogShow: false,
        formLabelWidth: '120px',
        newPlanVal: '',
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
        searchVal: {
          name: ''
        },
        activeName: 'first',
        dialogFormVisible: false,
        editPlanDialogShow: false,
        editPlanName: '',
        editPlanId: ''
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
    },
    methods: {
      // 获取列表
      fetchData(page, size) {
        this.listLoading = true
        getPlanList(page, size).then(response => {
          if (response.code === 200) {
            this.planList = response.data.list
            this.pageData.total = +response.data.count
            this.pageData.totalPage = response.data.all_page
          }
        })
      },
      // 添加计划
      newPlanJsFunc() {
        this.addAdDialogShow = false
        newPlan(this.newPlanVal).then(response => {
          if (response.code === 200) this.fetchData()
        })
      },
      // 修改计划
      eidtPlanName() {
        this.editPlanDialogShow = false
        editPlan(this.editPlanId, this.editPlanName).then(response => {
          if (response.code === 200) this.fetchData()
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
      // 对单个计划进行操作
      planHanlder(tab, event) {
        const changeStatusArr = [0, 1]
        if (changeStatusArr.indexOf(event) > -1) {
          changePlanStatus(tab.id, event).then(response => {
            if (response.code === 200) {
              Message({
                message: event === 1 ? '计划已启用' : '计划已暂停',
                type: 'success',
                duration: 3 * 1000
              })
              this.fetchData(this.pageData.currentPage, this.pageData.size)
            }
          })
        }
        // 编辑计划
        if (event === 3) {
          this.editPlanDialogShow = true
          this.editPlanName = tab.plan_name
          this.editPlanId = tab.id
        }
      },
      // 跳转到详情页
      gotoDetailPage(data) {
        this.$router.push({ path: '/ad_mag/plan_detail', query: { plan_id: data.id, plan_name: data.plan_name }})
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
</style>
