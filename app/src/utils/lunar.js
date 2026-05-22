/**
 * 农历转换工具模块
 * 基于公开的万年历算法实现，数据覆盖 1900-2100 年
 * @module lunar
 */

// ==================== 基础数据 ====================

/** 天干 */
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/** 地支 */
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/** 生肖（对应地支） */
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

/** 农历月份名 */
const LUNAR_MONTH_NAMES = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月'
];

/** 农历日期名 */
const LUNAR_DAY_NAMES = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

/**
 * 五行纳音表 - 60甲子对应的纳音五行
 * 每两个天干地支配一个纳音名
 */
const NA_YIN_TABLE = [
  { ganZhi: '甲子', wuXing: '金', name: '海中金' },
  { ganZhi: '乙丑', wuXing: '金', name: '海中金' },
  { ganZhi: '丙寅', wuXing: '火', name: '炉中火' },
  { ganZhi: '丁卯', wuXing: '火', name: '炉中火' },
  { ganZhi: '戊辰', wuXing: '木', name: '大林木' },
  { ganZhi: '己巳', wuXing: '木', name: '大林木' },
  { ganZhi: '庚午', wuXing: '土', name: '路旁土' },
  { ganZhi: '辛未', wuXing: '土', name: '路旁土' },
  { ganZhi: '壬申', wuXing: '金', name: '剑锋金' },
  { ganZhi: '癸酉', wuXing: '金', name: '剑锋金' },
  { ganZhi: '甲戌', wuXing: '火', name: '山头火' },
  { ganZhi: '乙亥', wuXing: '火', name: '山头火' },
  { ganZhi: '丙子', wuXing: '水', name: '涧下水' },
  { ganZhi: '丁丑', wuXing: '水', name: '涧下水' },
  { ganZhi: '戊寅', wuXing: '土', name: '城头土' },
  { ganZhi: '己卯', wuXing: '土', name: '城头土' },
  { ganZhi: '庚辰', wuXing: '金', name: '白蜡金' },
  { ganZhi: '辛巳', wuXing: '金', name: '白蜡金' },
  { ganZhi: '壬午', wuXing: '木', name: '杨柳木' },
  { ganZhi: '癸未', wuXing: '木', name: '杨柳木' },
  { ganZhi: '甲申', wuXing: '水', name: '泉中水' },
  { ganZhi: '乙酉', wuXing: '水', name: '泉中水' },
  { ganZhi: '丙戌', wuXing: '土', name: '屋上土' },
  { ganZhi: '丁亥', wuXing: '土', name: '屋上土' },
  { ganZhi: '戊子', wuXing: '火', name: '霹雳火' },
  { ganZhi: '己丑', wuXing: '火', name: '霹雳火' },
  { ganZhi: '庚寅', wuXing: '木', name: '松柏木' },
  { ganZhi: '辛卯', wuXing: '木', name: '松柏木' },
  { ganZhi: '壬辰', wuXing: '水', name: '长流水' },
  { ganZhi: '癸巳', wuXing: '水', name: '长流水' },
  { ganZhi: '甲午', wuXing: '金', name: '砂中金' },
  { ganZhi: '乙未', wuXing: '金', name: '砂中金' },
  { ganZhi: '丙申', wuXing: '火', name: '山下火' },
  { ganZhi: '丁酉', wuXing: '火', name: '山下火' },
  { ganZhi: '戊戌', wuXing: '木', name: '平地木' },
  { ganZhi: '己亥', wuXing: '木', name: '平地木' },
  { ganZhi: '庚子', wuXing: '土', name: '壁上土' },
  { ganZhi: '辛丑', wuXing: '土', name: '壁上土' },
  { ganZhi: '壬寅', wuXing: '金', name: '金箔金' },
  { ganZhi: '癸卯', wuXing: '金', name: '金箔金' },
  { ganZhi: '甲辰', wuXing: '火', name: '覆灯火' },
  { ganZhi: '乙巳', wuXing: '火', name: '覆灯火' },
  { ganZhi: '丙午', wuXing: '水', name: '天河水' },
  { ganZhi: '丁未', wuXing: '水', name: '天河水' },
  { ganZhi: '戊申', wuXing: '土', name: '大驿土' },
  { ganZhi: '己酉', wuXing: '土', name: '大驿土' },
  { ganZhi: '庚戌', wuXing: '金', name: '钗钏金' },
  { ganZhi: '辛亥', wuXing: '金', name: '钗钏金' },
  { ganZhi: '壬子', wuXing: '木', name: '桑柘木' },
  { ganZhi: '癸丑', wuXing: '木', name: '桑柘木' },
  { ganZhi: '甲寅', wuXing: '水', name: '大溪水' },
  { ganZhi: '乙卯', wuXing: '水', name: '大溪水' },
  { ganZhi: '丙辰', wuXing: '土', name: '沙中土' },
  { ganZhi: '丁巳', wuXing: '土', name: '沙中土' },
  { ganZhi: '戊午', wuXing: '火', name: '天上火' },
  { ganZhi: '己未', wuXing: '火', name: '天上火' },
  { ganZhi: '庚申', wuXing: '木', name: '石榴木' },
  { ganZhi: '辛酉', wuXing: '木', name: '石榴木' },
  { ganZhi: '壬戌', wuXing: '水', name: '大海水' },
  { ganZhi: '癸亥', wuXing: '水', name: '大海水' }
];

