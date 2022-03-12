/*: 作者：beginroad
    邮箱：beginroad@aliyun.com
    微信公众号：创路科技
*/

var SHA256 = require('../util/sha256.js')

Page({
    data: {
        imagePath: '',      // 图片地址
        imageBase64: '',    // 图片Base64编码
        questions: '',        // 题目
        answer: '',         // 答案
        analysis: '',       // 答案解析
        show: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const imagePath = options.path
        this.setData({
            imagePath: imagePath
        })
        var that = this
        // 读取微信设备上的临时图片，返回base64编码
        wx.getFileSystemManager().readFile({
            filePath: imagePath,
            encoding:"base64",
            success: function (res){
              that.data.imageBase64 = res.data
                that.identify()
            }
        })
    },

    // 生成访问uuid
    uuid: function () {
        function S4() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
        }
        return S4()+S4()+S4()
    },

    // 截取
    truncate: function (q) {
        const size = q.length
        if (size <= 20) {
            return q
        }
        return q.slice(0, 10) + size + q.slice(size - 10, size)
    },

    // 识别
    identify: function () {
        const url = 'https://openapi.youdao.com/ocrquestionapi'
        // 需要修改此处
        const appKey = 'xxx'
        // 需要修改此处
        const appSecret = 'xxx'
        var that = this
        const salt = that.uuid()
        const curtime = new Date().getTime()
        const signStr = appKey + that.truncate(that.data.imageBase64) + salt + curtime + appSecret
        const sign = SHA256.sha256_digest(signStr)
        // 访问有道智云API，获取识别结果
        wx.request({
            url: url,
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            data: {
                q: that.data.imageBase64,
                signType: 'v2',
                appKey: appKey,
                curtime: curtime,
                salt: salt,
                type: 1,
                searchType: 'img',
                sign: sign,
            },
            success: function (res) {
                if (res.data.errorCode == "0" && res.data.data.questions.length > 0) {
                    const rsp = res.data.data.questions[0]
                    const questions = rsp.content
                    const answer = rsp.answer
                    const analysis = rsp.analysis
                    that.setData({
                        questions: questions,
                        answer: answer,
                        analysis: analysis,
                    })

                } else  {
                    that.setData({
                        show: true,
                    })
                    console.log(res.data.errorCode)
                }
            }
        })
    },
})