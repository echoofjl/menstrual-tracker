import { _, db } from '../../utils/cloudDB';

Page({
    data: {
        selectedDate: new Date().toISOString().slice(0, 10),
        maxDate: new Date().toISOString().slice(0, 10),
        recordId: '',
        startDate: '' // 当前未结束周期的开始日期
    },

    async onLoad() {
        const res = await db.collection('periods')
            .where({ endDate: _.exists(false) })
            .orderBy('startDate', 'desc')
            .limit(1)
            .get();

        if (res.data.length) {
            const record = res.data[0];
            this.setData({
                recordId: String(record._id),
                startDate: record.startDate
            });
        } else {
            wx.showToast({ title: '无正在进行的周期', icon: 'none' });
            wx.navigateBack();
        }
    },

    onDateChange(e: WechatMiniprogram.PickerChange) {
        this.setData({ selectedDate: e.detail.value as string });
    },

    async onConfirm() {
        const selected = new Date(this.data.selectedDate);
        const today = new Date();
        const start = new Date(this.data.startDate);

        // 清除时间部分
        selected.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);

        if (selected.getTime() > today.getTime()) {
            wx.showToast({ title: '结束日期不能晚于今天', icon: 'none' });
            return;
        }

        if (selected.getTime() < start.getTime()) {
            wx.showToast({ title: '结束日期不能早于开始日期', icon: 'none' });
            return;
        }

        try {
            await db.collection('periods').doc(this.data.recordId).update({
                data: {
                    endDate: this.data.selectedDate
                }
            });
            wx.showToast({ title: '已记录结束', icon: 'success' });
            wx.navigateBack();
        } catch (e) {
            wx.showToast({ title: '记录失败', icon: 'error' });
            console.error('记录失败', e);
        }
    }
});
