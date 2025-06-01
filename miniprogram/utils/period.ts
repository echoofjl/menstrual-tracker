import { MarkItem, PhaseRecord } from "../../typings";

const PHASES = [
    { name: '月经期', days: 5, color: '#f44336' },
    { name: '卵泡期', days: 8, color: '#2196f3' },
    { name: '排卵期', days: 1, color: '#9c27b0' },
    { name: '黄体期', days: 14, color: '#ff9800' }
];

const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
};

function generateOngoingMarks(startDate: Date, today: Date): MarkItem[] {
    const result: MarkItem[] = [];
    let cursor = new Date(startDate);
    while (cursor <= today) {
        result.push({
            date: formatDate(cursor),
            color: '#f44336',
            label: '月经期'
        });
        cursor.setDate(cursor.getDate() + 1);
    }
    return result;
}

function generateCompleteCycleMarks(
    start: Date,
    nextStartDate: Date | null
): MarkItem[] {
    const result: MarkItem[] = [];
    let cursor = new Date(start);

    for (const phase of PHASES) {
        for (let j = 0; j < phase.days; j++) {
            if (nextStartDate && cursor >= nextStartDate) return result;
            result.push({
                date: formatDate(cursor),
                color: phase.color,
                label: phase.name
            });
            cursor.setDate(cursor.getDate() + 1);
        }
    }

    return result;
}


export function generatePhaseMarks(
    records: PhaseRecord[],
    today: Date
): MarkItem[] {
    const result: MarkItem[] = [];

    const sorted = [...records].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    for (let i = 0; i < sorted.length; i++) {
        const record = sorted[i];
        const start = new Date(record.startDate);
        const end = record.endDate ? new Date(record.endDate) : null;
        const nextStart = sorted[i + 1] ? sorted[i + 1].startDate : undefined;
        const nextStartDate = nextStart ? new Date(nextStart) : null;

        if (!end) {
            result.push(...generateOngoingMarks(start, today));
        } else {
            result.push(...generateCompleteCycleMarks(start, nextStartDate));
        }
    }

    return result;
}

export function getCurrentPhase(today: Date, markList: MarkItem[]): string {
    const todayStr = formatDate(today);
    const item = markList.find(mark => mark.date === todayStr);
    return item ? item.label : '无记录';
}

