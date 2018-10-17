<template>
  <div class="app-container">
    <el-form :rules="rules" ref="deviceInfo" :model="deviceInfo" label-width="120px">
      <el-form-item v-show="!editFlag" required label="设备编号" prop="device_no">
        <el-input v-model="deviceInfo.device_no" :disabled="editFlag" clearable></el-input>
      </el-form-item>

      <el-form-item v-show="editFlag" required label="设备编号" prop="iot_device_id">
        <el-input v-model="deviceInfo.iot_device_id" :disabled="editFlag" clearable></el-input>
      </el-form-item>


      <el-form-item required label="设备名称" prop="device_name">
        <el-input v-model="deviceInfo.device_name" clearable></el-input>
      </el-form-item>

      <el-form-item label="所在地区">
        <el-cascader
          :props="props"
          :options="options"
          @change="handleChange">
        </el-cascader>
      </el-form-item>

      <el-form-item label="详细地址">
        <el-input v-model="deviceInfo.address" clearable></el-input>
      </el-form-item>

      <el-form-item label="开放设备" required>
        <el-radio-group v-model="deviceInfo.open">
          <el-radio label="1">开放</el-radio>
          <el-radio label="0">不开放</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="添加到设备组" required>
        <el-select v-model="deviceInfo.device_group_no" placeholder="选择设备组">
          <el-option v-for="group in groupList" :key="group.id" :label="group.group_name" :value="group.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="公司名称">
        <el-input v-model="deviceInfo.company" clearable></el-input>
      </el-form-item>

      <el-form-item label="申请人">
        <el-input v-model="deviceInfo.applicant" clearable></el-input>
      </el-form-item>

      <el-form-item label="联系电话">
        <el-input v-model="deviceInfo.phone" clearable></el-input>
      </el-form-item>

      <el-form-item label="安装人">
        <el-input v-model="deviceInfo.installer" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitDeviceInfo">{{deviceId ? '保存修改' : '立即创建'}}</el-button>
        <el-button @click="onCancel">清除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getAreaList, newDevice, getDevGroupList, getDeviceDetail, editDevice } from '@/api/device'
  import { Message } from 'element-ui'

  export default {
    data() {
      return {
        deviceId: '',
        deviceInfo: {
          device_no: '',
          device_name: '',
          area_code: '',
          address: '',
          open: '1',
          phone: '',
          installer: '',
          applicant: '',
          company: '',
          device_group_no: '',
          iot_device_id: ''
        },
        groupList: [],
        options: [],
        props: {
          label: 'name',
          value: 'id',
          children: 'child'
        },
        rules: {
          device_no: [
            { required: true, message: '设备编号不能为空', trigger: 'blur' },
            { min: 12, max: 32, message: '请输入符合规则的设备编号', trigger: 'blur' }
          ],
          device_name: [
            { required: true, message: '设备名称不能为空', trigger: 'blur' },
            { min: 2, max: 50, message: '请输入符合规则的设备编号', trigger: 'blur' }
          ]
        },
        editFlag: false
      }
    },
    mounted() {
      this.getArea()
      this.deviceId = this.$route.query.dev_id
      getDevGroupList(0, 10).then(res => {
        if (res.code === 200) {
          this.groupList = res.data.list
          this.deviceInfo.device_group_no = this.groupList[0].id
          if (this.deviceId) {
            this.getDeviceDetailInfo(this.deviceId)
          }
        }
      })
    },
    methods: {
      getDeviceDetailInfo(device_id) {
        getDeviceDetail(device_id).then(res => {
          if (res.code === 200) {
            this.deviceInfo.address = res.data.address
            this.deviceInfo.applicant = res.data.applicant
            this.deviceInfo.area_code = res.data.area_code
            this.deviceInfo.device_group_no = res.data.group_id
            this.deviceInfo.installer = res.data.installer
            this.deviceInfo.open = res.data.open
            this.deviceInfo.phone = res.data.phone
            this.deviceInfo.device_name = res.data.device_name
            this.deviceInfo.company = res.data.company
            this.deviceInfo.iot_device_id = res.data.iot_device_name
            this.deviceInfo.device_id = res.data.device_id
            this.editFlag = true
          }
        })
      },
      submitDeviceInfo() {
        if (this.deviceId) {
          const tempData = {
            device_id: this.deviceInfo.device_id,
            device_name: this.deviceInfo.device_name,
            area_code: this.deviceInfo.area_code,
            address: this.deviceInfo.address,
            open: this.deviceInfo.open,
            group_id: this.deviceInfo.device_group_no,
            phone: this.deviceInfo.phone,
            installer: this.deviceInfo.installer,
            applicant: this.deviceInfo.applicant,
            company: this.deviceInfo.company
          }
          editDevice(tempData).then(res => {
            if (res.code === 200) {
              Message({
                message: res.data.error_msg || '设备修改成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.$router.push('/device/index')
            }
          })
        } else {
          if (!this.deviceInfo.device_no || !this.deviceInfo.device_name) {
            Message({
              message: '必填信息不能为空',
              type: 'error',
              duration: 3 * 1000
            })
            return
          }
          newDevice(this.deviceInfo).then(response => {
            if (response.code === 200) {
              Message({
                message: response.data.error_msg || '设备添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.$router.push('/device/index')
            }
          })
        }
      },
      onCancel() {
        this.$message({
          message: 'cancel!',
          type: 'warning'
        })
      },
      getArea() {
        getAreaList().then(response => {
          this.options = response.data.list
        })
      },
      handleChange(val) {
        console.log(val)
        this.deviceInfo.area_code = val[2]
      }
    }
  }
</script>

<style scoped>
  .line{
    text-align: center;
  }
  .app-container{
    width: 56%;
    min-width: 400px;
  }
</style>

