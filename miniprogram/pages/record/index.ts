Page({
    data: {
        date: '',
        isPeriodStart: false,
        isPeriodEnd: false,
        selectedSymptoms: [],
        temperature: '',
        notes: '',
        symptomOptions: ['小腹胀痛', '情绪波动', '头痛', '腰酸', '乳房胀痛']
    },

    onLoad(options) {
        const passedDate = options.date || this.getTodayStr()
        this.setData({ date: passedDate })
    },

    getTodayStr(): string {
        const d = new Date()
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
    },

    onDateChange(e) {
        this.setData({ date: e.detail.value })
    },

    onPeriodChange(e) {
        const value = e.detail.value
        this.setData({
            isPeriodStart: value === 'start',
            isPeriodEnd: value === 'end'
        })
    },

    onSymptomsChange(e) {
        this.setData({ selectedSymptoms: e.detail.value })
    },

    onTempInput(e) {
        this.setData({ temperature: e.detail.value })
    },

    onNoteInput(e) {
        this.setData({ notes: e.detail.value })
    },

    async submitLog() {
        const db = wx.cloud.database()
        const _ = db.command

        try {
            await db.collection('daily_logs').add({
                data: {
                    date: this.data.date,
                    is_period_start: this.data.isPeriodStart,
                    is_period_end: this.data.isPeriodEnd,
                    symptoms: this.data.selectedSymptoms,
                    temperature: Number(this.data.temperature) || null,
                    notes: this.data.notes,
                    created_at: new Date()
                }
            })
            wx.showToast({ title: '记录成功' })
            setTimeout(() => {
                wx.navigateBack()
            }, 1000)
        } catch (e) {
            console.error(e)
            wx.showToast({ title: '提交失败', icon: 'error' })
        }
    }
})