/**
 * 农历数据表（1900-2100年）
 * 编码格式：每年一个20位整数
 * - 高4位（bit16-19）：闰月月份（0表示无闰月）
 * - 中12位（bit4-15）：1-12月大小月（1=大月30天，0=小月29天）
 *   bit15=1月, bit14=2月, ..., bit4=12月
 * - 低4位（bit0-3）：闰月大小（8=30天，0=29天，仅bit0有效）
 */
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, // 1900-1904
  0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1905-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, // 1910-1914
  0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1915-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, // 1920-1924
  0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1925-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x16a95, 0x05ad0, // 1930-1934
  0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1935-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, // 1940-1944
  0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1945-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, // 1950-1954
  0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1955-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, // 1960-1964
  0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1965-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, // 1970-1974
  0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1975-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, // 1980-1984
  0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1985-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, // 1990-1994
  0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, // 1995-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, // 2000-2004
  0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2005-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, // 2010-2014
  0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2015-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, // 2020-2024
  0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2025-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, // 2030-2034
  0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2035-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, // 2040-2044
  0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2045-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, // 2050-2054
  0x168a6, 0x0ea50, 0x06aa0, 0x1a6c4, 0x0aae0, // 2055-2059
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, // 2060-2064
  0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2065-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, // 2070-2074
  0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2075-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, // 2080-2084
  0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2085-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, // 2090-2094
  0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252, // 2095-2099
  0x0d520  // 2100
];

// ==================== 农历计算函数 ====================

/**
 * 获取农历年份的闰月月份
 * @param {number} year - 农历年份（1900-2100）
 * @returns {number} 闰月月份（0表示无闰月）
 */
function getLeapMonth(year) {
  return LUNAR_INFO[year - 1900] & 0xf;
}

/**
 * 获取农历某年某月的天数
 * @param {number} year - 农历年份
 * @param {number} month - 农历月份（1-12）
 * @returns {number} 该月天数（29或30）
 */
function getLunarMonthDays(year, month) {
  const info = LUNAR_INFO[year - 1900];
  // bit(16 - month) 为1则30天，为0则29天
  return (info & (0x10000 >> month)) ? 30 : 29;
}

/**
 * 获取农历闰月的天数
 * @param {number} year - 农历年份
 * @returns {number} 闰月天数（0表示无闰月）
 */
