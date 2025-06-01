import { MarkItem, PeriodRecord } from '../../../typings';
import { db } from '../../utils/cloudDB';
import { generatePhaseMarks } from '../../utils/period';


Page({
    data: {
        markedList: [] as MarkItem[],
        filteredList: [] as MarkItem[],
        selectedPhase: '' as string
    },


    async onLoad() {
        const res = await db.collection('periods').get();
        const records = res.data as PeriodRecord[];
        const today = new Date();

        const marks = generatePhaseMarks(records, today);
        this.setData({
            markedList: marks,
            filteredList: marks
        });
    },

    onPhaseSelect(e: WechatMiniprogram.CustomEvent) {
        const phase = e.detail.phase;
        const { markedList } = this.data;
        const filtered = phase ? markedList.filter(m => m.label === phase) : markedList;

        this.setData({
            selectedPhase: phase,
            filteredList: filtered
        });
    }
});
