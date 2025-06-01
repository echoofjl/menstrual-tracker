import { MarkItem, PeriodRecord } from '../../../typings';
import { db } from '../../utils/cloudDB';
import { generatePhaseMarks, getCurrentPhase } from '../../utils/period';

Page({
  data: {
    currentPhase: '',
    latestStartDate: '',
    markedList: [] as MarkItem[],
    groupedHistory: [] as Array<{ year: number; records: PeriodRecord[] }>
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
    wx.navigateTo({
      url: '/pages/start/index'
    });

  },

  onEndPeriod() {
    wx.navigateTo({
      url: '/pages/end/index'
    });
  }
});
