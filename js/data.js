const itinerary = {
  title: "2026端午广州龙舟珠海三日图文攻略",
  subtitle: "龙舟竞渡·西关风情·海滨假日",
  date: "2026年6月10日 - 6月12日",
  coverImage: "images/web/cover.jpg",
  overview: {
    mapCenter: [113.35, 22.8],
    mapZoom: 9,
    totalRoute: [
      [113.343, 23.115],
      [113.325, 23.106],
      [113.242, 23.123],
      [113.244, 23.109],
      [113.27, 23.128],
      [113.593, 22.265],
      [113.541, 22.101]
    ]
  },
  days: [
    {
      day: 1,
      title: "广州·龙舟竞渡",
      themeColor: "#c0392b",
      date: "6月10日（端午节当日）",
      summary: "端午正日，感受广州最热闹的龙舟氛围。从猎德村的传统龙舟赛开始，沿珠江感受城市活力，登广州塔俯瞰全城，夜晚乘游船览珠江夜色。",
      routeColor: "#c0392b",
      mapCenter: [113.33, 23.11],
      mapZoom: 13,
      route: [
        [113.343, 23.115],
        [113.365, 23.103],
        [113.325, 23.106],
        [113.320, 23.108]
      ],
      spots: [
        {
          name: "猎德村龙舟赛",
          type: "activity",
          lat: 23.115,
          lng: 113.343,
          time: "08:30 - 12:00",
          desc: "猎德村是广州最具代表性的龙舟文化聚集地。端午节当日，猎德涌上百舸争流，锣鼓喧天。游客可在猎德大桥两侧观赛，感受千年龙舟文化的魅力。建议提前1小时到达占位。",
          tips: "最佳观赛点在猎德大桥人行道；带好遮阳伞和饮用水；可现场购买龙舟饭。",
          images: ["images/from-docx/image1.png", "images/web/spot-liede.jpg"]
        },
        {
          name: "琶洲会展区",
          type: "sight",
          lat: 23.103,
          lng: 113.365,
          time: "12:00 - 14:00",
          desc: "午餐后漫步琶洲，欣赏现代化会展建筑群与珠江交汇的景观。端午期间琶洲水岸常有民俗表演和文创市集。",
          tips: "可在琶洲美食街品尝地道广式茶点。",
          images: ["images/web/spot-pazhou.jpg"]
        },
        {
          name: "广州塔（小蛮腰）",
          type: "sight",
          lat: 23.106,
          lng: 113.325,
          time: "15:00 - 18:00",
          desc: "广州地标建筑，高600米。推荐登塔体验摩天轮和极速云霄项目，俯瞰珠江新城全景。塔下花城广场是拍摄广州塔全貌的最佳机位。",
          tips: "提前网上购票可节省排队时间；傍晚登塔可同时欣赏日景和夜景。",
          images: ["images/from-docx/image2.png", "images/web/spot-canton-tower.jpg"]
        },
        {
          name: "珠江夜游",
          type: "activity",
          lat: 23.108,
          lng: 113.320,
          time: "19:30 - 21:00",
          desc: "乘船游览珠江两岸璀璨夜景，途经海心沙、广州塔、猎德大桥等地标。端午节夜航可能伴有烟花表演。",
          tips: "天字码头或大沙头码头登船；建议预订二楼露天座位。",
          images: ["images/web/spot-pearl-river.jpg"]
        }
      ],
      restaurants: [
        {
          name: "广州酒家（体育东店）",
          type: "restaurant",
          lat: 23.135,
          lng: 113.33,
          time: "午餐",
          desc: "百年老字号，正宗广式早茶和粤菜。推荐：虾饺、流沙包、脆皮烧鹅。",
          images: ["images/web/food-guangzhou.jpg"]
        },
        {
          name: "炳胜品味（海印桥店）",
          type: "restaurant",
          lat: 23.115,
          lng: 113.29,
          time: "晚餐",
          desc: "米其林推荐餐厅，以精致粤菜闻名。推荐：菠萝包、黑叉烧、章红鱼刺身。",
          images: ["images/web/food-bingsheng.jpg"]
        }
      ],
      hotel: {
        name: "广州四季酒店",
        type: "hotel",
        lat: 23.12,
        lng: 113.33,
        desc: "位于珠江新城 IFC 高层，房间可俯瞰珠江及广州塔。位置便利，步行可达花城广场和地铁站。",
        price: "约 1500 元/晚",
        images: ["images/web/hotel-four-seasons.jpg"]
      }
    },
    {
      day: 2,
      title: "广州·西关古韵",
      themeColor: "#2980b9",
      date: "6月11日",
      summary: "深入广州老城区，感受西关风情。漫步荔枝湾涌，探访永庆坊的骑楼街巷，在沙面岛感受欧陆风情，夜晚漫步北京路品尝地道小吃。",
      routeColor: "#2980b9",
      mapCenter: [113.26, 23.12],
      mapZoom: 14,
      route: [
        [113.239, 23.123],
        [113.242, 23.123],
        [113.244, 23.109],
        [113.27, 23.128]
      ],
      spots: [
        {
          name: "荔枝湾涌",
          type: "sight",
          lat: 23.123,
          lng: 113.239,
          time: "09:00 - 11:00",
          desc: "荔枝湾是广州西关文化的发源地，涌边绿榕垂岸，古色古香。端午期间常有龙舟巡游和传统民俗表演。可沿涌边步行至文塔广场。",
          tips: "清晨人少景美，适合拍照；周边有众多西关小吃摊。",
          images: ["images/web/spot-lizhiwan.jpg"]
        },
        {
          name: "永庆坊",
          type: "sight",
          lat: 23.123,
          lng: 113.242,
          time: "11:00 - 13:00",
          desc: "广州最美骑楼街区，经微改造后成为文艺与烟火气并存的历史文化街区。汇聚传统手工艺品店、独立咖啡馆和非遗展示馆。",
          tips: "推荐打卡：李小龙祖居、粤剧艺术博物馆（免费）。",
          images: ["images/from-docx/image3.png", "images/web/spot-yongqingfang.jpg"]
        },
        {
          name: "沙面岛",
          type: "sight",
          lat: 23.109,
          lng: 113.244,
          time: "14:00 - 17:00",
          desc: "珠江冲积而成的沙洲，曾为英法租界。岛上遍布欧陆风情建筑，古树参天，是广州最具异国情调的地方。",
          tips: "建议租共享单车环岛；岛上咖啡馆适合下午茶。",
          images: ["images/web/spot-shamian.jpg"]
        },
        {
          name: "北京路步行街",
          type: "sight",
          lat: 23.128,
          lng: 113.27,
          time: "18:00 - 21:00",
          desc: "广州最繁华的商业步行街，拥有千年古道遗址。集购物、美食、文化于一体，夜晚霓虹璀璨。",
          tips: "大佛寺夜景绝美；惠福东路是美食一条街。",
          images: ["images/web/spot-beijing-road.jpg"]
        }
      ],
      restaurants: [
        {
          name: "泮溪酒家",
          type: "restaurant",
          lat: 23.124,
          lng: 113.238,
          time: "午餐",
          desc: "中国三大园林酒家之一，坐落于荔湾湖畔。推荐：马蹄糕、白切鸡、艇仔粥。",
          images: ["images/web/food-panxi.jpg"]
        },
        {
          name: "陈添记（宝华路店）",
          type: "restaurant",
          lat: 23.12,
          lng: 113.245,
          time: "晚餐",
          desc: "西关老字号小吃，只卖三样：祖传爽鱼皮、艇仔粥、猪肠粉。多年如一日，味道正宗。",
          images: ["images/web/food-chentianji.jpg"]
        }
      ],
      hotel: {
        name: "广州白天鹅宾馆",
        type: "hotel",
        lat: 23.108,
        lng: 113.243,
        desc: "位于沙面岛上的五星级经典酒店，中国第一家五星级酒店。江景房可览白鹅潭夜景。",
        price: "约 1200 元/晚",
        images: ["images/web/hotel-swan.jpg"]
      }
    },
    {
      day: 3,
      title: "珠海·海滨假日",
      themeColor: "#27ae60",
      date: "6月12日",
      summary: "前往浪漫之城珠海，沿着情侣路感受海滨风光，打卡珠海渔女，探秘长隆海洋王国或圆明新园，以一顿鲜美海鲜为旅程画上句号。",
      routeColor: "#27ae60",
      mapCenter: [113.55, 22.25],
      mapZoom: 12,
      route: [
        [113.538, 22.244],
        [113.567, 22.271],
        [113.593, 22.265],
        [113.541, 22.101]
      ],
      spots: [
        {
          name: "圆明新园",
          type: "sight",
          lat: 22.244,
          lng: 113.538,
          time: "09:00 - 12:00",
          desc: "按北京圆明园1:1比例精选复原的皇家园林，融合了古典建筑与岭南园林特色。端午期间有传统文化活动。",
          tips: "园区较大，建议租电瓶车；福海湖面可泛舟。",
          images: ["images/web/spot-yuanming.jpg"]
        },
        {
          name: "情侣路",
          type: "sight",
          lat: 22.271,
          lng: 113.567,
          time: "12:00 - 14:00",
          desc: "珠海最具代表性的海滨景观大道，全长28公里。沿途椰林婆娑，海风习习，是骑行和漫步的绝佳选择。",
          tips: "推荐从珠海渔女骑行至野狸岛，约5公里。",
          images: ["images/web/spot-lovers-road.jpg"]
        },
        {
          name: "珠海渔女",
          type: "sight",
          lat: 22.265,
          lng: 113.593,
          time: "14:00 - 15:30",
          desc: "珠海城市标志，高8.7米的巨型石雕，位于香炉湾畔。渔女手擎明珠，体态婀娜，是游客必打卡景点。",
          tips: "傍晚时分光线最适合拍照；旁边有海滨泳场。",
          images: ["images/from-docx/image4.png", "images/web/spot-fisher-girl.jpg"]
        },
        {
          name: "长隆海洋王国",
          type: "activity",
          lat: 22.101,
          lng: 113.541,
          time: "16:00 - 21:00",
          desc: "全球最大海洋主题公园之一，拥有鲸鲨馆、企鹅馆、白鲸剧场等。夜晚有烟花和无人机表演。",
          tips: "建议下载官方APP查看演出时间；夜场票性价比更高。",
          images: ["images/web/spot-chimelong.jpg"]
        }
      ],
      restaurants: [
        {
          name: "湾仔海鲜街",
          type: "restaurant",
          lat: 22.23,
          lng: 113.55,
          time: "午餐",
          desc: "珠海最负盛名的海鲜食街，临街选购生猛海鲜，再到对面餐厅加工。推荐：横琴蚝、濑尿虾、螃蟹。",
          images: ["images/web/food-seafood.jpg"]
        },
        {
          name: "珠海渔女海鲜餐厅",
          type: "restaurant",
          lat: 22.264,
          lng: 113.592,
          time: "晚餐",
          desc: "位于情侣路海滨，一边享用海鲜一边欣赏海景。推荐：清蒸石斑、蒜蓉蒸扇贝。",
          images: ["images/web/food-zhuhai.jpg"]
        }
      ],
      hotel: {
        name: "珠海长隆横琴湾酒店",
        type: "hotel",
        lat: 22.10,
        lng: 113.54,
        desc: "长隆度假区内的主题度假酒店，可与海豚共泳。住客享海洋王国提前入园权益。",
        price: "约 1800 元/晚",
        images: ["images/web/hotel-chimelong.jpg"]
      }
    }
  ],
  tips: [
    "广州端午节期间气温较高（30-35℃），注意防暑降温，随身携带防晒用品。",
    "龙舟赛期间人流密集，建议公共交通出行，地铁猎德站、潭村站可达。",
    "广州到珠海可乘坐广珠城轨（广州南站→珠海站，约1小时），也可自驾经广珠西线。",
    "长隆海洋王国建议提前在官网购票，夜场票通常16:00后入场。",
    "端午期间酒店价格上浮，建议提前预订。"
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = itinerary;
}