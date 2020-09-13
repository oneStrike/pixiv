<template>
  <view class="pixiv">
    <!--头部导航-->
    <view class="pixiv_head">
      <view class="head">
        <view @click="isSideBar = true" class="head1">
          <image src="@/static/images/menu.svg"></image>
        </view>
        <navigator class="head_index head1"
                   url="/pages/index/index"
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
      <view class="list_container">
        <imageList
            v-show="activeSector === 'dailyList'"
            @image-cilck="navImageDetail"
            :mark="activeSector"
            :load="load"
            :layout="layout"
            :listData="dailyList.data">
        </imageList>
      </view>
      <view class="list_container">
        <imageList
            v-show="activeSector === 'weeklyList'"
            @image-cilck="navImageDetail"
            :mark="activeSector"
            :load="load"
            :layout="layout"
            :listData="weeklyList.data">
        </imageList>
      </view>
      <view class="list_container">
        <imageList
            v-show="activeSector === 'monthlyList'"
            @image-cilck="navImageDetail"
            :mark="activeSector"
            :load="load"
            :layout="layout"
            :listData="monthlyList.data">
        </imageList>
      </view>
    </view>

    <!--侧边栏-->
    <sideBar v-if="isSideBar" @hide-side="isSideBar = false"></sideBar>

    <!--楼层导航-->
    <view v-if="floor" class="pixiv_floor">
      <view @click="handlerFloor('top')" class="floor_slide floor_top">
        <image src="@/static/images/floor/top.svg"></image>
      </view>
      <view @click="handlerFloor('up')" class="floor_slide floor_up">
        <image src="@/static/images/floor/up.svg"></image>
      </view>
      <view class="floor_slide floor_count">
        <text>{{ currentSector.layer }}</text>
      </view>
      <view @click="handlerFloor('down')" class="floor_slide floor_down">
        <image src="@/static/images/floor/down.svg"></image>
      </view>
      <view @click="handlerFloor('bottom')" class="floor_slide floor_bottom">
        <image src="@/static/images/floor/bottom.svg"></image>
      </view>
    </view>
  </view>
</template>

<script>
import {pixiv} from '@/../api/api'
import {utils} from '@/utils/utils'
import {mapState} from 'vuex'

import sideBar from '@/components/sideBar/sideBar';

