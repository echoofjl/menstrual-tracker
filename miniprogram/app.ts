App<IAppOption>({
  globalData: {},
  onLaunch() {
    wx.cloud.init({
      env: 'cloud1-3g6kz5ay7d1c9bdc',
      traceUser: true
    });
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
})