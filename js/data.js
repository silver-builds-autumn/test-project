const GUIDE_DATA = {
  meta: {
    title: '2026端午广州看龙舟 + 珠海三日地图攻略',
    dateRange: '2026年6月19日 - 6月21日',
    tiandituKey: 'a2ca005a710864da5d797e35e0f45b3b',
    center: [113.46, 22.72],
    zoom: 9,
    principle: '广州端午当天看龙舟更稳，傍晚进珠海；珠海两晚住吉大/城市阳台附近，用海岸线动线减少折返。',
    sourceSummary: [
      'Word 攻略主线：6月19日上午广州二沙涌/寺右/杨箕看龙舟，傍晚广州东优先转珠海站。',
      '珠海主线：6月20圆明新园、北山/富华里、情侣路、日月贝；6月21景山/海滨公园后返广州。',
      '珠海龙舟不作为主线押注：原资料指出公开活动多集中在节前，端午当天广州确定性更高。'
    ]
  },
  days: [
    {
      id: 1,
      title: 'Day 1｜广州龙舟观赛 + 傍晚进珠海',
      date: '6月19日',
      color: '#c43d2b',
      summary: '上午到二沙涌、寺右、杨箕一带看龙舟，下午视体力加猎德涌或商场休整，16:00前后撤向广州东站，傍晚抵达珠海站并入住吉大/城市阳台。',
      route: ['wuyangcun', 'ershachong', 'yangji', 'guangzhou-restaurant-tiyudong', 'liedechong', 'guangzhou-east', 'zhuhai-station', 'jida-stay', 'xiawan'],
      schedule: [
        { time: '08:30', title: '抵达五羊邨/寺右片区', detail: '地铁五羊邨、珠江新城或杨箕出站后步行/短打车到岸边，9:30前到位更稳。' },
        { time: '09:30-12:30', title: '主看广州端午龙舟', detail: '以二沙涌、寺右新马路、杨箕一带为主，现场按官方公告、人流管控和临水安全线调整站位。' },
        { time: '12:30-13:30', title: '附近午饭避晒', detail: '五羊新城、珠江新城、体育东商圈解决；多人同行建议优先商场或老字号，减少排队暴晒。' },
        { time: '14:00-15:30', title: '猎德涌或休整', detail: '体力好再加猎德涌；太热、人多、下雨或车票紧张时，直接商场休整并提前去车站。' },
        { time: '16:00-19:00', title: '广州东优先转珠海站', detail: '优先查广州东→珠海站；无合适车次再改广州南兜底，到站口径锁定珠海站，不优先珠海北。' },
        { time: '19:00-21:30', title: '入住 + 就近晚餐', detail: '住吉大/城市阳台一带，晚餐选夏湾夜市、茶餐厅或生蚝，避免第一晚继续长距离移动。' }
      ]
    },
    {
      id: 2,
      title: 'Day 2｜珠海园林、北山与海岸线',
      date: '6月20日',
      color: '#206fba',
      summary: '上午圆明新园，中午北山大院或富华里，下午爱情邮局、珠海渔女、香炉湾、城市阳台，晚上野狸岛和日月贝看亮灯。',
      route: ['yuanming', 'beishan', 'fuhuali', 'love-post', 'fisher-girl', 'xianglu-bay', 'city-balcony', 'yeli-island', 'opera-house'],
      schedule: [
        { time: '09:30-11:30', title: '圆明新园', detail: '免费园林，上午光线和体感更合适；园区较大，按体力决定是否深逛。' },
        { time: '12:00-14:00', title: '北山大院 / 富华里', detail: '北山偏文艺街区，富华里偏商圈降温；二选一即可，不必全部压满。' },
        { time: '15:00-18:00', title: '情侣路海岸线', detail: '爱情邮局、珠海渔女、香炉湾、城市阳台顺路串联，适合步行 + 打车组合。' },
        { time: '19:00-21:00', title: '野狸岛 + 日月贝', detail: '19:00后看亮灯，结束后打车回吉大/城市阳台附近住宿区。' }
      ]
    },
    {
      id: 3,
      title: 'Day 3｜景山/海滨公园 + 午餐后返广州',
      date: '6月21日',
      color: '#1f9a6d',
      summary: '上午景山公园或海滨公园轻量看海，中午在香洲/吉大吃早茶或午餐，下午只补逛城市阳台、九洲城或香洲商圈，16:30-17:30返广州。',
      route: ['jingshan', 'haibin-park', 'yijian', 'jiuzhou-city', 'zhuhai-station'],
      schedule: [
        { time: '09:30-11:30', title: '景山公园 / 海滨公园', detail: '轻量登高看海岸线，索道滑道按天气、排队和体力选择。' },
        { time: '12:00-13:30', title: '香洲或吉大午餐', detail: '优先早茶、茶餐厅或海鲜简餐，控制用餐时间，避免返程被拖晚。' },
        { time: '14:00-15:30', title: '轻松补逛', detail: '城市阳台、九洲城或香洲商圈，不安排长隆、横琴等远点。' },
        { time: '16:00-17:30', title: '珠海站返广州', detail: '优先锁定16:30-17:30珠海站返广州东/广州南车次，晚饭前回广州。' }
      ]
    }
  ],
  places: [
    {
      id: 'wuyangcun', day: 1, category: 'station', name: '五羊邨地铁站', lng: 113.3149, lat: 23.1192,
      short: '广州龙舟主线入口', time: '08:30前后', cost: '地铁费用', dwell: '集合10分钟', search: '五羊邨地铁站 / 寺右新马路',
      transport: '广州地铁5号线；也可从珠江新城、杨箕换乘或短打车到寺右片区。',
      walking: '出站后沿寺右新马路方向步行约10-15分钟到临水观赛带；端午当天靠近岸边可能临时限流。',
      risk: '不要直接打到最临水位置，临时封控时容易绕路。',
      description: '适合作为广州端午龙舟主线的集合点。相比直接打到岸边，地铁出站后步行更容易应对临时交通管控。',
      tags: ['集合点', '地铁5号线', '龙舟入口'], image: 'images/from-docx/image1.png'
    },
    {
      id: 'ershachong', day: 1, category: 'dragon', name: '二沙涌 / 寺右龙舟观赛带', lng: 113.3048, lat: 23.1162,
      short: '端午上午主看点', time: '09:30-12:30', cost: '免费', dwell: '2-3小时', search: '寺右新马路 / 二沙岛 星海音乐厅 / 二沙涌',
      transport: '五羊邨、珠江新城、杨箕均可转入；实际入口以现场管控为准。',
      walking: '沿寺右新马路、二沙岛岸线择人少处停留，不建议频繁横穿人群。',
      risk: '临水、人多、无遮阴；建议提前占位，带水、防晒、帽子和轻便鞋。',
      description: '原始攻略明确的主看区域，适合看传统龙船景。这里比临时追小众村涌更稳，但人流密度高，需要提前到位。',
      tags: ['龙舟', '主看点', '防晒'], image: 'images/from-docx/image2.png'
    },
    {
      id: 'yangji', day: 1, category: 'dragon', name: '杨箕片区', lng: 113.3091, lat: 23.1284,
      short: '观赛与转场缓冲区', time: '上午-中午', cost: '免费', dwell: '20-60分钟', search: '杨箕地铁站 / 杨箕村 / 寺右新马路',
      transport: '广州地铁1号线/5号线杨箕站；适合从东山口、五羊邨、珠江新城之间机动。',
      walking: '若二沙涌人满，可退回杨箕周边用餐或休整，再向广州东站转场。',
      risk: '作为缓冲点使用，不要把它当成唯一固定观赛点。',
      description: '非常实用的交通缓冲点；适合在官方公告变化或岸边人流过大时调整。',
      tags: ['备选站位', '地铁换乘'], image: 'images/from-docx/image3.png'
    },
    {
      id: 'guangzhou-restaurant-tiyudong', day: 1, category: 'food', name: '广州酒家（体育东店）', lng: 113.3287, lat: 23.1331,
      short: '第一天午饭/早茶备选', time: '12:30-13:40', cost: '人均约80-150元', dwell: '60-80分钟', search: '广州酒家 体育东店',
      transport: '靠近体育中心、体育西路、林和西片区；从五羊邨/珠江新城短打车或地铁转入。',
      walking: '若上午观赛体力消耗大，可以把午餐放到体育东/天河北商圈，吃完更容易去广州东站。',
      risk: '节假日老字号可能排队，排队超过20分钟建议改商场简餐。',
      description: '补充为第一天中午的稳妥餐饮点：老字号粤菜/点心，位置靠近广州东转场方向，适合多人同行统一口味。',
      tags: ['粤菜', '早茶', '转场顺路'], image: 'images/from-docx/image4.png'
    },
    {
      id: 'liedechong', day: 1, category: 'backup', name: '猎德涌', lng: 113.3346, lat: 23.1161,
      short: '下午体力好再加', time: '14:00-15:30', cost: '免费', dwell: '30-60分钟', search: '猎德涌 / 猎德地铁站 / 花城广场',
      transport: '广州地铁5号线猎德站；从珠江新城/花城汇短打车也方便。',
      walking: '沿猎德涌两侧短距离看即可，不建议从上午观赛区一路暴走过来。',
      risk: '如果天气热、人流大或车票时间紧，直接放弃，不影响主线体验。',
      description: '广州龙舟氛围浓的备选点。原始攻略建议体力好再去，若天气热、人多或车票紧张，应直接休整或去车站。',
      tags: ['备选龙舟', '下午加点'], image: 'images/from-docx/image5.png'
    },
    {
      id: 'guangzhou-east', day: 1, category: 'station', name: '广州东站', lng: 113.3249, lat: 23.1506,
      short: '进珠海优先车站', time: '16:00前后撤向车站', cost: '广州-珠海二等座约70元/人/程，以12306为准', dwell: '进站预留45-60分钟', search: '广州东站',
      transport: '地铁1号线/3号线北延段；从珠江新城、杨箕、五羊邨片区转入较顺。',
      walking: '端午不要卡点进站，至少留出安检、刷证、找站台时间。',
      risk: '若18:00前后无合适车次或余票，不要临近发车才改广州南。',
      description: '原始攻略反复强调的优先转场站。若广州东到珠海站无合适车次，再查广州南。',
      tags: ['城际', '优先', '转场'], image: 'images/from-docx/image6.png'
    },
    {
      id: 'guangzhou-south', day: 1, category: 'station', name: '广州南站', lng: 113.2697, lat: 22.9892,
      short: '无合适车次时兜底', time: '傍晚备选', cost: '以12306为准', dwell: '进站预留60分钟', search: '广州南站',
      transport: '地铁2号线/7号线；从市中心过去时间更长。',
      walking: '只有广州东无合适车次或余票时再改这里，避免从观赛区长距离折返。',
      risk: '站体大、人多、换乘距离长，临时改站要留足时间。',
      description: '车次选择通常更多，但从广州龙舟观赛片区转场更耗时，适合作为票务兜底。',
      tags: ['兜底车站'], image: 'images/from-docx/image7.png'
    },
    {
      id: 'zhuhai-station', day: 1, category: 'station', name: '珠海站', lng: 113.5493, lat: 22.2153,
      short: '珠海到站与返程站', time: '6/19晚抵达，6/21下午返程', cost: '站内交通按实际', dwell: '到达/返程各30-45分钟', search: '珠海站',
      transport: '珠海站到吉大/城市阳台约15-25分钟车程；不优先珠海北。',
      walking: '出站后建议直接打车或网约车到住宿，不把第一晚行程拉远。',
      risk: '口岸、拱北周边节假日车流密集，晚高峰打车要预留等待时间。',
      description: '三日路线的跨城锚点。买票时默认以珠海站为目标，第三天也从这里返广州更稳。',
      tags: ['动车', '返程'], image: 'images/from-docx/image8.png'
    },
    {
      id: 'jida-stay', day: 1, category: 'stay', name: '吉大 / 城市阳台住宿圈', lng: 113.581, lat: 22.248,
      short: '两晚住宿首选范围', time: '6/19-6/21', cost: '节假日经济型约300-600元/晚，中高端约600-1200元/晚，以平台实时价为准', dwell: '两晚', search: '珠海 吉大 / 九洲城 / 城市阳台 / 情侣中路',
      transport: '靠近情侣中路、城市阳台、九洲城、海滨公园，去珠海站约15-25分钟。',
      walking: '晚上可就近海边散步；第三天下午不远行，利于返程。',
      risk: '端午房价浮动大，优先订可取消房型，不建议住横琴除非改长隆全天。',
      description: '原始攻略的核心住宿建议。这个范围兼顾海岸线景点、吃饭选择和返程效率，比横琴/长隆更适合本主线。',
      tags: ['住宿', '海岸线', '返程稳'], image: 'images/from-docx/image9.png'
    },
    {
      id: 'xiawan', day: 1, category: 'food', name: '夏湾夜市', lng: 113.5398, lat: 22.2204,
      short: '第一晚不跑远的夜市选择', time: '6/19晚', cost: '人均约40-90元', dwell: '60-90分钟', search: '夏湾夜市',
      transport: '从珠海站或吉大打车较方便；晚高峰按实时路况调整。',
      walking: '到珠海后若体力一般，晚餐就近茶餐厅也可，不必强行夜市。',
      risk: '夜市排队和烟火气较重，同行有人累了就改酒店附近简餐。',
      description: '适合第一晚吃砂锅粥、烧烤、生蚝和小吃。优点是选择多，缺点是假期可能排队。',
      tags: ['夜市', '生蚝', '第一晚'], image: 'images/from-docx/image10.png'
    },
    {
      id: 'yuanming', day: 2, category: 'sight', name: '圆明新园', lng: 113.5335, lat: 22.2472,
      short: '上午免费园林', time: '6/20上午', cost: '主园区通常免费，园内项目另计', dwell: '1.5-2小时', search: '珠海 圆明新园',
      transport: '从吉大/城市阳台打车约15-25分钟；也可公交到圆明新园站。',
      walking: '上午从入口按主轴线走，不必把每个角落走完，给中午北山/富华里留时间。',
      risk: '园区大，天气热时不建议深度暴走。',
      description: '适合上午拍照和轻量游园。端午天气热，建议控制在2小时左右。',
      tags: ['园林', '免费', '上午'], image: 'images/from-docx/image1.png'
    },
    {
      id: 'beishan', day: 2, category: 'sight', name: '北山大院', lng: 113.5095, lat: 22.2183,
      short: '文艺街区与午餐备选', time: '6/20中午', cost: '街区免费，餐饮人均约50-120元', dwell: '1-1.5小时', search: '珠海 北山大院 / 北山村',
      transport: '从圆明新园打车约15-25分钟；公交可到北山站/南屏片区。',
      walking: '适合短逛 + 午餐，不建议和富华里都深逛。',
      risk: '街区店铺分散，炎热天气要及时进店休息。',
      description: '更适合咖啡、简餐、糖水和拍照，作为中午降温休息点比继续户外暴走更合理。',
      tags: ['文艺街区', '午餐', '降温'], image: 'images/from-docx/image2.png'
    },
    {
      id: 'fuhuali', day: 2, category: 'food', name: '富华里', lng: 113.5452, lat: 22.2392,
      short: '商圈午餐与降温备选', time: '6/20中午', cost: '人均约60-150元', dwell: '1-2小时', search: '珠海 富华里',
      transport: '靠近九洲大道，打车和公交都方便。',
      walking: '如果天气太晒，富华里比北山更适合作为室内/半室内休整点。',
      risk: '商圈餐饮选择多但饭点可能排队，建议现场用排队时长决定。',
      description: '餐厅密度高，适合同学多人按口味现场决定；也适合补给、防晒和休息。',
      tags: ['商圈', '午餐', '备选'], image: 'images/from-docx/image3.png'
    },
    {
      id: 'love-post', day: 2, category: 'sight', name: '爱情邮局', lng: 113.5898, lat: 22.2552,
      short: '情侣路海岸线起点', time: '6/20下午', cost: '免费', dwell: '30-45分钟', search: '珠海 爱情邮局 / 海滨泳场',
      transport: '从北山/富华里打车转入更省体力；公交可到海滨泳场/爱情邮局附近。',
      walking: '爱情邮局 → 珠海渔女 → 香炉湾 → 城市阳台，可按天气截断。',
      risk: '下午日晒强，建议把海岸线拆成若干短段。',
      description: '适合拍照和作为情侣路海岸线的下午起点。端午下午很晒，建议带帽子和水。',
      tags: ['拍照', '情侣路'], image: 'images/from-docx/image4.png'
    },
    {
      id: 'fisher-girl', day: 2, category: 'sight', name: '珠海渔女', lng: 113.5908, lat: 22.2616,
      short: '珠海城市地标', time: '6/20下午', cost: '免费', dwell: '20-40分钟', search: '珠海渔女',
      transport: '情侣路沿线公交、出租车较多；节假日注意路边上下车管控。',
      walking: '从爱情邮局沿海边步行可达，若太晒可短打车。',
      risk: '打卡点人多，不建议为单张照片长时间等待。',
      description: '珠海必打卡地标。建议把它作为海岸线中段，不要为了单点往返折腾。',
      tags: ['地标', '海景', '拍照'], image: 'images/from-docx/image5.png'
    },
    {
      id: 'xianglu-bay', day: 2, category: 'sight', name: '香炉湾沙滩', lng: 113.5897, lat: 22.2678,
      short: '渔女到城市阳台之间的海边缓冲', time: '6/20下午', cost: '免费', dwell: '20-45分钟', search: '香炉湾沙滩',
      transport: '位于情侣中路沿线，可与渔女、城市阳台连续安排。',
      walking: '适合短暂停留、看海、补水；不要在最晒时段长时间停留。',
      risk: '台风雨季或风浪大时，以现场开放情况为准。',
      description: '补充为情侣路动线中的休息点，用来把爱情邮局、渔女、城市阳台串成更自然的步行段。',
      tags: ['沙滩', '海岸线', '休息点'], image: 'images/from-docx/image6.png'
    },
    {
      id: 'city-balcony', day: 2, category: 'sight', name: '珠海城市阳台', lng: 113.589, lat: 22.251,
      short: '海边休息与住宿锚点', time: '6/20下午或6/21补逛', cost: '免费，餐饮另计', dwell: '40-90分钟', search: '珠海城市阳台',
      transport: '靠近吉大、九洲城和海滨公园，适合住宿圈内步行/短打车。',
      walking: '下午海岸线走累后可在这里休整；第三天也适合作为轻松补逛点。',
      risk: '餐饮价格可能高于普通街区，按休息需求选择即可。',
      description: '本路线的核心区域之一，既能看海，也方便吃饭和回酒店。',
      tags: ['海边', '休整', '住宿圈'], image: 'images/from-docx/image7.png'
    },
    {
      id: 'yeli-island', day: 2, category: 'sight', name: '野狸岛', lng: 113.5943, lat: 22.2847,
      short: '晚上转日月贝前的海岛步道', time: '6/20晚上', cost: '免费', dwell: '30-60分钟', search: '野狸岛',
      transport: '从城市阳台或渔女打车/公交到野狸岛入口；岛内适合步行。',
      walking: '19:00后走短线看夜景即可，保留返程体力。',
      risk: '夜间返程建议打车，不要硬走回酒店。',
      description: '连接日月贝的夜景点，适合饭后散步，不建议在白天最晒时段安排。',
      tags: ['夜景', '步道'], image: 'images/from-docx/image8.png'
    },
    {
      id: 'opera-house', day: 2, category: 'sight', name: '珠海大剧院（日月贝）', lng: 113.5954, lat: 22.2866,
      short: '第二晚亮灯点', time: '6/20 19:00后', cost: '外观免费，演出另计', dwell: '30-60分钟', search: '珠海大剧院 日月贝',
      transport: '野狸岛步行可达；结束后建议打车回住宿区。',
      walking: '以看外观亮灯和拍照为主，不把夜间路线拉太长。',
      risk: '节假日打车可能排队，提前看叫车等待时间。',
      description: '珠海最具识别度的夜景建筑。与野狸岛连在一起安排，动线自然。',
      tags: ['夜景', '日月贝'], image: 'images/from-docx/image9.png'
    },
    {
      id: 'jingshan', day: 3, category: 'sight', name: '景山公园', lng: 113.5762, lat: 22.2576,
      short: '第三天轻量登高', time: '6/21上午', cost: '公园免费，索道/滑道约80元左右，以现场为准', dwell: '1-2小时', search: '珠海 景山公园',
      transport: '靠近海滨公园、吉大和城市阳台，适合第三天上午安排。',
      walking: '天气热就只走轻量路线；索道滑道按排队情况决定。',
      risk: '排队超过预期就放弃索道/滑道，返程日不能拖。',
      description: '能看珠海海岸线和城市景观，但第三天重点是稳妥返程，不能把上午拖太久。',
      tags: ['登高', '海景', '返程日'], image: 'images/from-docx/image10.png'
    },
    {
      id: 'haibin-park', day: 3, category: 'sight', name: '海滨公园', lng: 113.5775, lat: 22.2597,
      short: '景山下方轻松备选', time: '6/21上午', cost: '免费', dwell: '30-60分钟', search: '珠海 海滨公园',
      transport: '吉大/城市阳台附近步行或短打车可达。',
      walking: '不想登高时，海滨公园 + 城市阳台是更轻松的返程日组合。',
      risk: '若上午下雨，可改九洲城或香洲商圈。',
      description: '适合返程日上午散步，不消耗太多体力。',
      tags: ['公园', '轻松'], image: 'images/from-docx/image1.png'
    },
    {
      id: 'yijian', day: 3, category: 'food', name: '益健美食大广场', lng: 113.561, lat: 22.275,
      short: '第三天早茶/午餐备选', time: '6/21中午', cost: '人均约60-120元', dwell: '60-80分钟', search: '珠海 益健美食大广场',
      transport: '香洲片区，去珠海站需预留路程和等车时间。',
      walking: '如果用餐排队超过预期，立即换附近茶餐厅或简餐。',
      risk: '第三天核心是返程，午餐不为排队牺牲车站缓冲。',
      description: '原始攻略提到的香洲/吉大午餐方向之一。第三天用餐原则是稳、近、别拖晚。',
      tags: ['早茶', '午餐', '控时间'], image: 'images/from-docx/image2.png'
    },
    {
      id: 'jiuzhou-city', day: 3, category: 'backup', name: '九洲城 / 吉大商圈', lng: 113.5748, lat: 22.2458,
      short: '返程前补逛与候场', time: '6/21 14:00-15:30', cost: '按消费实际', dwell: '30-90分钟', search: '珠海 九洲城 / 吉大商圈',
      transport: '到珠海站约15-25分钟车程，适合作为返程前最后一站。',
      walking: '只做短暂停留，不新增远点。',
      risk: '15:30后应进入返程模式，不再新增景点。',
      description: '返程日的安全缓冲区。比临时去远处景点更稳，也方便打车去珠海站。',
      tags: ['补逛', '候场', '返程稳'], image: 'images/from-docx/image3.png'
    },
    {
      id: 'chimelong', day: 2, category: 'backup', name: '长隆海洋王国', lng: 113.5436, lat: 22.1017,
      short: '整天替换型备选', time: '若改行程需6/20全天', cost: '约450-650元/人，以官方票价为准', dwell: '全天', search: '珠海长隆海洋王国',
      transport: '位于横琴，距离主线住宿圈较远；节假日排队成本高。',
      walking: '若一定去，应砍掉圆明新园、北山和大部分情侣路，不建议硬塞。',
      risk: '不能作为半天加点，端午排队会挤压第三天返程体力。',
      description: '本版不作为主线。原因是第三天要晚饭前回广州，且端午人流会放大排队和转场成本。',
      tags: ['备选', '主题乐园', '需整天'], image: 'images/from-docx/image4.png'
    }
  ],
  food: [
    { name: '广州酒家（体育东店）', scene: '第一天午餐备选', cost: '人均80-150元', recommendation: '点心、烧味、粤菜；适合从珠江新城/五羊邨撤出后顺路吃饭。', transport: '靠近广州东转场方向，若排队过久改体育东/天河北商场简餐。' },
    { name: '夏湾夜市', scene: '第一晚到珠海后', cost: '人均40-90元', recommendation: '砂锅粥、烧烤、生蚝、小吃；优先按排队少的店选。', transport: '珠海站/吉大打车较方便，别为了夜市拖太晚。' },
    { name: '北山大院', scene: '第二天中午', cost: '人均50-120元', recommendation: '咖啡、简餐、糖水、茶餐厅；适合拍照和降温。', transport: '从圆明新园打车转入更省体力。' },
    { name: '富华里', scene: '第二天午餐备选', cost: '人均60-150元', recommendation: '多人同行口味不统一时更好用，商圈选择密度高。', transport: '天气太热时优先商圈休整。' },
    { name: '生蚝/海鲜', scene: '第二晚', cost: '人均100-220元', recommendation: '冯姐生蚝、濠轩阁生蚝火锅等按排队情况选。', transport: '晚餐后再去野狸岛/日月贝，避免来回折返。' },
    { name: '香洲/吉大早茶', scene: '第三天中午', cost: '人均60-120元', recommendation: '益健美食大广场、新海利或附近茶餐厅；核心是控制时间。', transport: '吃完直接准备返程，不再去远点。' }
  ],
  stays: [
    { name: '吉大', reason: '靠九洲城、海滨公园、城市阳台，吃饭和返程都稳。', price: '经济型约300-600元/晚，中高端约600-1200元/晚', search: '珠海 吉大 / 九洲城 / 情侣中路' },
    { name: '城市阳台 / 海滨公园', reason: '海岸线体验最好，晚上散步和第二天出发都方便。', price: '节假日价格浮动大，建议提前锁定可取消房型', search: '珠海 城市阳台 / 海滨公园 / 景山道' },
    { name: '不优先横琴/长隆', reason: '除非把第二天整天改成长隆，否则会明显增加返程压力和打车成本。', price: '长隆度假区通常更高', search: '仅作为长隆替换方案使用' }
  ],
  transit: [
    { title: '广州龙舟入口', primary: '五羊邨地铁站 / 寺右新马路 / 二沙岛星海音乐厅', detail: '先到五羊邨或二沙岛，再按现场人流走到岸边。不要把车直接叫到封控核心。' },
    { title: '广州备选观赛', primary: '猎德涌 / 猎德地铁站 / 花城广场', detail: '下午体力好再加；天气热、人多或车票时间紧就放弃。' },
    { title: '跨城转场', primary: '广州东站优先，广州南站兜底', detail: '16:00前后从观赛点撤；广州东无合适车次再改广州南。' },
    { title: '珠海到站', primary: '珠海站', detail: '买动车票默认到珠海站，不优先珠海北；到吉大/城市阳台更顺。' },
    { title: '珠海住宿搜索', primary: '珠海 城市阳台 / 九洲城 / 吉大 / 情侣中路', detail: '订房和打车都可以用这些关键词，第三天去珠海站更稳。' },
    { title: 'Day2景点搜索', primary: '圆明新园 / 北山大院 / 爱情邮局 / 珠海渔女 / 日月贝', detail: '按地图顺序走，少折返；极热或暴雨时压缩户外海岸线。' }
  ],
  budget: [
    { item: '动车', estimate: '约140元/人', note: '广州东/广州南 - 珠海站往返，按二等座常见价估算。' },
    { item: '市内交通', estimate: '约40-100元/人', note: '地铁、公交、共享单车、观光巴士、少量打车组合。' },
    { item: '餐饮', estimate: '约250-450元/人', note: '茶餐厅、早茶、生蚝、夜市组合。' },
    { item: '门票', estimate: '主线大多免费', note: '景山索道/滑道可选约80元；不含长隆。' },
    { item: '总预算', estimate: '不含住宿约430-730元/人', note: '若加入长隆，额外约450-650元/人。' }
  ],
  backup: {
    title: '备选策略',
    items: [
      '天气很热或暴雨：压缩情侣路户外段，改北山/富华里/商场/糖水。',
      '一定要去长隆：把6月20改为长隆全天，砍掉圆明新园、北山和大部分情侣路。',
      '广州东无合适车次：再查广州南，不要临近发车才改站。',
      '龙舟公告变化：以广州文旅、广州日报新花城、越秀/天河/海珠官方发布为准。',
      '同行体力不足：优先保留二沙涌龙舟、珠海城市阳台、日月贝、珠海站返程四个锚点。'
    ]
  },
  checklist: [
    { title: '查公告', detail: '出发前1-3天查广州文旅、广州日报新花城、越秀/天河/海珠区政府或街道公告。' },
    { title: '锁车票', detail: '优先广州东/广州南 → 珠海站，返程买珠海站 → 广州东/广州南，16:30-17:30最稳。' },
    { title: '订住宿', detail: '搜索吉大、九洲城、海滨公园、城市阳台、景山道、情侣中路，优先可取消房型。' },
    { title: '带装备', detail: '身份证、防晒、帽子、冰袖、晴雨伞、充电宝、轻便鞋、少量现金和一瓶水。' },
    { title: '现场策略', detail: '龙舟9:30前到岸边；16:00前后撤向广州东；第三天不安排远点。' },
    { title: '导航口径', detail: '页面地图用于空间理解，实际入口、封路和路线以当天导航 App 实时结果为准。' }
  ]
};

if (typeof window !== 'undefined') {
  window.GUIDE_DATA = GUIDE_DATA;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GUIDE_DATA;
}