/**
 * 黄历计算工具模块
 * 基于公开的万年历算法实现
 * @module calendar
 */

import { solarToLunar, getGanZhi, getShengXiao, getChongSha, CONSTANTS } from './lunar';

// ==================== 基础数据 ====================

/** 建除十二神 */
const JIAN_CHU_SHEN = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'];

/**
 * 建除十二神吉凶表
 * 建：黑道凶；除：黄道吉；满：黑道凶；平：黑道凶
 * 定：黄道吉；执：黑道凶；破：黑道凶；危：黑道凶
 * 成：黄道吉；收：黄道凶；开：黄道吉；闭：黑道凶
 */
const JIAN_CHU_JI_XIONG = {
  '建': '凶',
  '除': '吉',
  '满': '凶',
  '平': '凶',
  '定': '吉',
  '执': '凶',
  '破': '凶',
  '危': '凶',
  '成': '吉',
  '收': '凶',
  '开': '吉',
  '闭': '凶'
};

/**
 * 十二神（黄道/黑道）
 * 青龙、明堂、金匮、天德、玉堂、司命 = 黄道（吉）
 * 天刑、朱雀、白虎、天牢、玄武、勾陈 = 黑道（凶）
 */
const SHIER_SHEN = [
  { name: '青龙', type: '黄道', jiXiong: '吉' },
  { name: '明堂', type: '黄道', jiXiong: '吉' },
  { name: '天刑', type: '黑道', jiXiong: '凶' },
  { name: '朱雀', type: '黑道', jiXiong: '凶' },
  { name: '金匮', type: '黄道', jiXiong: '吉' },
  { name: '天德', type: '黄道', jiXiong: '吉' },
  { name: '白虎', type: '黑道', jiXiong: '凶' },
  { name: '玉堂', type: '黄道', jiXiong: '吉' },
  { name: '天牢', type: '黑道', jiXiong: '凶' },
  { name: '玄武', type: '黑道', jiXiong: '凶' },
  { name: '司命', type: '黄道', jiXiong: '吉' },
  { name: '勾陈', type: '黑道', jiXiong: '凶' }
];

/**
 * 十二时辰
 */
const SHI_CHEN = [
  { name: '子', time: '23:00-01:00', hour: 0 },
  { name: '丑', time: '01:00-03:00', hour: 2 },
  { name: '寅', time: '03:00-05:00', hour: 4 },
  { name: '卯', time: '05:00-07:00', hour: 6 },
  { name: '辰', time: '07:00-09:00', hour: 8 },
  { name: '巳', time: '09:00-11:00', hour: 10 },
  { name: '午', time: '11:00-13:00', hour: 12 },
  { name: '未', time: '13:00-15:00', hour: 14 },
  { name: '申', time: '15:00-17:00', hour: 16 },
  { name: '酉', time: '17:00-19:00', hour: 18 },
  { name: '戌', time: '19:00-21:00', hour: 20 },
  { name: '亥', time: '21:00-23:00', hour: 22 }
];

/**
 * 黄历宜忌事项表
 */
const YI_JI_TABLE = {
  '建': {
    yi: ['裁衣', '筑堤', '动土', '竖柱', '上梁', '开仓', '栽种', '牧养'],
    ji: ['出行', '搬家', '远行', '诉讼', '开市', '交易', '祭祀', '祈福']
  },
  '除': {
    yi: ['祭祀', '祈福', '求嗣', '解除', '治病', '破屋坏垣', '扫舍', '出行'],
    ji: ['嫁娶', '纳采', '移徙', '开市', '交易', '栽种', '安葬', '修坟']
  },
  '满': {
    yi: ['祈福', '求嗣', '开光', '塑绘', '裁衣', '纳采', '嫁娶', '求财'],
    ji: ['移徙', '入宅', '安床', '开市', '出行', '栽种', '词讼', '远行']
  },
  '平': {
    yi: ['修造', '动土', '栽种', '牧养', '纳畜', '造畜稠', '造船', '放水'],
    ji: ['嫁娶', '移徙', '入宅', '开市', '交易', '祭祀', '祈福', '远行']
  },
  '定': {
    yi: ['祈福', '求嗣', '塑绘', '开光', '裁衣', '嫁娶', '纳采', '交易'],
    ji: ['出行', '栽种', '移徙', '词讼', '安葬', '动土', '破土', '远行']
  },
  '执': {
    yi: ['祭祀', '祈福', '开光', '塑绘', '裁衣', '嫁娶', '求财', '交易'],
    ji: ['移徙', '入宅', '安葬', '出行', '词讼', '远行', '栽种', '动土']
  },
  '破': {
    yi: ['破屋坏垣', '拆卸', '祭祀', '求嗣', '解除', '栽种', '修整道路'],
    ji: ['嫁娶', '移徙', '入宅', '开市', '交易', '出行', '远行', '安葬']
  },
  '危': {
    yi: ['祭祀', '祈福', '开光', '塑绘', '求嗣', '裁衣', '嫁娶', '纳采'],
    ji: ['出行', '登高', '远行', '栽种', '入宅', '移徙', '安葬', '词讼']
  },
  '成': {
    yi: ['嫁娶', '纳采', '移徙', '入宅', '开市', '交易', '祭祀', '祈福'],
    ji: ['诉讼', '出行', '栽种', '安葬', '修坟', '破土', '远行']
  },
  '收': {
    yi: ['纳财', '纳畜', '牧养', '纳采', '求嗣', '上梁', '竖柱', '造屋'],
    ji: ['开市', '出行', '栽种', '安葬', '入宅', '移徙', '词讼', '远行']
  },
  '开': {
    yi: ['开市', '交易', '立券', '挂匾', '开光', '出行', '入宅', '移徙'],
    ji: ['安葬', '破土', '行丧', '开仓', '动土', '祈福', '栽种', '远行']
  },
  '闭': {
    yi: ['纳财', '造畜稠', '牧养', '纳采', '造屋', '起基', '竖柱', '上梁'],
    ji: ['嫁娶', '开市', '出行', '安葬', '入宅', '移徙', '破土', '远行']
  }
};

