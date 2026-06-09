/**
 * 天地图地图封装模块
 * 提供地图初始化、路线绘制、POI标记、信息窗口等功能
 */

const MapApp = {
    maps: {},
    routes: {},
    routeVisible: {},
    markers: {},
    icons: {},

    /**
     * 初始化 SVG 图标（转为 Base64 DataURI）
     */
    initIcons() {
        const mkIcon = (color, shape) => {
            let inner = '';
            if (shape === 'circle') inner = '<circle cx="15" cy="15" r="7" fill="#fff"/>';
            else if (shape === 'square') inner = '<rect x="9" y="9" width="12" height="12" rx="2" fill="#fff"/>';
            else if (shape === 'diamond') inner = '<polygon points="15,8 21,16 9,16" fill="#fff"/>';
            else if (shape === 'flag') inner = '<polygon points="10,8 20,13 10,18" fill="#fff"/><line x1="10" y1="8" x2="10" y2="22" stroke="#fff" stroke-width="2"/>';

            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
                <path d="M15 0C6.7 0 0 6.7 0 15c0 11.25 15 25 15 25s15-13.75 15-25C30 6.7 23.3 0 15 0z" fill="${color}"/>
                ${inner}
            </svg>`;
            const base64 = typeof btoa !== 'undefined'
                ? btoa(unescape(encodeURIComponent(svg)))
                : Buffer.from(svg).toString('base64');
            return new T.Icon({
                iconUrl: 'data:image/svg+xml;base64,' + base64,
                iconSize: new T.Point(30, 40),
                iconAnchor: new T.Point(15, 40)
            });
        };

        this.icons = {
            sight: mkIcon('#2980b9', 'circle'),
            activity: mkIcon('#c0392b', 'flag'),
            restaurant: mkIcon('#e67e22', 'square'),
            hotel: mkIcon('#8e44ad', 'diamond'),
            default: mkIcon('#7f8c8d', 'circle')
        };
    },

    /**
     * 初始化地图
     * @param {string} containerId - DOM容器ID
     * @param {number[]} center - [lng, lat]
     * @param {number} zoom - 缩放级别
     * @param {string} key - 地图标识（如 'overview', 'day1'）
     * @returns {T.Map}
     */
    init(containerId, center, zoom, key) {
        const el = document.getElementById(containerId);
        if (!el) {
            console.warn('Map container not found:', containerId);
            return null;
        }

        const map = new T.Map(containerId);
        map.centerAndZoom(new T.LngLat(center[0], center[1]), zoom);

        // 添加控件
        try {
            map.addControl(new T.Control.Zoom());
            map.addControl(new T.Control.Scale());
        } catch (e) {
            // 控件加载失败不影响主功能
        }

        this.maps[key] = map;
        this.routeVisible[key] = true;
        return map;
    },

    /**
     * 绘制路线折线
     * @param {T.Map} map
     * @param {number[][]} coords - [[lng, lat], ...]
     * @param {string} color - 线条颜色
     * @param {string} key - 存储键
     */
    drawRoute(map, coords, color, key) {
        if (!map || !coords || coords.length < 2) return null;

        const points = coords.map(c => new T.LngLat(c[0], c[1]));
        const line = new T.Polyline(points, {
            color: color,
            weight: 4,
            opacity: 0.85,
            lineStyle: 'solid'
        });
        map.addOverLay(line);

        if (key) {
            this.routes[key] = line;
        }
        return line;
    },

    /**
     * 添加 POI 标记
     * @param {T.Map} map
     * @param {Array} pois - POI数组
     * @param {string} key - 存储键
     */
    addMarkers(map, pois, key) {
        if (!map || !pois) return;

        const markerList = [];
        pois.forEach((poi, index) => {
            const icon = this.icons[poi.type] || this.icons.default;
            const marker = new T.Marker(
                new T.LngLat(poi.lng, poi.lat),
                { icon: icon }
            );
            map.addOverLay(marker);
            markerList.push(marker);

            // 信息窗口内容
            const typeLabel = poi.type === 'activity' ? '活动' :
                             poi.type === 'sight' ? '景点' :
                             poi.type === 'restaurant' ? '美食' :
                             poi.type === 'hotel' ? '住宿' : '地点';

            const timeHtml = poi.time ? `<div style="font-size:12px;color:#999;margin-top:4px;">⏱ ${poi.time}</div>` : '';
            const content = `
                <div style="padding:10px;min-width:180px;max-width:260px;font-family:sans-serif;">
                    <div style="font-weight:bold;font-size:15px;color:#333;margin-bottom:4px;">${poi.name}</div>
                    <div style="font-size:11px;color:#fff;background:${poi.themeColor || '#666'};display:inline-block;padding:1px 8px;border-radius:10px;margin-bottom:6px;">${typeLabel}</div>
                    <div style="font-size:13px;color:#666;line-height:1.5;">${poi.desc ? poi.desc.substring(0, 60) + (poi.desc.length > 60 ? '...' : '') : ''}</div>
                    ${timeHtml}
                </div>
            `;

            const infoWindow = new T.InfoWindow(content, {
                offset: new T.Point(0, -35)
            });

            marker.addEventListener('click', () => {
                marker.openInfoWindow(infoWindow);
            });
        });

        if (key) {
            this.markers[key] = markerList;
        }
    },

    /**
     * 重置地图视角
     * @param {string|number} day - 'overview' 或 1/2/3
     */
    resetView(day) {
        const key = day === 'overview' ? 'overview' : 'day' + day;
        const map = this.maps[key];
        if (!map) return;

        const dayData = day === 'overview' ? null : itinerary.days[day - 1];
        if (dayData) {
            map.panTo(new T.LngLat(dayData.mapCenter[0], dayData.mapCenter[1]));
            map.setZoom(dayData.mapZoom);
        }
    },

    /**
     * 切换路线显示/隐藏
     * @param {string|number} day
     */
    toggleRoute(day) {
        const key = day === 'overview' ? 'overview' : 'day' + day;
        const line = this.routes[key];
        if (!line) return;

        this.routeVisible[key] = !this.routeVisible[key];
        if (this.routeVisible[key]) {
            line.show();
        } else {
            line.hide();
        }
    },

    /**
     * 初始化所有地图
     */
    initAll() {
        if (typeof T === 'undefined') {
            console.warn('天地图 API 尚未加载');
            return;
        }

        this.initIcons();

        // 总览地图
        const overviewMap = this.init('map-overview', itinerary.overview.mapCenter, itinerary.overview.mapZoom, 'overview');
        if (overviewMap) {
            // 三日路线用不同颜色绘制
            itinerary.days.forEach(day => {
                this.drawRoute(overviewMap, day.route, day.routeColor, 'overview');
                // 添加当日POI
                const allPois = [
                    ...day.spots.map(s => ({...s, themeColor: day.routeColor})),
                    ...day.restaurants.map(r => ({...r, themeColor: day.routeColor})),
                ];
                if (day.hotel) allPois.push({...day.hotel, themeColor: day.routeColor});
                this.addMarkers(overviewMap, allPois, 'overview');
            });
        }

        // 每日地图
        itinerary.days.forEach(day => {
            const mapKey = 'day' + day.day;
            const dayMap = this.init('map-' + mapKey, day.mapCenter, day.mapZoom, mapKey);
            if (dayMap) {
                this.drawRoute(dayMap, day.route, day.routeColor, mapKey);

                const allPois = [
                    ...day.spots.map(s => ({...s, themeColor: day.routeColor})),
                    ...day.restaurants.map(r => ({...r, themeColor: day.routeColor})),
                ];
                if (day.hotel) allPois.push({...day.hotel, themeColor: day.routeColor});
                this.addMarkers(dayMap, allPois, mapKey);
            }
        });
    }
};

/**
 * 全局地图控制函数（供HTML onclick调用）
 */
function resetMap(day) {
    MapApp.resetView(day);
}

function toggleRoute(day) {
    MapApp.toggleRoute(day);
}