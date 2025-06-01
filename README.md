# Menstrual Tracker

A WeChat Mini Program for tracking menstrual cycles, visualizing phases, and learning about female reproductive health.

## 🌸 Features

- Record menstrual start and end dates
- Calendar view with colored phase markers (menstrual, follicular, ovulation, luteal)
- Knowledge section with hormonal and lifestyle tips
- Smooth user experience with local + cloud data storage

---

## 🧾 Project Structure

```
menstrual-tracker/
├── miniprogram/               # Main application
│   ├── app.ts                 # App entry
│   ├── app.json / app.wxss    # Global config & styles
│   ├── components/            # Reusable UI components
│   │   ├── calendar/
│   │   └── legend-selector/
│   ├── pages/                 # Core pages
│   │   ├── index/             # Home (current status + actions)
│   │   ├── calendar/          # Visual cycle tracker
│   │   ├── knowledge/         # Cycle phase education
│   │   ├── start/             # (Optional) Start period record
│   │   └── end/               # (Optional) End period record
│   └── utils/                 # Utility & logic modules
│       ├── cloudDB.ts         # Database abstraction
│       ├── period.ts          # Cycle calculation
│       └── util.ts
├── typings/                   # Type definitions
│   └── types/
├── package.json
├── tsconfig.json
├── project.config.json        # WeChat DevTools config
└── project.private.config.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [WeChat DevTools](https://developers.weixin.qq.com/miniprogram/en/dev/devtools/devtools.html)
- (Optional) npm or pnpm for dependency management

### Setup

```bash
git clone <repository-url>
cd menstrual-tracker
npm install
```

Then open the project in **WeChat DevTools** and hit “Run”.

---

## 🛠 Development Notes

- TypeScript enabled with strict checks
- Uses [微信云开发（CloudBase）](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html) for data storage
- Modern `wx.cloud.database()` + modular architecture

---

## 📌 TODO Ideas (Optional)

- Notification/reminder for upcoming periods
- Personalized cycle predictions based on history
- Symptom/mood logging
- Sharing reports with doctors (PDF/CSV)

---

## 📄 License

This project is for **personal use and learning purposes**. You may fork and adapt it for your own cycle tracking or research.