/**
 * 五行相生相克关系
 */
const WU_XING_RELATIONS = {
  // 五行相生：木生火、火生土、土生金、金生水、水生木
  sheng: { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' },
  // 五行相克：木克土、土克水、水克火、火克金、金克木
  ke: { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' }
};

// ==================== 建除十二神计算 ====================

/**
 * 获取建除十二神
 * 算法：以月支为准，每月建日为月支对应之日
 * 子月建寅、丑月建寅...（简化算法）
 * @param {number} year - 公历年份
 * @param {number} month - 公历月份（1-12）
 * @param {number} day - 公历日期
 * @returns {string} 建除十二神
 */
export function getJianChu(year, month, day) {
  const ganZhi = getGanZhi(year, month, day);
  const dayZhi = ganZhi.day[1];

  // 获取农历月份对应的月支
  const lunar = solarToLunar(year, month, day);
  const monthZhiIndex = (lunar.month + 1) % 12;

  // 日支索引
  const dayZhiIndex = CONSTANTS.DI_ZHI.indexOf(dayZhi);

  // 建除神计算：月支建日为建，依次类推
  const jianChuIndex = (dayZhiIndex - monthZhiIndex + 12) % 12;

  return JIAN_CHU_SHEN[jianChuIndex];
}

// ==================== 黄道吉日计算 ====================

/**
 * 判断是否为黄道吉日
 * @param {number} year - 公历年份
 * @param {number} month - 公历月份（1-12）
 * @param {number} day - 公历日期
 * @returns {boolean} 是否为黄道吉日
 */
export function isGoodDay(year, month, day) {
  // 使用建除十二神判断吉凶
  const jianChu = getJianChu(year, month, day);
  return JIAN_CHU_JI_XIONG[jianChu] === '吉';
}

/**
 * 获取十二神信息
 * @param {number} year - 公历年份
 * @param {number} month - 公历月份（1-12）
 * @param {number} day - 公历日期
 * @returns {{ name: string, type: string, jiXiong: string }} 十二神信息
 */
export function getShiErShen(year, month, day) {
  const ganZhi = getGanZhi(year, month, day);
  const dayZhi = ganZhi.day[1];

  // 黄道十二神算法：青龙起于月支+2位
  // 子月青龙在寅、丑月青龙在卯、寅月青龙在辰...
  const lunar = solarToLunar(year, month, day);
  const monthZhiIndex = (lunar.month + 1) % 12;
  const qingLongIndex = (monthZhiIndex + 2) % 12;

  // 日支索引
  const dayZhiIndex = CONSTANTS.DI_ZHI.indexOf(dayZhi);

  // 从青龙位置开始，按十二神顺序查找
  const shenIndex = (dayZhiIndex - qingLongIndex + 12) % 12;
  return SHIER_SHEN[shenIndex];
}

// ==================== 宜忌事项计算 ====================

/**
 * 获取宜忌事项
 * @param {number} year - 公历年份
 * @param {number} month - 公历月份（1-12）
 * @param {number} day - 公历日期
 * @returns {{ yi: string[], ji: string[] }} 宜忌事项
 */
export function getYiJi(year, month, day) {
  const jianChu = getJianChu(year, month, day);
  const baseYiJi = YI_JI_TABLE[jianChu];

  // 获取天干地支，用于进一步细化宜忌
  const ganZhi = getGanZhi(year, month, day);
  const dayGan = ganZhi.day[0];

  // 根据日干调整宜忌（简化算法）
  let yi = [...baseYiJi.yi];
  let ji = [...baseYiJi.ji];

  // 根据日干五行增减宜忌
  const ganWuXing = CONSTANTS.TIAN_GAN.indexOf(dayGan) % 5;
  const wuXings = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];

  // 日干为阳干时，增加一些阳事宜忌
  if (ganWuXing % 2 === 0) {
    // 阳干
    if (!yi.includes('求财')) yi.push('求财');
    if (!ji.includes('安葬')) ji.push('安葬');
  } else {
    // 阴干
    if (!yi.includes('祭祀')) yi.push('祭祀');
    if (!ji.includes('动土')) ji.push('动土');
  }

  return { yi, ji };
}

// ==================== 吉时计算 ====================

/**
 * 获取吉时列表
 * 根据日干支推算吉时
 * @param {string} dayGanZhi - 日柱干支（如"甲子"）
 * @returns {string[]} 吉时列表
 */
export function getJiShi(dayGanZhi) {
  const dayGan = dayGanZhi[0];
  const dayZhi = dayGanZhi[1];

  const dayGanIndex = CONSTANTS.TIAN_GAN.indexOf(dayGan);
  const dayZhiIndex = CONSTANTS.DI_ZHI.indexOf(dayZhi);

  // 基于日干推算吉时
  // 算法：日干对应的时辰为吉时起点
  const jiShiStart = dayGanIndex % 12;
  const jiShiCount = 3 + (dayGanIndex % 3); // 3-5个吉时

  const jiShi = [];
  for (let i = 0; i < jiShiCount; i++) {
    const shiIndex = (jiShiStart + i * 2) % 12; // 间隔取吉时
    jiShi.push(SHI_CHEN[shiIndex].name + '时');
  }

  // 补充基于日支的吉时
  const dayZhiJiShiIndex = (dayZhiIndex + 6) % 12; // 冲位为吉
  if (!jiShi.includes(SHI_CHEN[dayZhiJiShiIndex].name + '时')) {
    jiShi.push(SHI_CHEN[dayZhiJiShiIndex].name + '时');
  }

  return jiShi.sort();
}

/**
 * 获取时辰详细信息
 * @param {string} shiChenName - 时辰名（如"子"）
 * @returns {{ name: string, time: string, hour: number }} 时辰信息
 */
export function getShiChenInfo(shiChenName) {
  return SHI_CHEN.find(s => s.name === shiChenName);
}

// ==================== 日历数据生成 ====================

/**
 * 获取某月每日数据
 * @param {number} year - 公历年份
 * @param {number} month - 公历月份（1-12）
 * @returns {Array<Object>} 每日数据数组
 */
export function getMonthData(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthData = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const ganZhi = getGanZhi(year, month, day);
    const lunar = solarToLunar(year, month, day);
    const lunarDate = `${lunar.isLeap ? '闰' : ''}${CONSTANTS.LUNAR_MONTH_NAMES[lunar.month - 1]}${CONSTANTS.LUNAR_DAY_NAMES[lunar.day - 1]}`;
    const shengXiao = getShengXiao(year, month, day);
    const jianChu = getJianChu(year, month, day);
    const isGood = isGoodDay(year, month, day);
    const yiJi = getYiJi(year, month, day);
    const chongSha = getChongSha(ganZhi.day);
    const jiShi = getJiShi(ganZhi.day);
    const shiErShen = getShiErShen(year, month, day);

    // 星期
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    monthData.push({
      // 公历信息
      solarDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      day,
      weekDay: weekDays[dayOfWeek],

      // 农历信息
      lunarDate,
      lunarMonth: lunar.month,
      lunarDay: lunar.day,
      isLeapMonth: lunar.isLeap,

      // 干支信息
      ganZhi,
      shengXiao,

      // 黄历信息
      jianChu,
      shiErShen,
      isGoodDay: isGood,
      jiXiong: isGood ? '吉' : '凶',

      // 宜忌
      yi: yiJi.yi,
      ji: yiJi.ji,

      // 冲煞
      chongSha,

      // 吉时
      jiShi,

      // 五行
      wuXing: {
        ganWuXing: getGanWuXing(ganZhi.day[0]),
        zhiWuXing: getZhiWuXing(ganZhi.day[1])
      }
    });
  }

  return monthData;
}

