/*: 作者：beginroad
    邮箱：beginroad@aliyun.com
    微信公众号：创路科技
*/

const app = getApp()

Page({
  data: {
  },

  tapOpenCamera() {
    wx.navigateTo({
      url: '../camera/camera',
    })
  },
})
