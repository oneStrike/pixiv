<template>
  <view class="side_bar_container"
        :animation="animationData"
        @touchmove.stop.prevent>
    <view class="side_left">
      <view class="side_bar">
        <view class="side_bg"></view>
        <view class="side_content">
          <view class="side_slide" v-for="(side,sideI) in listData" :key="sideI">
            <view class="slide_content">
              <image :src="side.svg"></image>
              <text>{{side.title}}</text>
            </view>
            <view class="side_btn" v-if="side.btn&&side.title==='加载模式'">
              <button :class="{'active_btn':sideBarOptions.load === 'full'}"
                      hover-class="none"
                      @click="handlerOptions('load','full')">{{side.btn[0]}}
              </button>
              <button :class="{'active_btn':sideBarOptions.load === 'gradually'}"
                      hover-class="none"
                      @click="handlerOptions('load','gradually')">{{side.btn[1]}}
              </button>
            </view>
            <view class="side_btn" v-if="side.btn&&side.title==='布局模式'">
              <button :class="{'active_btn':sideBarOptions.layout==='flow'}"
                      hover-class="none"
                      @click="handlerOptions('layout','flow')">{{side.btn[0]}}
              </button>
              <button :class="{'active_btn':sideBarOptions.layout==='rule'}"
                      hover-class="none"
                      @click="handlerOptions('layout','rule')">{{side.btn[1]}}
              </button>
            </view>
            <view class="side_btn" v-if="side.btn&&side.title==='楼层导航'">
              <button :class="{'active_btn':sideBarOptions.floor}"
                      hover-class="none"
                      @click="handlerOptions('floor',true)">{{side.btn[0]}}
              </button>
              <button :class="{'active_btn':!sideBarOptions.floor}"
                      hover-class="none"
                      @click="handlerOptions('floor',false)">{{side.btn[1]}}
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view @click="hideSideBar" class="side_right"></view>
  </view>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: "sideBar",
  data() {
    return {
      listData: [
        {
          title: '排行榜',
          svg: '../../static/images/sidebar/rank.svg'
        },
        {
          title: '作品查询',
          svg: '../../static/images/sidebar/ID.svg'
        },
        {
          title: '画师查询',
          svg: '../../static/images/sidebar/painter.svg'
        },
        {
          title: '热门标签',
          svg: '../../static/images/sidebar/tags.svg'
        },
        {
          title: '浏览历史',
          svg: '../../static/images/sidebar/history.svg'
        },
        {
          title: '作品收藏',
          svg: '../../static/images/sidebar/favorites.svg'
        },
        {
          title: '加载模式',
          svg: '../../static/images/sidebar/loading.svg',
          btn: ['完整', '逐步']
        },
        {
          title: '布局模式',
          svg: '../../static/images/sidebar/rank.svg',
          btn: ['流式', '规则']
        },
        {
          title: '楼层导航',
          svg: '../../static/images/sidebar/floor.svg',
          btn: ['开启', '关闭']
        },

      ],
      animationData: {}
    }
  },
  computed: {
    ...mapState(['sideBarOptions'])
  },
  mounted() {
    this.animation = uni.createAnimation({
      duration: 300,
      timingFunction: 'ease-in-out',
    })
    this.animation.opacity(0).translateX(20).step({
      duration: 30,
    })
    this.animation.translateX(0).opacity(1).step()
    this.animationData = this.animation.export()
  },

  beforeDestroy(){
  /**  this.animation.opacity(1).translateX(0).step({
    *  duration:30,
    * })
    * this.animation.translateX(20).opacity(0).step()
    * this.animationData = this.animation.export()
    **/
  clearTimeout(this.timer);
  },

  methods: {
    /*通知vuex改变侧边栏的选项*/
    handlerOptions(type, value) {
      this.$store.commit('setSideBarOptions', {
        type,
        value
      });
    },

    hideSideBar() {
      this.animation.translateX(20).opacity(0).step()
      this.animationData = this.animation.export()
      this.timer = setTimeout(()=>{
        this.$emit('hide-side')
      },300)
    },
  }
}
</script>

<style scoped lang="scss">
image {
  width: $svg-size;
  height: $svg-size;
  vertical-align: middle;
  margin-right: 20rpx;
}

button{
  font-size: $f-s-sm;
  width:100rpx;
  height: 50rpx;
  line-height:50rpx;
  padding: 0;
  text-align: center;
}

.side_bar_container {
  width:100%;
  height:100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(181, 151, 151, 0.5);
  z-index: 10;
  display: flex;
  justify-content:space-between;
  opacity: 0;

  .side_left{
    height:100%;
    flex: 2;
    background-color:#FFF;
    z-index: 2;

    .side_bar {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      font-size: $f-s-base;

      .side_bg{
        flex: 1;
        background:url('http://godkonws.com/image/side_bg.png') no-repeat center center;
        background-size:cover;
      }

      .side_content{
        flex: 3;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .side_slide{
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items:center;
          padding: 0 20rpx;
          box-sizing: border-box;

          .slide_content{
            flex: 1;
          }

          .side_btn{
            flex:1;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;

            .active_btn{
              background:$main-color;
            }
          }
        }
      }
    }
  }

  .side_right{
    flex: 1;
    height:100%;
  }
}
</style>