function getLeapMonthDays(year) {
  if (getLeapMonth(year)) {
    return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

/**
 * 获取农历年的总天数
 * @param {number} year - 农历年份
 * @returns {number} 该年总天数
 */
function getLunarYearDays(year) {
  let totalDays = 0;
  for (let i = 1; i <= 12; i++) {
    totalDays += getLunarMonthDays(year, i);
  }
  return totalDays + getLeapMonthDays(year);
}

/**
 * 计算公历日期对应的农历日期
 * @param {number} year - 公历年份
 * @param {number} month - 公历月份（1-12）
 * @param {number} day - 公历日期
 * @returns {{ year: number, month: number, day: number, isLeap: boolean }} 农历日期
 */
export function solarToLunar(year, month, day) {
  // 基准日期：1900年1月31日 = 农历庚子年正月初一
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);

  // 计算距离基准日期的天数偏移
  let offset = Math.floor((targetDate - baseDate) / 86400000);

  // 确定农历年份：逐年减去该年天数直到 offset >= 0
  let lunarYear = 1900;
  let yearDaysCount;
  for (lunarYear = 1900; lunarYear < 2101 && offset > 0; lunarYear++) {
    yearDaysCount = getLunarYearDays(lunarYear);
    offset -= yearDaysCount;
  }
  if (offset < 0) {
    offset += yearDaysCount;
    lunarYear--;
  }

  // 确定农历月份和日期
  const leapMonth = getLeapMonth(lunarYear);
  let isLeap = false;
  let lunarMonth = 1;
  let monthDaysCount;

  for (lunarMonth = 1; lunarMonth <= 13 && offset > 0; lunarMonth++) {
    // 闰月处理：闰月跟在对应月份之后
    if (leapMonth > 0 && lunarMonth === leapMonth + 1 && !isLeap) {
      // 这是闰月月位
      monthDaysCount = getLeapMonthDays(lunarYear);
      isLeap = true;
      lunarMonth--; // 不递增农历月份，因为闰月属于前一个月
    } else {
      monthDaysCount = getLunarMonthDays(lunarYear, lunarMonth);
    }

    offset -= monthDaysCount;

    if (isLeap && lunarMonth === leapMonth + 1) {
      isLeap = false; // 闰月结束
    }
  }

  // 处理恰好在月末边界的边界情况
  if (offset === 0 && leapMonth > 0 && lunarMonth === leapMonth + 2) {
    isLeap = true;
    lunarMonth--;
  }

  if (offset < 0) {
    offset += monthDaysCount;
    lunarMonth--;
  }

  const lunarDay = offset + 1;

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeap: isLeap
  };
}

/**
 * 获取农历日期的中文表示
 * @param {number} year - 公历年份
 * @param {number} month - 公历月份（1-12）
 * @param {number} day - 公历日期
 * @returns {string} 农历日期字符串（如"四月初五"）
 */
export function getLunarDate(year, month, day) {
  const lunar = solarToLunar(year, month, day);
  const monthStr = (lunar.isLeap ? '闰' : '') + LUNAR_MONTH_NAMES[lunar.month - 1];
  const dayStr = LUNAR_DAY_NAMES[lunar.day - 1];
  return `${monthStr}${dayStr}`;
}

// ==================== 天干地支计算 ====================

/**
 * 获取干支组合字符串
 * @param {number} ganIndex - 天干索引（0-9）
 * @param {number} zhiIndex - 地支索引（0-11）
 * @returns {string} 天干地支组合
 */
function getGanZhiString(ganIndex, zhiIndex) {
  return TIAN_GAN[((ganIndex % 10) + 10) % 10] + DI_ZHI[((zhiIndex % 12) + 12) % 12];
}

/**
 * 计算年柱（年干支）
 * 注意：传统以立春为年柱分界，此处简化使用农历正月初一
 * @param {number} year - 公历年份
 * @param {number} month - 公历月份（1-12）
 * @param {number} day - 公历日期
 * @returns {string} 年柱干支
 */
function getYearGanZhi(year, month, day) {
  const lunar = solarToLunar(year, month, day);
  // 年干支 = (农历年 - 4) 对应的干支
  const ganIndex = (lunar.year - 4) % 10;
  const zhiIndex = (lunar.year - 4) % 12;
  return getGanZhiString(ganIndex, zhiIndex);
}

/**
 * 计算月柱（月干支）
 * 口诀：甲己之年丙作首，乙庚之年戊为头，丙辛之岁寻庚上，丁壬壬寅顺水流，若问戊癸何处起，甲寅之上好追求
 * @param {number} yearGanIndex - 年干索引（0-9）
 * @param {number} lunarMonth - 农历月份（1-12）
 * @returns {string} 月柱干支
 */
function getMonthGanZhi(yearGanIndex, lunarMonth) {
  // 月支：正月=寅(2), 二月=卯(3), ..., 十二月=丑(1)
  const monthZhiIndex = (lunarMonth + 1) % 12;

  // 月干起始：根据年干确定
  const monthGanBase = [2, 4, 6, 8, 0]; // 甲己->丙, 乙庚->戊, 丙辛->庚, 丁壬->壬, 戊癸->甲
  const ganBase = monthGanBase[yearGanIndex % 5];
  const monthGanIndex = (ganBase + lunarMonth - 1) % 10;

  return getGanZhiString(monthGanIndex, monthZhiIndex);
}

/**
 * 计算日柱（日干支）
 * 基于基准日 1900-01-01 = 甲戌日
 * @param {number} year - 公历年份
 * @param {number} month - 公历月份（1-12）
 * @param {number} day - 公历日期
 * @returns {string} 日柱干支
 */
