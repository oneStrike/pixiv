<script>
	export default {
		onLaunch: function() {
		  let self = this;
			console.log('App Launch')
      uni.getStorage({
        key: 'sideBar',
        success: function(res) {
          self.$store.commit('setSideBarOptions',res.data)
        }
      })
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
  .pixiv{
    width: 100%;
    height:100%;
  }

  uni-page-body{
    width: 100%;
    height: 100%;
  }
</style>
