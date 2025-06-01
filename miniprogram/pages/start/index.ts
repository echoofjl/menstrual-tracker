Page({
    data: {
        selectedDate: new Date().toISOString().slice(0, 10) // yyyy-mm-dd
    },

    onDateChange(e: WechatMiniprogram.PickerChange) {
        this.setData({
            selectedDate: e.detail.value as string
        });
    },

    async onConfirm() {
        const db = wx.cloud.database();
        await db.collection('periods').add({
            data: {
                startDate: this.data.selectedDate
            }
        });
        wx.showToast({ title: '已记录开始', icon: 'success' });
        wx.navigateBack();
    }
});
