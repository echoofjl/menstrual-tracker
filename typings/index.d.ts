/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}


export interface PeriodRecord {
  _id: string;
  startDate: string;
  endDate?: string;
  createdAt: Date;
}


export interface MarkItem {
  date: string;
  color: string;
  label: string;
}

export interface PhaseRecord {
  startDate: string;
  endDate?: string;
}
