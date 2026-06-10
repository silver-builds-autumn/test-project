export type GuideCategory = 'dragon' | 'sight' | 'food' | 'station' | 'stay' | 'backup';

export type GuidePlace = {
  id: string;
  day: number;
  category: GuideCategory;
  name: string;
  lng: number;
  lat: number;
  short: string;
  description: string;
};

export type GuideDay = {
  id: number;
  title: string;
  color: string;
  route: string[];
};

export type GuideDataset = {
  meta: {
    center: [number, number];
    zoom: number;
  };
  days: GuideDay[];
  places: GuidePlace[];
};

export const guideDataset: GuideDataset = {
  meta: {
    center: [113.46, 22.72],
    zoom: 9
  },
  days: [
    {
      id: 1,
      title: 'Day 1｜广州龙舟观赛 + 傍晚进珠海',
      color: '#c43d2b',
      route: ['wuyangcun', 'ershachong', 'guangzhou-east', 'zhuhai-station']
    },
    {
      id: 2,
      title: 'Day 2｜珠海园林、北山与海岸线',
      color: '#206fba',
      route: ['yuanming', 'fuhuali', 'fisher-girl', 'opera-house']
    },
    {
      id: 3,
      title: 'Day 3｜景山/海滨公园 + 午餐后返广州',
      color: '#1f9a6d',
      route: ['jingshan', 'city-balcony', 'zhuhai-station']
    }
  ],
  places: [
    {
      id: 'wuyangcun',
      day: 1,
      category: 'station',
      name: '五羊邨地铁站',
      lng: 113.3149,
      lat: 23.1192,
      short: '广州龙舟主线入口',
      description: '作为广州端午龙舟主线集合点，便于切入寺右和二沙涌观赛带。'
    },
    {
      id: 'ershachong',
      day: 1,
      category: 'dragon',
      name: '二沙涌 / 寺右龙舟观赛带',
      lng: 113.3048,
      lat: 23.1162,
      short: '端午上午主看点',
      description: '当前静态版主路线中的核心观赛点，强调上午提前到位。'
    },
    {
      id: 'guangzhou-east',
      day: 1,
      category: 'station',
      name: '广州东站',
      lng: 113.3249,
      lat: 23.1506,
      short: '傍晚优先进珠海的转场站',
      description: '第一天从广州撤离后优先转入珠海站的跨城交通锚点。'
    },
    {
      id: 'zhuhai-station',
      day: 1,
      category: 'station',
      name: '珠海站',
      lng: 113.5493,
      lat: 22.2153,
      short: '珠海到站与返程站',
      description: '全程跨城锚点，第一晚到站与第三天下午返程都围绕这里。'
    },
    {
      id: 'yuanming',
      day: 2,
      category: 'sight',
      name: '圆明新园',
      lng: 113.5335,
      lat: 22.2472,
      short: '第二天上午园林主点',
      description: '第二天上午轻量游园与拍照的起点。'
    },
    {
      id: 'fuhuali',
      day: 2,
      category: 'food',
      name: '富华里',
      lng: 113.5452,
      lat: 22.2392,
      short: '商圈午餐与降温点',
      description: '连接园林与海岸线之间的室内休整和午餐节点。'
    },
    {
      id: 'fisher-girl',
      day: 2,
      category: 'sight',
      name: '珠海渔女',
      lng: 113.5875,
      lat: 22.2715,
      short: '情侣路海岸线代表点',
      description: '第二天下午海岸线串联中的标志性节点。'
    },
    {
      id: 'opera-house',
      day: 2,
      category: 'sight',
      name: '珠海大剧院（日月贝）',
      lng: 113.5867,
      lat: 22.2763,
      short: '夜间亮灯收尾点',
      description: '第二天晚间海边收尾与亮灯观景点。'
    },
    {
      id: 'jingshan',
      day: 3,
      category: 'sight',
      name: '景山公园',
      lng: 113.5758,
      lat: 22.2626,
      short: '第三天上午轻量看海点',
      description: '第三天控制体力和时间的轻量登高节点。'
    },
    {
      id: 'city-balcony',
      day: 3,
      category: 'sight',
      name: '城市阳台',
      lng: 113.5809,
      lat: 22.2558,
      short: '返程前的近程补逛点',
      description: '靠近主住宿圈和返程动线，适合作为第三天补逛缓冲。'
    }
  ]
};