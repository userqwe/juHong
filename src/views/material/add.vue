<template>
  <div class="app-container">
    <el-form>
      <el-form-item label="上传素材分类">
        <el-select v-model="paramsObj.group_type" placeholder="请选择素材分类">
          <el-option v-for="classify in classifyList" :label="classify.type_name" :value="classify.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="tip">
      <p>上传图片</p>
    </div>
    <el-upload
      :action="uploadUrl"
      list-type="picture-card"
      :data="paramsObj"
      :on-success="uploadFile"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <div class="tip">
      <p>上传视频</p>
    </div>
    <el-upload
      class="upload-demo"
      :action="uploadUrl"
      :data="paramsObj"
      :on-success="uploadFile"
      :on-change="handleChange"
      :file-list="fileList3">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip"></div>
    </el-upload>
  </div>
</template>

<script>
  import { getMaterialTypeList } from '@/api/material'
  import { Message } from 'element-ui'
  export default {
    data() {
      return {
        uploadUrl: '',
        dialogImageUrl: '',
        dialogVisible: false,
        fileList3: [],
        classifyList: [],
        paramsObj: {
          group_type: '0'
        }
      }
    },
    created() {
      this.uploadUrl = 'http://test.api.jhcm99.com/v0/material/upload?token=' + this.$store.getters.token
      this.getTypeList()
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleChange(file, fileList) {
        this.fileList3 = fileList.slice(-3)
      },
      uploadFile(res, file, fileList) {
        if (file.response.code == 200) {
          Message({
            message: '素材上传成功',
            type: 'success',
            duration: 3 * 1000
          })
        }
      },
      // 素材分类相关操作
      getTypeList() {
        getMaterialTypeList().then(res => {
          this.classifyList = res.data.list
          this.classifyList.unshift({ id: '0', type_name: '所有分类' })
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-container{
    max-width: 800px;
  }
  .tip {
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 20px 0;
  }
</style>
