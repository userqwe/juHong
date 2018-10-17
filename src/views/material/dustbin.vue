<template>
  <div class="app-container">
    <el-form :inline="true" :model="pageData" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input v-model="pageData.name" placeholder="输入搜索关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData(pageData)" icon="el-icon-search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="pageData.name = ''">清除</el-button>
      </el-form-item>
      <div class="func-btn-box">
        <el-button type="success" @click="recoverMaterial(selectedArrList)">批量恢复</el-button>
        <el-button type="danger" @click="delMaterial(selectedArrList)">批量永久删除</el-button>
      </div>
    </el-form>

    <div class="tabLists" v-if="false">
      <el-tabs v-model="pageData.type" @tab-click="handleClick">
        <el-tab-pane label="全部素材" name="0"></el-tab-pane>
        <el-tab-pane label="图片" name="1"></el-tab-pane>
        <el-tab-pane label="视频" name="2"></el-tab-pane>
        <el-tab-pane label="网页地址" name="3"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="tabLists" v-if="false">
      <el-tabs v-model="pageData.group_type" @tab-click="typeChangeClick">
        <el-tab-pane v-for="type in classifyList" :label="type.type_name" :name="type.id"></el-tab-pane>
      </el-tabs>
    </div>

    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    </el-row>

    <div class="table">
      <el-table
        ref="multipleTable"
        :data="materialList"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
          prop="name"
          label="素材名称">
        </el-table-column>

        <el-table-column label="缩略图">
          <template slot-scope="scope">
            <div class="img-box" @click="previewImage(scope.row)">
              <img :src="scope.row.cover_url" alt="">
            </div>
          </template>
        </el-table-column>

        <el-table-column label="宽高">
          <template slot-scope="scope">
            {{scope.row.width}}*{{scope.row.height}}
          </template>
        </el-table-column>


        <el-table-column
          prop="group_type_name"
          label="分类">
        </el-table-column>

        <el-table-column label="素材格式">
          <template slot-scope="scope">
            {{scope.row.type | materialTypeFilter}}
          </template>
        </el-table-column>

        <el-table-column
          label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="recoverMaterial(scope.row.id)" type="success" size="small" plain>恢复</el-button>
            <el-button @click="delMaterial(scope.row.id)" type="danger" size="small" plain>永久删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="素材预览" :visible.sync="dialogImageVisible">
      <img v-if="materialType==='image'" class="preview-image" :src="previewImageUrl" alt="">
      <video v-if="materialType==='video'" class="preview-image" :src="previewImageUrl" controls="controls"></video>
    </el-dialog>

    <el-dialog :title="classifyInfo.title" :visible.sync="classifyInfo.dialogShow">
      <el-form>
        <el-form-item :label="classifyInfo.title" :label-width="classifyInfo.formLabelWidth">
          <el-input v-model="classifyInfo.name" clearable placeholder="请输入分类名字" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="classifyInfo.dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditClassify">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑素材-->
    <el-dialog title="编辑素材" :visible.sync="currentMaterialInfo.isDialogShow">
      <el-form>
        <el-form-item label="素材名称" :label-width="classifyInfo.formLabelWidth">
          <el-input v-model="currentMaterialInfo.name" clearable placeholder="请输入素材名称" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="素材分类" :label-width="classifyInfo.formLabelWidth">
          <el-select v-model="currentMaterialInfo.classsify_id" placeholder="请选择素材分类">
            <el-option v-for="classify in classifyList" :label="classify.type_name" :value="classify.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="currentMaterialInfo.isDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditMaterial">确 定</el-button>
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
  import { getMaterialList, editMaterial, delMaterial, recoverMaterial, getMaterialTypeList, addMaterialType, editMaterialType } from '@/api/material'
  import { Message } from 'element-ui'

  export default {
    data() {
      return {
        materialList: [],
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
          status: 0
        },
        // 预览图片，视频
        dialogImageVisible: false,
        previewImageUrl: '',
        materialType: '',
        // 分类相关
        classifyList: [],
        classifyInfo: {
          isAddFlag: true,
          dialogShow: false,
          name: '所有分类',
          title: '添加分类',
          formLabelWidth: '120px'
        },
        currentMaterialInfo: {
          isDialogShow: false,
          name: '',
          material_id: '',
          classsify_id: '0'
        },
        selectedArrList: [],
        // 其他
        listLoading: true
      }
    },
    created() {
      this.fetchData(this.pageData)
      this.getTypeList()
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
      fetchData(page, type, group_type) {
        this.listLoading = true
        getMaterialList(page, type, group_type).then(response => {
          if (response.code === 200) {
            this.materialList = response.data.list
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
      // 预览图片或视频
      previewImage(item) {
        this.materialType = item.type
        this.dialogImageVisible = true
        this.previewImageUrl = item.url
      },
      // tab切换
      handleClick(tab) {
        this.pageData.type = tab.name
        this.pageData.currentPage = 1
        this.fetchData(this.pageData)
      },
      // 分类切换
      typeChangeClick(tab) {
        this.pageData.group_type = tab.name
        this.classifyInfo.name = tab.label
        this.pageData.currentPage = 1
        this.fetchData(this.pageData)
      },
      // 编辑素材
      eidtMaterial(material) {
        this.currentMaterialInfo.isDialogShow = true
        const filterArr = this.classifyList.filter(item => item.type_name == material.group_type_name)
        this.currentMaterialInfo.classsify_id = filterArr.length ? filterArr[0].id : '0'
        this.currentMaterialInfo.material_id = material.id
        this.currentMaterialInfo.name = material.name
      },
      confirmEditMaterial() {
        editMaterial(this.currentMaterialInfo).then(res => {
          this.currentMaterialInfo.isDialogShow = false
          if (res.code == 200) {
            Message({
              message: '素材修改成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.fetchData(this.pageData)
          }
        })
      },
      // 永久删除素材
      delMaterial(id) {
        let delIds = ''
        if (Array.prototype.isPrototypeOf(id)) {
          if (!id.length) return
          delIds = JSON.stringify(id)
        } else {
          delIds = id
        }
        this.$confirm('确认从回收站删除该素材吗？')
          .then(_ => {
            delMaterial(delIds, -1).then(response => {
              if (response.code === 200) {
                Message({
                  message: '素材已永久删除',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.fetchData(this.pageData)
              }
            })
          })
          .catch(_ => {})
      },
      // 恢复素材
      recoverMaterial(id) {
        let recoverIds = ''
        if (Array.prototype.isPrototypeOf(id)) {
          if (!id.length) return
          recoverIds = JSON.stringify(id)
        } else {
          recoverIds = id
        }
        recoverMaterial(recoverIds).then(res => {
          if (res.code === 200) {
            Message({
              message: '素材恢复成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.fetchData(this.pageData)
          }
        })
      },
      // 素材分类相关操作
      getTypeList() {
        getMaterialTypeList().then(res => {
          this.classifyList = res.data.list
          this.classifyList.unshift({ id: '0', type_name: '所有分类' })
        })
      },
      addOrEditClassify() {
        this.classifyInfo.dialogShow = false
        if (this.classifyInfo.isAddFlag) {
          addMaterialType(this.classifyInfo.name).then(res => {
            if (res.code === 200) this.getTypeList()
          })
        } else {
          editMaterialType(this.pageData.group_type, this.classifyInfo.name).then(res => {
            if (res.code === 200) this.getTypeList()
          })
        }
      },
      addClassifyType(flag) {
        if (flag) this.classifyInfo.name = ''
        this.classifyInfo.dialogShow = true
        this.classifyInfo.isAddFlag = flag
        this.classifyInfo.title = flag ? '新增分类' : '编辑分类'
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
