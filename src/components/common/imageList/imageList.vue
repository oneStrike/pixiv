<template>
  <view class="image_list">
    <view class="list_content"
          v-for="(img,imgIndex) in listData" :key="img.id"
          :class="{'loading_bg':successImg.indexOf(imgIndex) === -1 &&load === 'full'}">
      <image mode="aspectFill"
             :lazy-load="true"
             @load="successImg.push(imgIndex)"
             :src="img.image_urls.medium | proxySrc"
             :style="{opacity:successImg.indexOf(imgIndex) === -1&&load === 'full' ? '0' : '1'}">
      </image>
      <view v-if="img.page_count > 1" class="img_count">
        <image src="@/static/images/image_count.svg"></image>
        <text>{{img.page_count}}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "imageList",
  data() {
    return {
      successImg: [],
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
    }
  },
}
</script>

<style scoped lang="scss">
.image_list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  .list_content {
    width: 45%;
    height: 400rpx;
    margin-bottom:20rpx;
    position: relative;
    border-radius: 10rpx;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
      vertical-align: middle;
      transition: opacity 0.3s;
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
        width:40rpx;
        height:40rpx;
        vertical-align:middle;
      }
    }
  }
}
</style>