export default {
  data() {
    return {
      activeSector: '',//当前展示的类型
      dailyList: {data: [], pn: 1, flowFloor: [0, 0], floor: [0, 0], layer: 1},
      weeklyList: {data: [], pn: 1, flowFloor: [0, 0], floor: [0, 0], layer: 1},
      monthlyList: {data: [], pn: 1, flowFloor: [0, 0], floor: [0, 0], layer: 1},
      currentSector: {},//当前展示的数据
      isSideBar: false
    }
  },
  computed: {
    ...mapState({
      load: state => state.sideBarOptions.load,
      layout: state => state.sideBarOptions.layout,
      floor: state => state.sideBarOptions.floor,
    })
  },
  onLoad() {
    this.activeSector = 'dailyList';
  },
  async onReady() {
    this.$nextTick(async () => {
      this.headNavH = Math.ceil((await this.$componentStyle('.pixiv_head')).height)
    })
  },
  /*上拉刷新*/
  async onReachBottom() {
    if (this.loading) return;
    let data = await this.requestHomeData();
    if (data.length) {
      this[this.activeSector].data = this[this.activeSector].data.concat(data)
      this.$nextTick(async () => {
        await this.getFloorLayout()
        this.currentSector.layer++;
      })
    }
  },
  onPageScroll(e) {
    /*只在非手动点击滚动时触发*/
    if (!this.scrolling) {
      let currentFloor = this.layout === 'flow' ? this.currentSector.flowFloor : this.currentSector.floor;
      if (this.direction > e.scrollTop) {
        if (currentFloor[this.currentSector.layer] > e.scrollTop + 5) {
          this.currentSector.layer !== 1 && this.currentSector.layer--;
        }
      } else if (this.direction < e.scrollTop) {
        if (currentFloor[this.currentSector.layer + 1] < e.scrollTop) {
          this.currentSector.layer !== currentFloor.length - 2 && this.currentSector.layer++;
        }
      }
    }
    this.direction = e.scrollTop;
  },
  methods: {
    /*切换展示的排行榜*/
    toggleSector(sector) {
      /*防止在当前板块的请求数据没有返回前切换其他板块，隐藏uni.showLoading*/
      uni.hideLoading();
      this.activeSector = sector;
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      this.currentSector.layer = 1;
    },

    /*请求首页数据*/
    async requestHomeData() {
      this.loading = true;
      try {
        let mode;
        /*另一个接口*/
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
        /*switch (this.activeSector) {
          case 'dailyList' :
            mode = 'daily';
            break;
          case 'weeklyList':
            mode = 'weekly';
            break;
          default :
            mode = 'monthly'
        }
        let listData = (await pixiv({
          ranking_type:'illust',
          mode,
          per_page:30,
          page: this.currentSector.pn++,
          date: utils.yesterDay()
        })).response[0].works;*/
        /*请求成功但是数据为空手动抛出一个错误*/
        if (listData.length > 0) {
          this.loading = false;
          return listData;
        } else {
          throw '数据获取失败'
        }
      } catch (e) {
        this.loading = false;
        uni.showToast({
          title: e,
          duration: 2000,
          icon: 'none',
        })
      }
      /*返回一个空数组防止数据拼接报错*/
      return [];
    },

    /*楼层导航*/
    handlerFloor(direction) {
      this.scrolling = true;
      let rollingDistance = 0,
          currentFloor = this.layout === 'flow' ? this.currentSector.flowFloor : this.currentSector.floor;
      switch (direction) {
        case 'top': {
          this.currentSector.layer = 1;
          rollingDistance = 0;
        }
          break;
        case 'up': {
          if (this.currentSector.layer === 1) {
            rollingDistance = 0;
            return;
          }
          rollingDistance = currentFloor[--this.currentSector.layer]
        }
          break;
        case 'down': {
          if (this.currentSector.layer === currentFloor.length - 2) return
          rollingDistance = currentFloor[++this.currentSector.layer]
        }
          break;
        case 'bottom': {
          if (this.currentSector.layer === currentFloor.length - 2) return
          this.currentSector.layer = currentFloor.length - 2;
          rollingDistance = currentFloor[currentFloor.length - 2]
        }
      }

      uni.pageScrollTo({
        scrollTop: rollingDistance,
        duration: 500,
        success: () => {
          this.timer && clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.scrolling = false;
          }, 800)
        },
      })
    },

    /*获取楼层导航所需的布局信息*/
    async getFloorLayout() {
      if (this.layout === 'flow') return;
      this.$nextTick(async () => {
        // if(this.currentSector.pn-1  === 1) return;
        this.listContainerLayout = await this.$componentStyle('.pixiv_list');
        let result = Math.abs(this.listContainerLayout.height)
        this.currentSector.floor.indexOf(result) === -1 && this.currentSector.floor.push(result)
      })
    },

    /*跳转图片详情*/
    navImageDetail(img) {
    },

    computeFloor() {
      this.$nextTick(() => {
        /*
        * rule布局
        * 每一张图片的高度都是相等的，
        * 列表容器的bottom - 最后一张图片的bottom = 图片的margin
        * 图片的高度 * 每一页图片的数量  + 图片的margin * 每一页图片的数量 = 楼层位置
        * 楼层位置 * 楼层页数 = 所有的楼层位置
        *
        * 需要注意各个平台获取组件信息的差异性
        * */
        this.currentSector.floor = [0, 0]
        let loopCount = 1,
            floorDivide = 0,
            lastImg = this.currentSector.data.length / 2,
            numberPerPage = this.currentSector.data.length / (this.currentSector.pn - 1) / 2,
        result = 0;
        if (this.layout === 'rule') {
          Promise.all([
            /* #ifdef MP*/
            this.$componentStyle('.pixiv_list >>> .' + this.activeSector + (lastImg - 1)),
            /* #endif*/
            /* #ifndef MP*/
            this.$componentStyle('.' + this.activeSector + (lastImg - 1)),
            /* #endif*/
            this.$componentStyle('.pixiv_list')
          ]).then(location => {
            floorDivide = (location[0].height * numberPerPage) + ((location[1].bottom - location[0].bottom) * numberPerPage)
            do {
              result = floorDivide * loopCount;
              this.currentSector.floor.indexOf(result) === -1 &&this.currentSector.floor.push(result)
              loopCount++;
            } while (loopCount !== this.currentSector.pn)
          })
        }
      })
    }
  },
  watch: {
    /*监视活跃的板块，并修改相应的数据*/
    async activeSector() {
      this.currentSector = this[this.activeSector];
      if (this.currentSector.data.length === 0 && !this.loading) {
        this[this.activeSector].data = await this.requestHomeData()
        this.currentSector = this[this.activeSector];
        this.$nextTick(async () => {
          await this.getFloorLayout()
        })
      }
    },
    floor(is) {
      is && this.computeFloor()
    },
    layout(l) {
      l === 'rule' && this.computeFloor()
    }
  },
  components: {
    sideBar
  },
}
</script>

<style scoped lang="scss">
image{
  width: 0;
  height: 0;
  vertical-align: middle;
}

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

  .pixiv_floor{
    width:80rpx;
    height: 400rpx;
    position: fixed;
    bottom: 20rpx;
    right: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
    background:rgba(0,0,0,.5);
    border-radius: 10rpx;
    color: #FFFFFF;
    font-size: $f-s-bg;

    .floor_slide{
      flex: 1;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: 4rpx solid $main-color;
      box-sizing: border-box;
      border-radius: 10rpx;

      image{
        width: $svg-size + 10rpx;
        height: $svg-size + 10rpx;
      }
    }

    .floor_count{
      background: rgba(46, 200, 205,.3);
      border-radius: 50%;
      border: none;
    }

    .floor_bottom,.floor_down{
      border-top: none;
      border-bottom: 4rpx solid $main-color;
    }
  }
}

/*侧边栏的过度动画*/
//.side_bar-enter-active {
//  transition: all .3s;
//}
//.side_bar-leave-active {
//  transform: translateX(-10px);
//  opacity: 0;
//  transition: all .4s;
//}
//.side_bar-enter, .slide-fade-leave-to {
//  transform: translateX(10px);
//  opacity: 0;
//}
</style>