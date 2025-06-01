Component({
    properties: {
        markList: {
            type: Array,
            value: [] as { date: string; color: string }[]
        }
    },

    data: {
        days: [] as { date: number; dateStr: string; style: string }[],
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1 // 1-based
    },

    lifetimes: {
        attached() {
            this.generateCalendar();
        }
    },

    observers: {
        markList() {
            this.generateCalendar();
        }
    },

    methods: {
        generateCalendar() {
            const { currentYear, currentMonth, markList } = this.data;
            const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
            const totalDays = new Date(currentYear, currentMonth, 0).getDate();

            const days = [];

            for (let i = 0; i < firstDay; i++) {
                days.push({ date: 0, dateStr: '', style: '' });
            }

            const todayStr = this.formatDate(new Date());

            for (let d = 1; d <= totalDays; d++) {
                const dateStr = this.formatDate(new Date(currentYear, currentMonth - 1, d));
                const match = markList.find(item => item.date === dateStr);
                const style = match ? `background-color: ${match.color}; color: white;` : '';
                const isToday = dateStr === todayStr;
                days.push({
                    date: d,
                    dateStr,
                    style,
                    isToday
                });
            }

            this.setData({ days });
        },
        prevYear() {
            let { currentYear } = this.data;
            currentYear -= 1;
            this.setData({ currentYear }, () => this.generateCalendar());
        },

        nextYear() {
            let { currentYear } = this.data;
            currentYear += 1;
            this.setData({ currentYear }, () => this.generateCalendar());
        },


        formatDate(date: Date): string {
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            const d = date.getDate();
            return `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
        },

        prevMonth() {
            let { currentYear, currentMonth } = this.data;
            if (currentMonth === 1) {
                currentMonth = 12;
                currentYear -= 1;
            } else {
                currentMonth -= 1;
            }
            this.setData({ currentYear, currentMonth }, () => this.generateCalendar());
        },

        nextMonth() {
            let { currentYear, currentMonth } = this.data;
            if (currentMonth === 12) {
                currentMonth = 1;
                currentYear += 1;
            } else {
                currentMonth += 1;
            }
            this.setData({ currentYear, currentMonth }, () => this.generateCalendar());
        },
    }

});
