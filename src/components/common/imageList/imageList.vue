<template>
  <view class="image_list">
    <view v-for="(imgList,imgIndex) in computedLayout"
          :key="imgIndex"
          class="image_layout">
      <!--动态绑定的样式不照顾小程序的话可以在计算属性中直接返回一个对象，使模板更加简介-->
      <view :class="['list_content',mark ? mark + imgI : '']"
            v-for="(img,imgI) in imgList" :key="img.id"
            :style="{height:imgHeight||img.layoutHeight + 'px'}"
            @click="$emit('image-click',img)">
        <view  class="loading_bg " v-if="load === 'full'"></view>
        <view v-else class="random_color" :style="{background:randomColor[imgI % randomColor.length]}"></view>
        <!-- #ifndef H5-->
        <image mode="aspectFill"
               lazy-load
               @load="addSuccessImg(img.id,imgI)"
               :src="img.image_urls.medium | proxySrc"
               :style="{'opacity':imgOpacity(img.id)}">
        </image>
        <!-- #endif-->

        <!-- #ifdef H5-->
        <!--
          在H5端使用$refs动态的修改样式，
          非H5端以外由于无法使用$refs修改样式
          将加载完成的图片的ID放入数组中，
          根据数组判断图片是否是否加载完成
        -->
        <image mode="aspectFill"
               lazy-load
               :ref="img.id"
               @load="addSuccessImg(img.id,imgI)"
               :src="img.image_urls.medium | proxySrc"
               :class="{'full_image':load === 'full'}">
        </image>
        <!-- #endif-->
        <view v-if="img.page_count > 1" class="img_count">
          <image src="@/static/images/image_count.svg"></image>
          <text>{{img.page_count}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {utils} from '@/utils/utils'

export default {
  name: "imageList",
  data() {
    return {
      successImg: [],
      randomColor: [],
    }
  },
  props: {
    listData: {
      type: [Array, undefined],
      default: () => [],
      required: true,
    },
    load: {
      type: String,
      default: 'full',
    },
    layout: {
      type: String,
      default: 'flow'
    },
    mark:{
      type:String,
      default:''
    },
    isFloor:{
      type:Boolean,
      default:true
    },
  },
  computed: {
    /*瀑布流布局切割数组，*/
     computedLayout() {
      /*
      * 无论以何种布局展现，都根据比例计算出对应的高度，
      * 较少布局模式切换是的损耗
      * */
      this.listData.slice(this.left.length + this.right.length).forEach((img, i) => {
        /*
         * 'https://api.imjad.cn/pixiv/v2/'
         * 使用此接口需注释下面表达式，
         * img = img.work;
         * 同时图片的SRC地址可能需要更改
         * */
        img.layoutHeight = img.height / (img.width / (this.windowWidth * 0.45))
        if (this.leftH >= this.rightH) {
          this.rightH += parseFloat(img.layoutHeight);
          this.right.push(img)
          this.flowRight.push(img)
        } else {
          this.leftH += parseFloat(img.layoutHeight);
          this.left.push(img)
          this.flowLeft.push(img)
        }
      })
       // this.flowLeft = this.left;
       // this.flowRight = this.right;
       /*
       * 非瀑布流模式下保证左右数量一致
       * 瀑布流模式下保证高度大概一致
       * */
      if (this.layout === 'rule') {
        while (this.left.length > this.right.length) {
          let img = (this.left.splice(this.left.length - 1))[0];
          this.right.push(img)
        }
        while (this.left.length < this.right.length) {
          let img = (this.right.splice(this.right.length - 1))[0];
          this.left.push(img)
        }
        return [this.left, this.right]
      }else if(this.layout === 'flow'){
        return [this.flowLeft, this.flowRight]
      }
    },

    imgHeight() {
      return this.layout === 'flow' ? '' : '400rpx'
    },

    /* #ifndef H5*/
    imgOpacity() {
      return function (id) {
        return this.successImg.indexOf(id) === -1 && this.load === 'full' ? '0' : '1'
      }
    },
    /* #endif*/
  },
  methods: {
    /*
    * 在小程序中直接在模板中添加
    * 添加的都是undefined
    * */
    addSuccessImg(id) {
      /* #ifdef H5*/
      //在H5端使用$refs动态的修改样式
      this.$refs[id][0].$el.style.opacity = 1;
      /* #endif*/
      this.successImg.push(id)
    },
  },

  created() {
    /*
     * 瀑布流布局所需的属性，
     * 不直接展示在模板中，
     * 所以不需要在data中定义
     */
    this.windowWidth = uni.getSystemInfoSync().windowWidth;
    this.left = [];
    this.right = [];
    this.flowLeft = [];
    this.flowRight = [];
    this.leftH = 0;
    this.rightH = 0;
    this.imgMargin = getApp().globalData.imgMargin;
  },

  mounted() {
    if (!this.randomColor.length) {
      this.randomColor = utils.randomColor(0, 255, 20);
    }
  },
  watch: {
    listData: {
      handler: function () {
        this.$nextTick(async () => {
          if (!getApp().globalData.imgMargin) {
            let i = this.layout === 'flow' ? (this.leftH >= this.rightH ? this.flowLeft.length : this.flowRight.length) : this.left.length
            await Promise.all([
              this.$componentStyle('.pixiv_list'),
              /* #ifdef MP*/
              this.$componentStyle('.pixiv_list >>> .' + this.mark + (i - 1)),
              /* #endif*/
              /* #ifndef MP*/
              this.$componentStyle('.' + this.mark + (i - 1)),
              /* #endif*/
            ]).then(location => {
              this.imgMargin = location[0].bottom - location[1].bottom;
              getApp().globalData.imgMargin = this.imgMargin;
              console.log(this.imgMargin);
            })
          }
          let parentFloor = this.$parent.currentSector || this.$root.currentSector;
          parentFloor.flowFloor.push(this.leftH + this.left.length * this.imgMargin)
        })
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.image_list {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  background-color: #f6f6f6;

  .image_layout{
    width: 46%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;

    .list_content {
      width: 100%;
      height: 400rpx;
      margin-bottom:20rpx;
      position: relative;
      border-radius: 10rpx;
      overflow: hidden;

      .random_color{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }

      image {
        width: 100%;
        height: 100%;
        vertical-align: middle;
        transition: opacity 0.3s;
        opacity: 1;
        position: relative;
      }

      .full_image{
        opacity: 0;
      }

      .img_count{
        width:100rpx;
        height:50rpx;
        background: rgba(114, 114, 114, .7);
        position:absolute;
        top: 20rpx;
        right: 20rpx;
        color: #ffffff;
        font-size:$f-s-base;
        text-align:center;
        line-height:50rpx;
        display:flex;
        justify-content: space-around;
        align-items: center;
        border-radius:6rpx;

        image{
          width:$svg-size;
          height:$svg-size;
          vertical-align:middle;
        }
      }
    }
  }
}
</style>