// ==================== 辅助函数 ====================

/**
 * 获取天干五行
 * @param {string} gan - 天干
 * @returns {string} 五行
 */
function getGanWuXing(gan) {
  const ganIndex = CONSTANTS.TIAN_GAN.indexOf(gan);
  const wuXings = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
  return wuXings[ganIndex];
}

/**
 * 获取地支五行
 * @param {string} zhi - 地支
 * @returns {string} 五行
 */
function getZhiWuXing(zhi) {
  const zhiIndex = CONSTANTS.DI_ZHI.indexOf(zhi);
  const wuXings = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];
  return wuXings[zhiIndex];
}

/**
 * 判断两个日期是否同一天（忽略时间）
 * @param {Date} date1 - 日期1
 * @param {Date} date2 - 日期2
 * @returns {boolean} 是否同一天
 */
export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 获取今日日期字符串
 * @returns {string} 今日日期（YYYY-MM-DD）
 */
export function getTodayString() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

/**
 * 获取今日完整黄历信息
 * @returns {Object} 今日黄历信息
 */
export function getTodayInfo() {
  const today = new Date();
  const monthData = getMonthData(today.getFullYear(), today.getMonth() + 1);
  return monthData[today.getDate() - 1];
}

// ==================== 常量导出 ====================

export const CALENDAR_CONSTANTS = {
  JIAN_CHU_SHEN,
  JIAN_CHU_JI_XIONG,
  SHIER_SHEN,
  SHI_CHEN,
  YI_JI_TABLE,
  WU_XING_RELATIONS
};
