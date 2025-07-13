const cloud = wx.clouda;

const db = cloud.database();

const DEFAULT_CYCLE_LENGTH = 28;
const DEFAULT_PERIOD_LENGTH = 5;

function dateDiff(startStr, endStr) {
  const s = new Date(startStr);
  const e = new Date(endStr);
  const diff = (e - s) / (1000 * 60 * 60 * 24);
  return Math.floor(diff);
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getNextPeriodDate(startDateStr, cycleLength = 28) {
  const start = new Date(startDateStr);
  start.setDate(start.getDate() + cycleLength);
  return formatDate(start);
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const today = new Date();
  const todayStr = formatDate(today);

  let cycleLength = DEFAULT_CYCLE_LENGTH;
  let periodLength = DEFAULT_PERIOD_LENGTH;

  try {
    const userRes = await db
      .collection("user_profile")
      .where({ _openid: openid })
      .limit(1)
      .get();

    if (userRes.data.length > 0) {
      cycleLength = userRes.data[0].cycle_length || cycleLength;
      periodLength = userRes.data[0].period_length || periodLength;
    }
  } catch (e) {
    console.error("用户设置读取失败", e);
  }

  const res = await db
    .collection("daily_logs")
    .where({
      _openid: openid,
      is_period_start: true,
    })
    .orderBy("date", "desc")
    .limit(1)
    .get();

  if (res.data.length === 0) {
    return {
      code: 404,
      message: "无月经记录，请先记录一次月经开始日期",
      today: todayStr,
    };
  }

  const lastPeriodStart = res.data[0].date;
  const diffDays = dateDiff(lastPeriodStart, today);

  let phase = "";
  if (diffDays < 0) phase = "未知";
  else if (diffDays < periodLength) phase = "月经期";
  else if (diffDays < 14) phase = "卵泡期";
  else if (diffDays === 14) phase = "排卵期";
  else if (diffDays < cycleLength) phase = "黄体期";
  else phase = "下一个周期已开始，请更新记录";

  const nextPeriod = getNextPeriodDate(lastPeriodStart, cycleLength);

  return {
    code: 0,
    today: todayStr,
    lastPeriodStart,
    dayIndex: diffDays,
    phase,
    nextPeriod,
    cycleLength,
    periodLength,
  };
};