function getDayGanZhi(year, month, day) {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const offset = Math.floor((targetDate - baseDate) / 86400000);

  // 1900-01-01 是甲戌日（天干甲=0，地支戌=10）
  const ganIndex = (offset + 0) % 10;
  const zhiIndex = (offset + 10) % 12;

  return getGanZhiString(ganIndex, zhiIndex);
}

/**
 * 获取完整的年月日干支
 * @param {number} year - 公历年份
 * @param {number} month - 公历月份（1-12）
 * @param {number} day - 公历日期
 * @returns {{ year: string, month: string, day: string }} 年柱、月柱、日柱
 */
export function getGanZhi(year, month, day) {
  const yearGanZhi = getYearGanZhi(year, month, day);
  const yearGanIndex = TIAN_GAN.indexOf(yearGanZhi[0]);
  const lunar = solarToLunar(year, month, day);
  const monthGanZhi = getMonthGanZhi(yearGanIndex, lunar.month);
  const dayGanZhi = getDayGanZhi(year, month, day);

  return {
    year: yearGanZhi,
    month: monthGanZhi,
    day: dayGanZhi
  };
}

// ==================== 生肖 ====================

/**
 * 获取生肖
 * @param {number} year - 公历年份
 * @param {number} month - 公历月份
 * @param {number} day - 公历日期
 * @returns {string} 生肖名称
 */
export function getShengXiao(year, month, day) {
  const lunar = solarToLunar(year, month, day);
  const zhiIndex = (lunar.year - 4) % 12;
  return SHENG_XIAO[zhiIndex];
}

// ==================== 五行纳音 ====================

/**
 * 获取五行纳音
 * @param {string} ganZhi - 天干地支组合（如"甲子"）
 * @returns {{ wuXing: string, name: string }} 五行和纳音名
 */
export function getWuXing(ganZhi) {
  const found = NA_YIN_TABLE.find(item => item.ganZhi === ganZhi);
  if (found) {
    return { wuXing: found.wuXing, name: found.name };
  }
  // 默认返回
  return { wuXing: '金', name: '海中金' };
}

// ==================== 冲煞 ====================

/**
 * 地支六冲表
 * 子午冲、丑未冲、寅申冲、卯酉冲、辰戌冲、巳亥冲
 */
const CHONG_TABLE = {
  '子': '午', '丑': '未', '寅': '申', '卯': '酉', '辰': '戌', '巳': '亥',
  '午': '子', '未': '丑', '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳'
};

/**
 * 地支对应的方位
 */
const DI_ZHI_DIRECTION = {
  '子': '北', '丑': '东北', '寅': '东北', '卯': '东',
  '辰': '东南', '巳': '东南', '午': '南', '未': '西南',
  '申': '西南', '酉': '西', '戌': '西北', '亥': '西北'
};

/**
 * 获取冲煞信息
 * @param {string} dayGanZhi - 日柱干支（如"甲子"）
 * @returns {{ chong: string, sha: string }} 冲某生肖、煞某方位
 */
export function getChongSha(dayGanZhi) {
  const dayZhi = dayGanZhi[1];
  const chongZhi = CHONG_TABLE[dayZhi];
  const chongIndex = DI_ZHI.indexOf(chongZhi);
  const chongShengXiao = SHENG_XIAO[chongIndex];
  const shaDirection = DI_ZHI_DIRECTION[chongZhi];

  return { chong: chongShengXiao, sha: shaDirection };
}

// ==================== 五行辅助 ====================

/**
 * 获取天干对应的五行
 * @param {string} gan - 天干字符
 * @returns {string} 五行（木火土金水）
 */
export function getGanWuXing(gan) {
  const ganIndex = TIAN_GAN.indexOf(gan);
  const wuXings = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
  return wuXings[ganIndex];
}

/**
 * 获取地支对应的五行
 * @param {string} zhi - 地支字符
 * @returns {string} 五行（木火土金水）
 */
export function getZhiWuXing(zhi) {
  const zhiIndex = DI_ZHI.indexOf(zhi);
  const wuXings = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];
  return wuXings[zhiIndex];
}

// ==================== 常量导出 ====================

export const CONSTANTS = {
  TIAN_GAN,
  DI_ZHI,
  SHENG_XIAO,
  LUNAR_MONTH_NAMES,
  LUNAR_DAY_NAMES,
  NA_YIN_TABLE,
  CHONG_TABLE,
  DI_ZHI_DIRECTION
};
