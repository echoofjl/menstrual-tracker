import { MarkItem, PeriodRecord } from '../../../typings';
import { db, _ } from '../../utils/cloudDB';
import { generatePhaseMarks, getCurrentPhase } from '../../utils/period';

Page({
  data: {
    currentPhase: '',
    latestStartDate: '',
    markedList: [] as MarkItem[],
    groupedHistory: [] as Array<{ year: number; records: PeriodRecord[] }>,
    showStartForm: false,
    showEndForm: false,
    startSelectedDate: new Date().toISOString().slice(0, 10),
    endSelectedDate: new Date().toISOString().slice(0, 10),
    endMaxDate: new Date().toISOString().slice(0, 10),
    endRecordId: '',
    endStartDate: ''
  },

  async onLoad() {
    await this.loadPeriodData();
  },

  async onShow() {
    await this.loadPeriodData();
  },

  async loadPeriodData() {
    const res = await db.collection('periods')
      .orderBy('startDate', 'desc')
      .get();

    const records = res.data as PeriodRecord[];
    const today = new Date();
    const marks = generatePhaseMarks(records, today);
    const currentPhase = getCurrentPhase(today, marks);
    const grouped = this.groupRecordsByYear(records);

    this.setData({
      currentPhase,
      markedList: marks,
      groupedHistory: grouped,
      latestStartDate: records[0] && records[0].startDate ? records[0].startDate : '-'
    });
  },

  groupRecordsByYear(records: PeriodRecord[]) {
    const result: Record<number, PeriodRecord[]> = {};
    records.forEach(record => {
      const year = new Date(record.startDate).getFullYear();
      if (!result[year]) result[year] = [];
      result[year].push(record);
    });

    const history = Object.entries(result)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, records]) => ({ year: Number(year), records }));
    return history;
  },

  onStartPeriod() {
    this.setData({
      showStartForm: true,
      startSelectedDate: new Date().toISOString().slice(0, 10)
    });
  },

  onEndPeriod() {
    db.collection('periods')
      .where({ endDate: _.exists(false) })
      .orderBy('startDate', 'desc')
      .limit(1)
      .get()
      .then(res => {
        if (res.data.length) {
          const record = res.data[0] as PeriodRecord;
          this.setData({
            showEndForm: true,
            endRecordId: String(record._id),
            endStartDate: record.startDate,
            endSelectedDate: new Date().toISOString().slice(0, 10)
          });
        } else {
          wx.showToast({ title: '无正在进行的周期', icon: 'none' });
        }
      });
  },

  onStartDateChange(e: WechatMiniprogram.PickerChange) {
    this.setData({ startSelectedDate: e.detail.value as string });
  },

  async onConfirmStart() {
    await db.collection('periods').add({
      data: {
        startDate: this.data.startSelectedDate
      }
    });
    wx.showToast({ title: '已记录开始', icon: 'success' });
    this.setData({ showStartForm: false });
    await this.loadPeriodData();
  },

  onEndDateChange(e: WechatMiniprogram.PickerChange) {
    this.setData({ endSelectedDate: e.detail.value as string });
  },

  async onConfirmEnd() {
    const selected = new Date(this.data.endSelectedDate);
    const today = new Date();
    const start = new Date(this.data.endStartDate);

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
      await db.collection('periods').doc(this.data.endRecordId).update({
        data: {
          endDate: this.data.endSelectedDate
        }
      });
      wx.showToast({ title: '已记录结束', icon: 'success' });
      this.setData({ showEndForm: false });
      await this.loadPeriodData();
    } catch (e) {
      wx.showToast({ title: '记录失败', icon: 'error' });
      console.error('记录失败', e);
    }
  }
});
