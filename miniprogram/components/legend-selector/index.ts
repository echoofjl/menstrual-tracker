Component({
    data: {
        phases: [
            { name: '月经期', color: '#f44336' },
            { name: '卵泡期', color: '#2196f3' },
            { name: '排卵期', color: '#9c27b0' },
            { name: '黄体期', color: '#ff9800' }
        ],
        selected: ''
    },

    methods: {
        onTap(e: WechatMiniprogram.BaseEvent) {
            const name = e.currentTarget.dataset.name;
            const { selected } = this.data;
            const next = selected === name ? '' : name;

            this.setData({ selected: next });
            this.triggerEvent('select', { phase: next });
        }
    }
});
