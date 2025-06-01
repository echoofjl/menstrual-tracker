import { PhaseRecord } from '../../../typings';
import { db } from '../../utils/cloudDB';
import { generatePhaseMarks, getCurrentPhase } from '../../utils/period';


Page({
    data: {
        currentPhase: ''
    },

    async onLoad() {
        const res = await db.collection('periods').get();
        const records: PhaseRecord[] = res.data
            .filter(r => typeof r.startDate === 'string')
            .map(r => ({ startDate: r.startDate, endDate: r.endDate }));

        const today = new Date();
        const markList = generatePhaseMarks(records, today);
        const phase = getCurrentPhase(today, markList);

        this.setData({ currentPhase: phase });
    }
});
