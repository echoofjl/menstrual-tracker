Page({
  data: {
    today: '',
    phaseInfo: {
      phase: '',
      dayIndex: 0,
      nextPeriod: ''
    },
    suggestion: ''
  },

  onLoad() {
    const today = this.getTodayStr()
    this.setData({ today })
    this.loadPhaseInfo()
  },

  getTodayStr(): string {
    const d = new Date()
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
  },

  async loadPhaseInfo() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getTodayPhase',
        data: {}
      })
      const phaseInfo = res.result
      const suggestion = this.getSuggestionByPhase(phaseInfo.phase)
      this.setData({ phaseInfo, suggestion })
    } catch (err) {
      console.error('获取周期失败', err)
    }
  },

  getSuggestionByPhase(phase: string): string {
    const map: Record<string, string> = {
      '月经期': '多休息，保持温暖，避免剧烈运动。',
      '卵泡期': '状态较好，可安排高强度工作或锻炼。',
      '排卵期': '注意饮食清淡，保持心情稳定。',
      '黄体期': '可能易疲劳、情绪波动，适当放松。'
    }
    return map[phase] || '注意观察身体变化，保持规律生活。'
  },

  goToRecord() {
    wx.navigateTo({
      url: '/pages/record/index?date=' + this.data.today
    })
  },

  goToCalendar() {
    wx.switchTab({
      url: '/pages/calendar/index'
    })
  }
})
