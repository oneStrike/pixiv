<template>
  <view class="pixiv">
    <!--头部导航-->
    <view class="pixiv_head">
      <view class="head">
        <view class="head1">
          <image src="@/static/images/menu.svg"></image>
        </view>
        <navigator class="head_index head1"
                   src="/pages/index/index"
                   open-type="reLaunch"
                   hover-class="none">
          <image src="@/static/images/pixiv.svg"></image>
        </navigator>
        <view class="head1">
          <image src="@/static/images/search.svg"></image>
        </view>
      </view>
      <view class="head">
        <view :class="['rank',activeSector === 'dailyList' ? 'active_sector':'']"
              @click="toggleSector('dailyList')">
          <text>日榜</text>
        </view>
        <view :class="['rank',activeSector === 'weeklyList' ? 'active_sector':'']"
              @click="toggleSector('weeklyList')">
          <text>周榜</text>
        </view>
        <view :class="['rank',activeSector === 'monthlyList' ? 'active_sector':'']"
              @click="toggleSector('monthlyList')">
          <text>月榜</text>
        </view>
      </view>
    </view>

    <!--图片列表-->

    <view class="pixiv_list">
      <view class="list_container"
            v-show="activeSector === 'dailyList'">
        <imageList :listData="dailyList.data"></imageList>
      </view>
      <view class="list_container"
            v-show="activeSector === 'weeklyList'">
        <imageList :listData="weeklyList.data"></imageList>
      </view>
      <view class="list_container"
            v-show="activeSector === 'monthlyList'">
        <imageList :listData="monthlyList.data"></imageList>
      </view>
    </view>
  </view>
</template>

<script>
import {pixiv} from '@/../api/api'
import {utils} from '@/utils/utils'

import imageList from '@/components/common/imageList/imageList'

export default {
  data() {
    return {
      activeSector: '',
      dailyList: {data: [], pn: 1,},
      weeklyList: {data: [], pn: 1,},
      monthlyList: {data: [], pn: 1,},
      currentSector: {},
    }
  },
  async onLoad() {
    this.activeSector = 'dailyList'
  },
  async onReachBottom() {
    if (this.loading) return;
    this.loading = true;
    this[this.activeSector].data = this[this.activeSector].data.concat(await this.requestHomeData())
    this.loading = false;
  },
  methods: {
    /*切换展示的排行榜*/
    toggleSector(sector) {
      this.activeSector = sector;
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    },

    /*请求首页数据*/
    async requestHomeData() {
      try {
        let mode;
        switch (this.activeSector) {
          case 'dailyList' :
            mode = 'day';
            break;
          case 'weeklyList':
            mode = 'week';
            break;
          default :
            mode = 'month'
        }
        let listData = (await pixiv({
          type: 'rank',
          mode,
          page: this.currentSector.pn++,
          date: utils.yesterDay()
        })).illusts;
        /*请求成功但是数据为空手动抛出一个错误*/
        if (listData.length > 0) {
          return listData
        } else {
          throw '数据获取失败'
        }
      } catch (e) {
        uni.showToast({
          title: e,
          duration: 2000,
          icon: 'none',
        })
      }
      /*返回一个空数组防止数据拼接报错*/
      return [];
    },
  },
  watch: {
    /*监视活跃的板块，并修改相应的数据*/
    async activeSector() {
      this.currentSector = this[this.activeSector];
      console.log(this.currentSector);
      if (this.currentSector.data.length === 0) {
        this[this.activeSector].data = await this.requestHomeData()
        this.currentSector = this[this.activeSector];
      }
    },
  },
  components: {
    imageList
  },
}
</script>

<style scoped lang="scss">
.pixiv {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .pixiv_head {
    width: 100%;
    height: $head-h * 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 1;

    .head {
      width: 100%;
      height: $head-h;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: $f-s-base;

      .head1 {
        flex: 1;
        height: $head-h;
        text-align: center;
        line-height: $head-h;

        image {
          width: $svg-size;
          height: $svg-size;
          vertical-align: middle;
        }

        &.head_index {
          image {
            width: $svg-size + 40rpx;
            height: $svg-size + 40rpx;
          }
        }
      }

      .rank {
        flex: 1;
        height: $head-h;
        text-align: center;
        line-height: $head-h;
        box-sizing: border-box;

        &.active_sector {
          border-bottom: 1rpx solid $main-color;
          color: $main-color;
        }
      }
    }
  }

  .pixiv_list {
    width:100%;
    margin-top: $head-h * 2 + 10rpx;

    .list_container {
      width: 100vw;
      flex-shrink: 0;
    }
  }
}
</style>