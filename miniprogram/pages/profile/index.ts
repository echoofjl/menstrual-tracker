Page({
    data: {
        cycleLength: 28,
        periodLength: 5,
        notificationOn: true
    },

    onLoad() {
        this.loadProfile()
    },

    async loadProfile() {
        const db = wx.cloud.database()
        const res = await db.collection('user_profile')
            .limit(1)
            .get()

        if (res.data.length > 0) {
            const data = res.data[0]
            this.setData({
                cycleLength: data.cycle_length,
                periodLength: data.period_length,
                notificationOn: data.notification_on
            })
        }
    },

    onCycleInput(e) {
        this.setData({ cycleLength: parseInt(e.detail.value) || 28 })
    },

    onPeriodInput(e) {
        this.setData({ periodLength: parseInt(e.detail.value) || 5 })
    },

    onSwitchChange(e) {
        this.setData({ notificationOn: e.detail.value })
    },

    async saveProfile() {
        const db = wx.cloud.database()
        const _ = db.command

        // 查询是否已存在用户设置
        const { data } = await db.collection('user_profile')
            .limit(1)
            .get()

        const newData = {
            cycle_length: this.data.cycleLength,
            period_length: this.data.periodLength,
            notification_on: this.data.notificationOn,
            updated_at: new Date()
        }

        try {
            if (data.length > 0) {
                await db.collection('user_profile').doc(data[0]._id).update({ data: newData })
            } else {
                await db.collection('user_profile').add({ data: { ...newData, created_at: new Date() } })
            }

            wx.showToast({ title: '保存成功' })
        } catch (e) {
            console.error('保存失败', e)
            wx.showToast({ title: '保存失败', icon: 'error' })
        }
    }
})
