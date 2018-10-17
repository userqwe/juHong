<template>
  <div class="dashboard-container">
    <h3 @click="changeName">这是首页</h3>
    <p>{{name}}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPlanList } from '@/api/ad_mag'

export default {
  name: 'home',
  data() {
    return {
      obj: {
        name: 'hufei',
        age: 15
      },
      arr: []
    }
  },
  created() {
    this.arr.push(this.obj)
    getPlanList(1).then(response => {
      console.log(response)
    })
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    changeName() {
      const temp = this.obj
      this.obj.name = 'test'
      this.arr = temp
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
