<template>
  <div>
    <week ref="week" @getlist="changeShowTime"></week>
    <swiper :options="swiperOption" class="gallery-top" ref="swiperTop">
      <swiper-slide v-for="slide in durationList" :key="slide.start_time">{{slide.start_time}}-{{slide.end_time}}</swiper-slide>
      <!-- Optional controls -->
      <div class="swiper-pagination"  slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
      <div class="swiper-scrollbar"   slot="scrollbar"></div>
    </swiper>
    <div class="list-container" v-for="dev in showList">
      <div class="dev-group">{{dev.group_name}}</div>
      <div class="list-item">
        <ul class="ad-box" :style="'transform: translateX(-'+marginVal+')'">
          <li class="ad" v-for="ad in dev.ad_show[0]" :style="'width: '+(ad.percent)+'%;'">
            <p class="textOverflow title">{{ad.ad_name}}({{ad.status | statusFilter}})</p>
            <p class="textOverflow time">{{ad.start_time}}-{{ad.end_time}}</p>
            <el-tooltip placement="top">
              <div slot="content">{{ad.ad_name}}({{ad.status | statusFilter}})<br/>{{ad.start_time}}-{{ad.end_time}}</div>
              <div class="hover-box" @click.prevent="dialogShow(ad)">
                <el-button @click.stop="operateAdHandler(ad, 5)" :class="ad.status==4 && 'hide'" type="primary" size="small" plain>查看</el-button>
                <el-button @click.stop="operateAdHandler(ad, 0)" class="hide" :class=" ad.status==4&&'show'" type="primary" size="small" plain>添加</el-button>
                <el-button @click.stop="operateAdHandler(ad, 1)" class="hide" :class=" ad.status==2&&'show'" type="success" size="small" plain>启用</el-button>
                <el-button @click.stop="operateAdHandler(ad, 2)" class="hide" :class=" ad.status==1&&'show'" type="info" size="small"  plain>暂停</el-button>
                <el-button @click.stop="operateAdHandler(ad, 3)" class="hide" :class=" (ad.status==-1)&&'show'" type="warning" size="small" plain>编辑</el-button>
                <el-button @click.stop="operateAdHandler(ad, 4)" :class="ad.status==4 && 'hide'" type="danger" size="small" plain>删除</el-button>
              </div>
            </el-tooltip>
          </li>
        </ul>
      </div>
    </div>
    <p v-if="!showList.length" style="text-align: center;">暂无设备组节目单信息</p>
    <el-dialog title="广告信息" :visible.sync="isDialogShow">
      <el-form>
        <el-form-item label="名称" :label-width="classifyInfo.formLabelWidth">
          <el-input  v-model="adInfo.ad_name" clearable disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="classifyInfo.formLabelWidth">
          <el-input  v-bind:value="adInfo.status | statusFilter" clearable disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="classifyInfo.formLabelWidth">
          <el-input  v-model="adInfo.start_time" clearable disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="classifyInfo.formLabelWidth">
          <el-input  v-model="adInfo.end_time" clearable disabled auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="isDialogShow = false">取 消</el-button>
        <el-button @click.prevent="operateAdHandler(adInfo, 5)" :class="adInfo.status==4 && 'hide'" type="success" size="small" plain>查看</el-button>
        <el-button @click.prevent="operateAdHandler(adInfo, 0)" class="hide" :class=" adInfo.status==4&&'show'" type="primary" size="small" plain>添加广告</el-button>
        <el-button @click.prevent="operateAdHandler(adInfo, 1)" class="hide" :class=" adInfo.status==2&&'show'" type="success" size="small" plain>启用</el-button>
        <el-button @click.prevent="operateAdHandler(adInfo, 2)" class="hide" :class=" adInfo.status==1&&'show'" type="info" size="small"  plain>暂停</el-button>
        <el-button @click.prevent="operateAdHandler(adInfo, 3)" class="hide" :class=" (adInfo.status==-1)&&'show'" type="warning" size="small" plain>编辑</el-button>
        <el-button @click.prevent="operateAdHandler(adInfo, 4)" :class="adInfo.status==4 && 'hide'" type="danger" size="small" plain>删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { showList, changeAdStatus, stopAd } from '@/api/ad_mag'
  import week from './ad_list_components/week'
  import { adShowHandler, returnPercent } from '@/utils/index'
  export default {
    data() {
      return {
        swiperOptionThumbs: {
          centeredSlides: true,
          slidesPerView: 'auto',
          noSwiping: true, // 禁止切换
          // allowSlideNext: false,
          // allowSlidePrev: false,
          touchRatio: 0.2,
          slideToClickedSlide: true,
          loop: false,
          normalizeSlideIndex: true, // 索正常化
          spaceBetween: 0, // slide之间的距离
          loopFillGroupWithBlank: true
        },
        swiperOption: {
          initialSlide: 0, // 起始位置
          slidesPerView: 1,
          slidesPerGroup: 1,
          loop: false,
          normalizeSlideIndex: true, // 索正常化
          spaceBetween: 0, // slide之间的距离
          loopFillGroupWithBlank: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          on: {
            slideChange: this.slideChangeCallback
          }
        },
        classifyInfo: {
          isAddFlag: true,
          dialogShow: false,
          name: '所有分类',
          title: '添加分类',
          formLabelWidth: '120px'
        },
        showListParams: {
          show_date: '',
          start_time: '09:00:00',
          count: 1,
          interval: 60 * 60 * 12
        },
        currentIndex: 0,
        showList: [],
        isDialogShow: false,
        labelPosition: 'right',
        adInfo: {},
        durationList: [
          { id: 1, start_time: '09:00:00', end_time: '10:00:00' },
          { id: 2, start_time: '10:00:00', end_time: '11:00:00' },
          { id: 3, start_time: '11:00:00', end_time: '12:00:00' },
          { id: 4, start_time: '12:00:00', end_time: '13:00:00' },
          { id: 5, start_time: '13:00:00', end_time: '14:00:00' },
          { id: 6, start_time: '14:00:00', end_time: '15:00:00' },
          { id: 7, start_time: '15:00:00', end_time: '16:00:00' },
          { id: 8, start_time: '16:00:00', end_time: '17:00:00' },
          { id: 9, start_time: '17:00:00', end_time: '18:00:00' },
          { id: 10, start_time: '18:00:00', end_time: '19:00:00' },
          { id: 11, start_time: '19:00:00', end_time: '20:00:00' },
          { id: 12, start_time: '20:00:00', end_time: '21:00:00' }
        ]
      }
    },
    computed: {
      marginVal() {
        return (this.currentIndex * 100 / 12) + '%'
      }
    },
    mounted() {
      this.showListParams.show_date = this.$refs.week.selectDate.split(' ')[0]
      this.getShowList(this.showListParams)
    },
    filters: {
      statusFilter(status) {
        // -1审核不通过 0:待审核 1:投放中 2:暂停 3:已过期
        const statusMap = {
          '-1': '审核不通过',
          '0': '待审核',
          '1': '投放中',
          '2': '暂停',
          '3': '已过期',
          '4': '待添加'
        }
        return statusMap[status]
      },
      colorFilter(status) {
        const statusMap = {
          '-1': '审核不通过',
          '0': '待审核',
          '1': '投放中',
          '2': '暂停',
          '3': '已过期'
        }
        return statusMap[status]
      }
    },
    methods: {
      slideChangeCallback() {
        const index = this.$refs.swiperTop.swiper.realIndex + 1
        this.currentIndex = this.$refs.swiperTop.swiper.realIndex || 0

        // this.showListParams.start_time = this.durationList[index].start_time
        // this.showListParams.end_time = this.durationList[index + 2].end_time
        // this.getShowList(this.showListParams)
      },
      getShowList(params) {
        showList(params).then(res => {
          this.showList = res.data
          this.showList.map(dev_group => {
            const list = dev_group.ad_show[0]
            dev_group.ad_show.splice(0, 1, adShowHandler('09:00:00', '21:00:00', list))
          })

          this.showList.map(item => {
            item.ad_show[0].map(ad => {
              ad.percent = returnPercent(ad.start_time, ad.end_time)
            })
          })

          console.log(this.showList)
        })
      },
      changeShowTime(select_time) {
        this.showListParams.show_date = select_time
        this.getShowList(this.showListParams)
      },
      operateAdHandler(ad, event) {
        // 添加
        if (event == 0) {
          this.isDialogShow = false
          this.$router.push('/ad_mag/ad_pub?start_time='+ad.start_time+'&end_time='+ad.end_time)
        }
        // 启用
        if (event == 1) {
          changeAdStatus(ad.ad_id, 1).then(res => {
            if (res.code == 200) {
              this.isDialogShow = false
              this.getShowList(this.showListParams)
            }
          })
        }
        // 暂停
        if (event == 2) {
          changeAdStatus(ad.ad_id, 0).then(res => {
            if (res.code == 200) {
              this.isDialogShow = false
              this.getShowList(this.showListParams)
            }
          })
        }
        // 编辑
        if (event == 3) {
          this.isDialogShow = false
          this.$router.push('/ad_mag/ad_pub?start_time='+ad.start_time+'&end_time='+ad.end_time+'&ad_id='+ad.ad_id)
        }
        // 删除
        if (event == 4) {
          stopAd(ad.ad_id).then(res => {
            if (res.code == 200) {
              this.isDialogShow = false
              this.getShowList(this.showListParams)
            }
          })
        }
        // 删除
        if (event == 5) {
          this.$router.push({ path: '/ad_mag/ad_detail', query: { ad_id: ad.ad_id }})
        }
      },
      dialogShow(ad) {
        this.isDialogShow = true
        this.adInfo = ad
      },
      callback() {}
    },
    components: {
      week
    }
  }
