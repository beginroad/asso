/*: 作者：beginroad
    邮箱：beginroad@aliyun.com
    微信公众号：创路科技
*/

Page({
    data: {
    },

    // 拍照
    takePhoto: function () {
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                wx.navigateTo({
                    url: '../result/result?path=' + res.tempImagePath,
                })
            }
        })
    },
})