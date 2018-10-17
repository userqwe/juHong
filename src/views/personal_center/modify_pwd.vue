<template>
  <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm margin-top" label-position="center" style="width: 600px;">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input type="password" v-model="ruleForm2.oldPassword" placeholder="请输入旧密码" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="pass">
      <el-input type="password" v-model="ruleForm2.pass"  placeholder="请输入新密码" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass"  placeholder="请确认新密码" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
      <el-button @click="resetForm('ruleForm2')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import { modify_pwd } from '@/api/user'
  import { Message } from 'element-ui'
  export default {
    data() {
      var validateOldPas = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm2.oldPassword !== '') {
            this.$refs.ruleForm2.validateField('pass')
          }
          callback()
        }
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        ruleForm2: {
          oldPassword: '',
          pass: '',
          checkPass: '',
          age: ''
        },
        rules2: {
          oldPassword: [
            { validator: validateOldPas, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        labeWidth: '300px'
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.ruleForm2)
            modify_pwd(this.ruleForm2).then(res => {
              if (res.code === 200) {
                Message({
                  message: '密码修改成功',
                  type: 'success',
                  duration: 3 * 1000
                })
                setTimeout(() => {
                  location.reload()
                }, 2000)
              }
            })
          } else {
            Message({
              message: '密码填写不符合要求，请检查后填写',
              type: 'error',
              duration: 3 * 1000
            })
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>
.margin-top{
  margin-top: 50px;
}
</style>
