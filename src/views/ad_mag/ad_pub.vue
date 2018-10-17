<template>
  <div class="app-container">
    <el-container>
      <el-aside style="width: 40%;min-width: 630px;">
        <div class="tip"><p>第一步 : 设置广告信息</p></div>
        <el-form :rules="rules" ref="adInfo" :model="adInfo" label-width="80px">
          <!--广告名称-->
          <el-form-item label="广告名称" status-icon prop="ad_name"><el-col :span="11"><el-input v-model="adInfo.ad_name" clearable></el-input></el-col></el-form-item>
          <!--推广计划-->
          <el-form-item label="推广计划" prop="plan_id">
            <el-col :span="11">
              <el-select v-model="adInfo.plan_id" clearable placeholder="请选择推广计划" style="width: 100%;">
                <el-option v-for="item in planArr" :key="item.id" :label="item.plan_name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <!--投放时间-->
          <el-form-item label="投放时间">
            <el-col :span="11">
              <el-select v-model="adInfo.duration" clearable placeholder="请选择投放时间" style="width: 100%;" @change="changeStartDate">
                <el-option v-for="item in durationArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-col :span="11"><el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="adInfo.start_date" style="width: 100%;"  :picker-options="pickerOptions0" @change="changeStartDate"></el-date-picker></el-col>
            <el-col class="line" :span="1" style="text-align: center;">-</el-col>
            <el-col :span="8"><el-time-picker type="fixed-time" v-model="start_time" @change="computedEndTime(time_long)" placeholder="选择开始时间" style="width: 100%;"></el-time-picker></el-col>
          </el-form-item>
          <!--结束时间-->
          <el-form-item label="结束时间">
            <el-col :span="11"><el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="adInfo.end_date" style="width: 100%;" :disabled="adInfo.duration!=-1" :picker-options="pickerOptions0" @change="validateEndTime"></el-date-picker></el-col>
            <el-col class="line" :span="1" style="text-align: center;">-</el-col>
            <el-col :span="8"><el-time-picker type="fixed-time" v-model="end_time" disabled placeholder="根据素材自动计算" style="width: 100%;"></el-time-picker></el-col>
          </el-form-item>
        </el-form>

        <div class="tip"><p>第二步 : 选择投放广告位</p></div>
        <el-form :rules="rules" ref="adInfo" :model="adInfo" label-width="80px" >
          <el-form-item label="设备组" prop="group_id">
            <el-col :span="11">
              <el-select v-model="adInfo.group_id" clearable placeholder="请选择设备组" @change="selectGroup" style="width: 100%;">
                <el-option v-for="dev in deviceArr" :key="dev.id" :label="dev.group_name" :value="dev.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="广告位">
            <span>{{adTemplate}}</span>
          </el-form-item>
        </el-form>

        <div class="tip"><p>第三步 : 上传素材</p></div>
        <el-form :rules="rules" ref="adInfo" :model="adInfo" label-width="80px" >
          <el-form-item label="播放次数" prop="group_id">
            <el-input-number  v-model="adInfo.play_count" @change="computedEndTime(time_long)" :min="1" :max="10000" label="描述文字"></el-input-number>
          </el-form-item>
        </el-form>
        <div>
          <el-upload style="display: inline-block;" :action="uploadUrl" :on-success="uploadFile" :file-list="uploadFileList" list-type="picture-card" :show-file-list="true" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
            <span class="el-icon-upload" style="margin-top: -50px;vertical-align: middle;"></span>
            <p class="text" style="margin-top: -71px;line-height: 1;">本地上传</p>
          </el-upload>
          <div class="add-material-box" @click="uplaodHtmlData.isDialogShow=true">
            <span class="el-icon-message"></span>
            <p class="text">上传网页</p>
          </div>
          <div class="add-material-box" @click="selectFromMaterialBox">
            <span class="el-icon-picture"></span>
            <p class="text">素材库选取</p>
          </div>
        </div>
        <el-row style="margin-top: 20px;">
          <el-button type="info">返回</el-button>
          <el-button @click="submitAdInfo" type="primary">发布广告</el-button>
        </el-row>

        <!--图片预览-->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <!--上传地址-->
        <el-dialog title="上传地址" :visible.sync="uplaodHtmlData.isDialogShow">
          <el-form :model="uplaodHtmlData.form">
            <el-form-item label="上传地址" :label-width="'50'">
              <el-input v-model="uplaodHtmlData.form.url" auto-complete="off">
                <el-select v-model="uplaodHtmlData.form.select" slot="prepend" placeholder="http://" style="width: 110px;">
                  <el-option label="http://" value="http://"></el-option>
                  <el-option label="https://" value="https://"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="uplaodHtmlData.isDialogShow = false">取 消</el-button>
            <el-button type="primary" @click="uploadHtmlUrl">确 定</el-button>
          </div>
        </el-dialog>
        <!--从素材库选取-->
        <el-dialog title="从素材库选取" :visible.sync="materialBox.isDialogShow" :width="'840px'">
          <div class="tabLists">
            <el-tabs v-model="pageData.type" @tab-click="handleClick">
              <el-tab-pane label="全部素材" name="0"></el-tab-pane>
              <el-tab-pane label="图片" name="1"></el-tab-pane>
              <el-tab-pane label="视频" name="2"></el-tab-pane>
              <el-tab-pane label="网页地址" name="3"></el-tab-pane>
            </el-tabs>
          </div>
          <el-checkbox :indeterminate="materialBox.isIndeterminate" v-model="materialBox.checkAll" @change="handleCheckAllChange">全选当前页</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="materialBox.checkedList" @change="handleCheckedCitiesChange">
            <div class="container">
              <div class="fluidLayoutParent">
                <div v-for="material in materialBox.materialList" class="fluidLayoutChild">
                  <div class="img-box"><img :src="material.cover_url" alt=""></div>
                  <p><el-checkbox class="select-box" :label="material.id">{{material.name}}</el-checkbox></p>
                </div>
              </div>
            </div>
          </el-checkbox-group>
          <div class="block pagnation">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageData.currentPage" :page-sizes="pageData.pageSizes" :page-size="pageData.size" layout="total, sizes, prev, pager, next, jumper" :total="pageData.total"></el-pagination>
          </div>
          <div slot="footer" class="dialog-footer block">
            <el-button @click="materialBox.isDialogShow = false">取 消</el-button>
            <el-button type="primary" @click="confirmMaterial">确 定</el-button>
          </div>
        </el-dialog>
      </el-aside>
      <el-main style="min-width: 60%;">
        <div class="tip"><p>素材展示</p></div>
        <el-table ref="multipleTable" :data="materialList" tooltip-effect="dark">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="素材预览">
            <template slot-scope="scope">
              <div style="width: 50px;height: 50px;"><img style="width: 100%;height: 100%;display: inline-block;" :src="scope.row.cover_url" alt=""></div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="素材名称"></el-table-column>
          <el-table-column label="播放时长(秒)">
            <template slot-scope="scope">
              <el-input type="number" min="3" max="15" @change="validateTime" :disabled="scope.row.type=='video'"  v-model="scope.row.duration"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button @click="deleteMaterialJsFunc(scope.row)" type="danger" size="small" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  import { addNewAd, editAd, uploadUrl, getPlanList, getAdDetail } from '@/api/ad_mag'
  import { getMaterialList } from '@/api/material'
  import { transformDateTime, combine } from '@/utils/index'
  import { getBindDevGroupList } from '@/api/device'
  import { Message } from 'element-ui'
  export default {
    data() {
      return {
        adId: '',
        adInfo: {
          ad_id: '',
          ad_name: '',
          plan_id: '',
          duration: -1,
          time: '',
          start_date: '',
          end_date: '',
          material_data: [],
          // 插播需要的参数
          group_id: '',
          start_time: '',
          end_time: '',
          play_count: ''
        },
        materialList: [],
        totalMaterialBox: [],
        planArr: [],
        durationArr: [
          { name: '自定义', value: -1 }, { name: '一周', value: 7 }, { name: '半个月', value: 15 },
          { name: '一个月', value: 30 }, { name: '三个月', value: 90 }, { name: '六个月', value: 180 }, { name: '一年', value: 365 }
        ],
        adTypeArr: [{ name: '普通广告', id: 1 }, { name: '定时广告', id: 2 }],
        deviceArr: [],
        // 上传文件相关
        uploadUrl: 'http://test.api.jhcm99.com/v0/material/upload',
        uploadFileList: [],
        dialogImageUrl: '',
        dialogVisible: false,
        // 上传地址
        uplaodHtmlData: {
          isDialogShow: false,
          form: { url: '', select: 'http://' }
        },
        adTemplate: '',
        // 分页
        pageData: {
          currentPage: 1,
          pageSizes: [10, 20, 30, 40],
          size: 10,
          total: 1,
          totalPage: 1
        },
        // 选择素材库资源
        materialBox: {
          isDialogShow: false,
          materialList: [],
          // 选中的数据
          checkedList: [],
          // 选中按钮的状态
          checkAll: false,
          isIndeterminate: false
        },
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        },
        rules: {
          ad_name: [
            { required: true, message: '请输入广告名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          plan_id: [
            { required: true, message: '请选择推广计划', trigger: 'change' }
          ],
          duration: [
            { type: 'date', required: true, message: '请选择投放时间', trigger: 'change' }
          ],
          group_id: [
            { required: true, message: '请选择设备组', trigger: 'change' }
          ]
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        nowTime: ['12:00:00'],
        start_time: '',
        end_time: '',
        time_long: 15
      }
    },
    created() {
      this.uploadUrl = 'http://test.api.jhcm99.com/v0/material/upload?token=' + this.$store.getters.token
      getPlanList(1, 10).then(res => {
        if (res.code === 200) this.planArr = res.data.list
      })
      getBindDevGroupList(0, 10).then(res => {
        if (res.code === 200) this.deviceArr = res.data.list
        if (this.adId) this.getAdDetailJsFunc(this.adId)
      })
      this.adId = this.$route.query.ad_id
      this.nowTime = [transformDateTime(new Date()).split(' ')[1]]
    },
    methods: {
      getAdDetailJsFunc(adId) {
        getAdDetail(adId).then(res => {
          if (res.code === 200) {
            this.adInfo.ad_id = res.data.id
            this.adInfo.ad_name = res.data.ad_name
            this.adInfo.start_date = res.data.start_date
            this.adInfo.end_date = res.data.end_date

            this.start_time = new Date(res.data.start_date + ' ' + res.data.start_time)
            this.end_time = res.data.end_date + ' ' + res.data.end_time

            this.materialList = res.data.material_data
            this.adInfo.plan_id = res.data.plan_id
            this.adInfo.group_id = res.data.group_id
            this.adInfo.play_count = JSON.parse(res.data.insert_play).play_count

            this.selectGroup(this.adInfo.group_id)
            if (res.data.insert_play) {
              const resTempObj = JSON.parse(res.data.insert_play)
              this.spotAdList = [{
                cycle: resTempObj.cycle,
                // 每天数据
                startTime: resTempObj.loop_start_time,
                endTime: resTempObj.loop_end_time,
                endType: resTempObj.endType,
                weekDay: resTempObj.weeks,
                playTime: resTempObj.play_count
              }]
            }
          }
        })
      },
      // 提交添加广告信息
      submitAdInfo() {
        this.adInfo.start_time = transformDateTime(this.start_time).split(' ')[1]
        this.adInfo.end_time = transformDateTime(this.end_time).split(' ')[1]
        this.adInfo.material_data = JSON.stringify(this.materialList)
        const adInfoFlag = (this.adInfo.material_data != '[]') && this.adInfo.start_time && this.adInfo.end_time && this.adInfo.ad_name && this.adInfo.plan_id
        if (!adInfoFlag) {
          Message({ message: '必填信息不能为空', type: 'error', duration: 3 * 1000 })
          return false
        }
        this.$refs['adInfo'].validate(validate => {
          if (validate) {
            if (this.adId) {
              editAd(this.adInfo).then(response => {
                if (response.code === 200) {
                  Message({
                    message: '广告修改成功',
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.$router.go(-1)
                } else {
                  Message({ message: response.message, type: 'error', duration: 3 * 1000 })
                }
              })
            } else {
              addNewAd(this.adInfo).then(response => {
                if ((+response.code) === 200) {
                  Message({
                    message: '广告添加成功',
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.$router.go(-1)
                } else {
                  Message({
                    message: response.message,
                    type: 'error',
                    duration: 3 * 1000
                  })
                }
              })
            }
          } else {
            Message({ message: '必填信息不能为空', type: 'error', duration: 3 * 1000 })
            return false
          }
        })
      },
      // 上传图片，预览图片
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      uploadFile(res, file, fileList) {
        const tempObj = file.response.data
        let duration = ''
        if (tempObj.duration) {
          duration = tempObj.duration == '0.00' ? '3' : tempObj.duration
        } else {
          duration = '3'
        }
        this.materialList.push({ material_id: tempObj.id, duration: duration, name: tempObj.name, cover_url: tempObj.cover_url, type: tempObj.type })

        let tempTime = 0
        let allTime = 0
        this.materialList.forEach(item => {
          allTime += (+item.duration)
          if (item.type != 'video') {
            tempTime += (+item.duration)
          }
        })
        this.computedEndTime(allTime)
        if (tempTime > 15) {
          Message({ message: '图片添加不能超过15秒，请选择删除！', type: 'error', duration: 3 * 1000 })
        }
      },
      // 上传url
      uploadHtmlUrl() {
        this.uplaodHtmlData.isDialogShow = false
        const uploadHtmlUrl = this.uplaodHtmlData.form.select + this.uplaodHtmlData.form.url
        uploadUrl(uploadHtmlUrl).then(response => {
          if (response.code === 200) {
            const tempObj = response.data
            let duration = ''
            if (tempObj.duration) {
              duration = tempObj.duration == '0.00' ? '3' : tempObj.duration
            } else {
              duration = '3'
            }
            this.materialList.push({ material_id: tempObj.id, duration: duration, name: tempObj.name, cover_url: tempObj.cover_url, type: tempObj.type })

            let tempTime = 0
            let allTime = 0
            this.materialList.forEach(item => {
              allTime += (+item.duration)
              if (item.type != 'video') {
                tempTime += (+item.duration)
              }
            })
            this.computedEndTime(allTime)
            if (tempTime > 15) {
              Message({ message: '图片添加不能超过15秒，请选择删除！', type: 'error', duration: 3 * 1000 })
            }
          }
        })
      },
      // 移除文件
      handleRemove(file, fileList) {
        console.log(fileList)
        const tempArr = []
        fileList.forEach((item, index) => {
          tempArr.push({ material_id: item.response.data[0].id, duration: '30' })
        })
        this.materialList = tempArr
      },
      // 选择设备组
      selectGroup(val) {
        const tempObj = this.deviceArr.filter(item => item.id == val)[0]
        this.adTemplate = tempObj.template_name + '(' + tempObj.width + '*' + tempObj.height + ')'
      },
      // 从素材库选取
      selectFromMaterialBox() {
        this.materialBox.isDialogShow = true
        this.materialBox.checkedList = []
        this.materialBox.checkAll = false
        this.pageData.currentPage = 1
        this.fetchData({ currentPage: this.pageData.currentPage, type: this.pageData.type })
      },
      // 获取数据，分页改变
      fetchData(paramsObj) {
        this.listLoading = true
        getMaterialList(paramsObj).then(response => {
          if (response.code === 200) {
            this.totalMaterialBox = combine(this.totalMaterialBox, response.data.list)
            this.materialBox.materialList = response.data.list
            this.materialBox.materialList.map(item => { item.is_selected = false })
            this.pageData.total = +response.data.count
            this.pageData.totalPage = response.data.all_page
            this.isCheckedAllFlag()
          }
        })
      },
      handleSizeChange(val) {
        this.pageData.size = val
        this.fetchData({ currentPage: this.pageData.currentPage, type: val })
      },
      handleCurrentChange(val) {
        console.log(val)
        this.pageData.currentPage = val
        this.fetchData({ currentPage: val, type: this.pageData.type })
      },
      // 素材库全选
      handleCheckAllChange(val) {
        const tempList = this.materialBox.materialList.map(item => item.id)
        console.log(tempList)
        if (val) {
          // 如果全选，选中当前页
          this.materialBox.checkedList = combine(this.materialBox.checkedList, tempList)
        } else {
          // 取消全选，删除当前页的内容
          this.materialBox.checkedList = this.materialBox.checkedList.map(item => {
            return tempList.includes(item) ? '' : item
          }).filter(tag => tag !== '')
        }
        console.log(this.materialBox.materialList)
      },
      handleCheckedCitiesChange(value) {
        this.materialBox.checkedList = value
        this.isCheckedAllFlag()
      },
      isCheckedAllFlag() {
        const currentList = this.materialBox.materialList.map(item => item.id)
        const isChecked = currentList.every(item => this.materialBox.checkedList.includes(item))
        this.materialBox.checkAll = !!isChecked
      },
      // tab切换
      handleClick(tab) {
        this.pageData.type = tab.name
        this.pageData.currentPage = 1
        this.fetchData({ currentPage: this.pageData.currentPage, type: this.pageData.type })
      },
      confirmMaterial() {
        console.log(this.totalMaterialBox)
        this.materialBox.checkedList.forEach(item => {
          const tempObj = this.totalMaterialBox.filter(material => material.id == item)[0]
          const duration = tempObj.duration == '0.00' ? '3' : tempObj.duration
          this.materialList.push({ material_id: item, duration: duration, name: tempObj.name, cover_url: tempObj.cover_url, type: tempObj.type })
        })
        this.materialBox.isDialogShow = false
        this.validateTime()
      },
      // 删除素材
      deleteMaterialJsFunc(item) {
        this.$confirm('是否确认删除该素材?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.materialList.forEach((material, index) => {
            if (material.material_id === item.material_id) {
              this.materialList.splice(index, 1)
              return
            }
          })
        }).catch(() => {})
      },

      // 计算素材时间
      computedEndTime(timeLong) {
        console.log('时间长度'+timeLong, this.adInfo.play_count)
        this.end_time = transformDateTime(Date.parse(this.start_time) + (timeLong * 1000 * (+this.adInfo.play_count)))
      },
      validateEndTime(end_time) {
        if (Date.parse(end_time) - Date.parse(this.adInfo.start_date) < 0) {
          Message({ message: '结束时间不能小于开始时间', type: 'error', duration: 3 * 1000 })
          this.adInfo.end_date = ''
        }
      },
      changeStartDate() {
        if (this.adInfo.duration != -1) {
          this.adInfo.end_date = transformDateTime(Date.parse(this.adInfo.start_date) + (24 * 3600 * 1000 * (+this.adInfo.duration))).split(' ')[0]
        }
      },
      validateTime() {
        this.time_long = 0
        let tempTime = 0
        this.materialList.forEach(item => {
          console.log('执行了')
          this.time_long += (+item.duration)
          if (item.type != 'video') {
            tempTime += (+item.duration)
          }
        })
        console.log(tempTime, this.time_long)
        this.computedEndTime(this.time_long)
        if (tempTime > 15) {
          Message({ message: '图片添加不能超过15秒，请选择删除！', type: 'error', duration: 3 * 1000 })
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tip {
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 20px 0;
  }
  .add-material-box{
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    vertical-align: top;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    outline: 0;
    padding-top: 40px;
    .text{
      text-align: center;
    }
  }
  .add-material-box:hover, .add-material-box:focus {
    border-color: #409EFF;
    color: #409EFF;
  }
  /*流式布局*/
  .fluidLayoutParent{
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
  }
  .fluidLayoutChild{
    box-sizing: border-box;
    flex: 0 0 160px;
    padding: 8px 4px;
    height: 200px;
    .img-box{
      height: 152px;
      overflow: hidden;
      border: 1px solid #ccc;
      img{
        width: 100%;
        height: 100%;
      }
    }
    p{
      display: flex;
      margin-top: 8px;
      .select-box{
        width: 150px;
        white-space: nowrap;
        overflow: hidden;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
      }
    }
  }
  .block{
    text-align: center;
  }
  .el-main{
    padding: 0 40px;
  }
</style>