</script>

<style lang="scss" scoped>
  .swiper-container {
    /*background-color: #fff;*/
  }
  .swiper-slide {
    background-size: cover;
    background-position: center;
  }
  .gallery-top {
    height: 80%!important;
    width: 100%;
  }
  .gallery-thumbs {
    /*height: 20%!important;*/
    box-sizing: border-box;
    padding: 10px 0;
  }
  .gallery-thumbs .swiper-slide {
    width: 25%;
    height: 100%;
    opacity: 0.4;
  }
  .gallery-thumbs .swiper-slide-active {
    opacity: .4;
  }
  .swiper-container{
    height: 100%!important;
    width: 100%;
  }
  .swiper-slide{
    text-align: center;
    font: 800 26px/60px 'microsoft yehei';
    background: #c0c4cc;
    color: rgb(64, 158, 255);
  }
  .swiper-button-prev, .swiper-button-next {
    position: absolute;
    top: 50%;
    width: 13px;
    height: 22px;
    margin-top: -12px;
    z-index: 10;
    cursor: pointer;
    background-size: 13px 22px;
    background-position: center;
    background-repeat: no-repeat;
  }
  .swiper-container-horizontal > .swiper-scrollbar{
    display: none;
  }
  .list-container{
    display: flex;
    height: 80px;
    margin-bottom: 24px;
    box-shadow:-5px 4px 9px #999;
    .dev-group{
      flex: 0 0 120px;
      line-height: 80px;
      text-align: center;
      color: #66667F;
      border-right: 2px solid #B7B7B7;
    }
    .list-item{
      flex: 1;
      overflow: hidden;
      .ad-box{
        width: 1200%;
        height: 100%;
        -webkit-transition: all .3s;
        -moz-transition: all .3s;
        -ms-transition: all .3s;
        -o-transition: all .3s;
        transition: all .3s;
        list-style: none;
        margin: 0;
        padding: 0;
        .ad{
          float: left;
          padding: 10px 0;
          height: 100%;
          border-right: 1px solid #ccc;
          overflow: hidden;
          position: relative;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          p{
            font: 12px/30px 'microsoft yahei';
            text-align: left;
            padding-left: 5px;
          }
          .title{
            font-weight: bold;
          }
          .time{
            color: #919191;
          }
          .hover-box{
            position: absolute;
            background: rgba(0, 0, 0, .1);
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            display: none;
            padding: 10px;
          }
        }
        .ad:hover .hover-box{
          display: block;
        }
        .ad:hover p{
          visibility: hidden;
        }
      }
    }
  }
  .textOverflow{
    white-space: nowrap;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
  }
  p{
    margin: 0;
    padding: 0;
  }
  .slide-style{
    background: #ccc;
    height: 100%;
    border: 1px solid #f00;
  }
  .hide{
    display: none;
  }
  .show{
    display: inline-block;
  }
</style>

