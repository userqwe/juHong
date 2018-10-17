<template>
  <div class="app-container">
    <el-container>
      <el-aside style="width: 60%;min-width: 630px;">
        <div class="tip"><p>基本信息</p></div>
        <el-form ref="adInfo" :model="adInfo" label-width="80px">
          <!--广告名称-->
          <el-form-item label="广告名称" status-icon prop="ad_name"><el-col :span="11"><el-input disabled v-model="adInfo.ad_name" clearable></el-input></el-col></el-form-item>
          <!--推广计划-->
          <el-form-item label="推广计划" prop="plan_id">
            <el-col :span="11">
              <el-select v-model="adInfo.plan_id" disabled clearable placeholder="请选择推广计划" style="width: 100%;">
                <el-option v-for="item in planArr" :key="item.id" :label="item.plan_name" :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-col :span="11"><el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd" disabled value-format="yyyy-MM-dd" v-model="adInfo.start_date" style="width: 100%;"  ></el-date-picker></el-col>
            <el-col class="line" :span="1" style="text-align: center;">-</el-col>
            <el-col :span="8"><el-time-picker type="fixed-time" v-model="adInfo.start_time" disabled placeholder="选择开始时间" style="width: 100%;"></el-time-picker></el-col>
          </el-form-item>
          <!--结束时间-->
          <el-form-item label="结束时间">
            <el-col :span="11"><el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd" disabled value-format="yyyy-MM-dd" v-model="adInfo.end_date" style="width: 100%;" :disabled="adInfo.duration!=-1"  ></el-date-picker></el-col>
            <el-col class="line" :span="1" style="text-align: center;">-</el-col>
            <el-col :span="8"><el-time-picker type="fixed-time" v-model="adInfo.end_time" disabled placeholder="结束时间" style="width: 100%;"></el-time-picker></el-col>
          </el-form-item>
        </el-form>
        <el-form  ref="adInfo" :model="adInfo" label-width="80px" >
          <el-form-item label="设备组" prop="group_id">
            <el-col :span="11">
              <el-select v-model="adInfo.group_id" disabled clearable placeholder="请选择设备组"  style="width: 100%;">
                <el-option v-for="dev in deviceArr" :key="dev.id" :label="dev.group_name" :value="dev.id"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="广告位">
            <span>{{templateInfo.width}}*{{templateInfo.height}}</span>
          </el-form-item>
        </el-form>
        <el-form ref="adInfo" :model="adInfo" label-width="80px" >
          <el-form-item label="播放次数" prop="group_id">
            <el-input-number  v-model="adInfo.play_count" disabled label="描述文字"></el-input-number>
          </el-form-item>
        </el-form>

        <!--图片预览-->
        <el-dialog :visible.sync="dialogVisible">
          <img v-if="materialType==='image'" style="width: 100%;" class="preview-image" :src="previewImageUrl" alt="">
          <video v-if="materialType==='video'" style="width: 100%;" class="preview-image" :src="previewImageUrl" controls="controls"></video>
        </el-dialog>
        <div class="tip"><p>素材展示</p></div>
        <el-table ref="multipleTable" :data="adInfo.material_data" tooltip-effect="dark">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="素材预览">
            <template slot-scope="scope">
              <div @click="materialPreview(scope.row)" style="width: 50px;height: 50px;"><img style="width: 100%;height: 100%;display: inline-block;" :src="scope.row.cover_url" alt=""></div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="素材名称"></el-table-column>
          <el-table-column label="播放时长(秒)">
            <template slot-scope="scope">
              <el-input type="number" disabled  v-model="scope.row.duration"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
    </el-container>

  </div>
</template>

<script>
  import { getPlanList, getAdDetail } from '@/api/ad_mag'
  import { transformDateTime } from '@/utils/index'
  import { getBindDevGroupList } from '@/api/device'
  export default {
    data() {
      return {
        adInfo: {},
        planArr: [],
        deviceArr: [],
        templateInfo: {},
        dialogVisible: false,
        previewImageUrl: '',
        materialType: ''
      }
    },
    created() {
      this.adId = this.$route.query.ad_id
      getPlanList(1, 10).then(res => {
        if (res.code === 200) this.planArr = res.data.list
      })
      getBindDevGroupList(0, 10).then(res => {
        if (res.code === 200) {
          this.deviceArr = res.data.list
          if (this.adId) this.getAdDetailJsFunc(this.adId)
        }
      })
    },
    methods: {
      getAdDetailJsFunc(adId) {
        getAdDetail(adId).then(res => {
          if (res.code === 200) {
            this.adInfo = res.data
            // 处理开始结束时间
            this.adInfo.start_time = transformDateTime('2018-08-15 ' + this.adInfo.start_time)
            this.adInfo.end_time = transformDateTime('2018-08-15 ' + this.adInfo.end_time)
            // 处理设备组模板
            this.templateInfo = this.deviceArr.filter(device => device.id === this.adInfo.group_id)[0]
            // 次数
            this.adInfo.play_count = JSON.parse(this.adInfo.insert_play).play_count
          }
        })
      },
      materialPreview(material) {
        this.dialogVisible = true
        this.previewImageUrl = material.material_url
        this.materialType = material.material_type
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
