<template>
    <div class="week-container">
      <div style="display: inline-block">
        <div class="tabList">
          <li v-for="(week, index) in weekList" @click="changeWeek(week, index)" class="tab centerMiddleFlex" :class="index == currentIndex ? 'active': ''">
            <p>{{week.week}}</p>
            <p>{{week.date.split(' ')[0]}}</p>
          </li>
        </div>
      </div>
      <el-date-picker
        style="vertical-align: middle;margin-top: 26px;"
        v-model="selectDate"
        type="date"
        placeholder="选择日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        @change="dateChange"
        :picker-options="pickerOptions1">
      </el-date-picker>
    </div>
</template>

<script>
  import { transformDateTime } from '@/utils/index'
  export default {
    name: 'week',
    data() {
      return {
        weekList: [],
        currentIndex: 1,
        pickerOptions1: {
          disabledDate(time) {
            // return time.getTime() < Date.now()
          },
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
        selectDate: '',
        weekArray: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      }
    },
    created() {
      this.selectDate = transformDateTime(new Date())
      this.dateChange()
    },
    methods: {
      changeWeek(week, index) {
        this.currentIndex = index
        this.selectDate = week.date.split(' ')[0]
        this.dateChange(week.date)
      },
      dateChange(date) {
        console.log(date)
        const datetime = date ? new Date(date) : new Date()
        const week_id = datetime.getDay() || 7
        this.currentIndex = week_id - 1
        const mondayTime = new Date(Date.parse(datetime) - ((week_id - 1) * 24 * 3600 * 1000))
        this.weekList = []
        for (let i = 0; i < 7; i++) {
          const tempTime = Date.parse(mondayTime) + (i * 24 * 3600 * 1000)
          this.weekList.push({ date: transformDateTime(tempTime), week: this.weekArray[new Date(tempTime).getDay()], id: i, week_id: new Date(tempTime).getDay() })
        }
        this.$emit('getlist', this.selectDate)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss"  scoped>
.tabList{
  display: flex;
  width: 842px;
  margin-top: 10px;
  .tab{
    flex: 0 0 120px;
    height: 100px;
    background: #ededed;
    padding: 22px 0;
    list-style: none;
    cursor: pointer;
    p{
      text-align: center;
      font: 14px/28px 'microsoft yahei';
      margin: 0;
    }
  }
  .tab:hover{
    background: rgb(64, 158, 255);
  }
  .active{
    background: rgb(64, 158, 255);
    color: #fff;
  }
}
</style>
