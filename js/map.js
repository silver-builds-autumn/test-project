const GuideMap = (() => {
  const tk = 'a2ca005a710864da5d797e35e0f45b3b';
  const categoryMeta = {
    dragon: { label: '龙舟观赛', color: '#c43d2b' },
    sight: { label: '景点', color: '#206fba' },
    food: { label: '餐饮', color: '#e68632' },
    station: { label: '交通', color: '#5d6678' },
    stay: { label: '住宿区域', color: '#7b4bb2' },
    backup: { label: '备选', color: '#1f9a6d' }
  };

  let map;
  let popupOverlay;
  let vectorSource;
  let routeSource;
  let layerGroups = {};
  let selectedPlace = null;
  let currentFilters = { day: 'all', category: 'all' };

  const tiandituLayer = (type, labelType) => new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: `https://t{0-7}.tianditu.gov.cn/${type}_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${type}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${tk}`,
      crossOrigin: 'anonymous',
      wrapX: true
    }),
    properties: { labelType }
  });

  const createBaseLayers = () => {
    layerGroups = {
      vector: new ol.layer.Group({
        visible: true,
        layers: [tiandituLayer('vec', 'base'), tiandituLayer('cva', 'label')]
      }),
      image: new ol.layer.Group({
        visible: false,
        layers: [tiandituLayer('img', 'base'), tiandituLayer('cia', 'label')]
      }),
      terrain: new ol.layer.Group({
        visible: false,
        layers: [tiandituLayer('ter', 'base'), tiandituLayer('cta', 'label')]
      })
    };
    return [layerGroups.vector, layerGroups.image, layerGroups.terrain];
  };

  const asLonLat = place => [place.lng, place.lat];
  const toWebMercator = lonLat => ol.proj.fromLonLat(lonLat);
  const iconSvg = (fill, label) => {
    const safeLabel = String(label || '').slice(0, 3);
    const fontSize = safeLabel.length > 2 ? 11 : 14;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="52" viewBox="0 0 42 52">
      <filter id="shadow" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#172033" flood-opacity="0.24"/></filter>
      <path filter="url(#shadow)" d="M21 2C10.5 2 2 10.2 2 20.4 2 34.1 21 50 21 50s19-15.9 19-29.6C40 10.2 31.5 2 21 2z" fill="${fill}"/>
      <circle cx="21" cy="20" r="12" fill="#fff" fill-opacity="0.95"/>
      <text x="21" y="25" text-anchor="middle" font-size="${fontSize}" font-family="Arial, sans-serif" font-weight="700" fill="${fill}">${safeLabel}</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const routeOrderLabel = place => {
    const day = GUIDE_DATA.days.find(item => item.id === place.day);
    if (!day) return '';
    const index = day.route.indexOf(place.id);
    return index >= 0 ? `${place.day}-${index + 1}` : '';
  };

  const styleCache = {};
  const placeStyle = feature => {
    const place = feature.get('place');
    const meta = categoryMeta[place.category] || categoryMeta.sight;
    const selected = selectedPlace && selectedPlace.id === place.id;
    const order = routeOrderLabel(place);
    const key = `${place.id}-${selected ? 'selected' : 'normal'}-${order}`;
    if (!styleCache[key]) {
      styleCache[key] = new ol.style.Style({
        image: new ol.style.Icon({
          src: iconSvg(meta.color, order || meta.label),
          anchor: [0.5, 1],
          scale: selected ? 1.18 : 0.94
        }),
        text: new ol.style.Text({
          text: place.name,
          offsetY: -58,
          font: selected ? '700 13px sans-serif' : '600 12px sans-serif',
          fill: new ol.style.Fill({ color: '#1f2a3d' }),
          stroke: new ol.style.Stroke({ color: '#fff', width: 4 }),
          padding: [4, 6, 4, 6]
        })
      });
    }
    return styleCache[key];
  };

  const routeStyle = feature => new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: feature.get('color'),
      width: feature.get('isTransfer') ? 3 : 5,
      lineDash: feature.get('isTransfer') ? [8, 8] : undefined
    })
  });

  const findPlace = id => GUIDE_DATA.places.find(place => place.id === id);

  const filteredPlaces = () => GUIDE_DATA.places.filter(place => {
    const dayOk = currentFilters.day === 'all' || String(place.day) === currentFilters.day;
    const categoryOk = currentFilters.category === 'all' || place.category === currentFilters.category;
    return dayOk && categoryOk;
  });

  const buildPlaceFeatures = () => {
    vectorSource.clear();
    const features = filteredPlaces().map(place => new ol.Feature({
      geometry: new ol.geom.Point(toWebMercator(asLonLat(place))),
      place
    }));
    vectorSource.addFeatures(features);
  };

  const buildRouteFeatures = () => {
    routeSource.clear();
    GUIDE_DATA.days.forEach(day => {
      if (currentFilters.day !== 'all' && String(day.id) !== currentFilters.day) return;
      const routePlaces = day.route.map(findPlace).filter(Boolean);
      if (routePlaces.length < 2) return;
      const coords = routePlaces.map(place => toWebMercator(asLonLat(place)));
      const line = new ol.Feature({
        geometry: new ol.geom.LineString(coords),
        color: day.color,
        isTransfer: day.id === 1 && day.route.includes('guangzhou-east') && day.route.includes('zhuhai-station')
      });
      routeSource.addFeature(line);
    });
  };

  const popupHtml = place => {
    const meta = categoryMeta[place.category] || categoryMeta.sight;
    const tags = (place.tags || []).map(tag => `<span>${tag}</span>`).join('');
    const optionalRows = [
      place.dwell ? `<div><dt>建议停留</dt><dd>${place.dwell}</dd></div>` : '',
      place.search ? `<div><dt>地图搜索词</dt><dd>${place.search}</dd></div>` : '',
      place.risk ? `<div><dt>风险提示</dt><dd>${place.risk}</dd></div>` : ''
    ].join('');
    return `
      <article class="popup-card">
        <div class="popup-kicker" style="--popup-color:${meta.color}">${meta.label}</div>
        <h3>${place.name}</h3>
        <p>${place.description}</p>
        <dl>
          <div><dt>时间</dt><dd>${place.time || '按当天安排'}</dd></div>
          <div><dt>消费</dt><dd>${place.cost || '按实际消费'}</dd></div>
          <div><dt>交通</dt><dd>${place.transport || '以实时导航为准'}</dd></div>
          <div><dt>步行建议</dt><dd>${place.walking || '按现场情况调整'}</dd></div>
          ${optionalRows}
        </dl>
        <div class="tag-row">${tags}</div>
        <button class="primary-action small" type="button" data-nav-place="${place.id}">导航到这里</button>
      </article>`;
  };

  const showPopup = place => {
    selectedPlace = place;
    vectorSource.changed();
    const content = document.getElementById('popupContent');
    content.innerHTML = popupHtml(place);
    popupOverlay.setPosition(toWebMercator(asLonLat(place)));
    content.querySelector('[data-nav-place]').addEventListener('click', () => {
      if (window.GuideApp) window.GuideApp.openNavigation(place);
    });
  };

  const closePopup = () => {
    selectedPlace = null;
    vectorSource.changed();
    popupOverlay.setPosition(undefined);
  };

  const fitToCurrent = () => {
    const features = vectorSource.getFeatures();
    if (!features.length) return;
    const extent = ol.extent.createEmpty();
    features.forEach(feature => ol.extent.extend(extent, feature.getGeometry().getExtent()));
    map.getView().fit(extent, { padding: [80, 80, 80, 80], maxZoom: 14, duration: 350 });
  };

  const setBaseLayer = value => {
    Object.entries(layerGroups).forEach(([key, layer]) => layer.setVisible(key === value));
  };

  const setFilters = filters => {
    currentFilters = { ...currentFilters, ...filters };
    closePopup();
    buildRouteFeatures();
    buildPlaceFeatures();
    fitToCurrent();
    if (window.GuideApp) window.GuideApp.renderPlaceList(filteredPlaces());
  };

  const init = () => {
    const target = document.getElementById('guide-map');
    if (!target || !window.ol || !window.GUIDE_DATA) return;

    vectorSource = new ol.source.Vector();
    routeSource = new ol.source.Vector();

    const routeLayer = new ol.layer.Vector({ source: routeSource, style: routeStyle, zIndex: 5 });
    const placeLayer = new ol.layer.Vector({ source: vectorSource, style: placeStyle, zIndex: 10 });

    popupOverlay = new ol.Overlay({
      element: document.getElementById('map-popup'),
      autoPan: { animation: { duration: 250 } },
      offset: [0, -42]
    });

    const defaultControls = typeof ol.control.defaults === 'function'
      ? ol.control.defaults()
      : typeof ol.control.defaults?.defaults === 'function'
        ? ol.control.defaults.defaults()
        : undefined;

    map = new ol.Map({
      target: 'guide-map',
      layers: [...createBaseLayers(), routeLayer, placeLayer],
      overlays: [popupOverlay],
      view: new ol.View({ center: toWebMercator(GUIDE_DATA.meta.center), zoom: GUIDE_DATA.meta.zoom }),
      controls: defaultControls ? defaultControls.extend([new ol.control.FullScreen(), new ol.control.ScaleLine()]) : undefined
    });

    map.on('singleclick', evt => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, hit => hit);
      if (feature && feature.get('place')) {
        showPopup(feature.get('place'));
      } else {
        closePopup();
      }
    });

    map.on('pointermove', evt => {
      const hit = map.hasFeatureAtPixel(evt.pixel);
      target.style.cursor = hit ? 'pointer' : '';
    });

    document.getElementById('popupClose').addEventListener('click', closePopup);
    document.getElementById('baseLayerSelect').addEventListener('change', event => setBaseLayer(event.target.value));
    document.getElementById('dayFilter').addEventListener('change', event => setFilters({ day: event.target.value }));
    document.getElementById('categoryFilter').addEventListener('change', event => setFilters({ category: event.target.value }));
    document.getElementById('fitMapBtn').addEventListener('click', fitToCurrent);

    buildRouteFeatures();
    buildPlaceFeatures();
    fitToCurrent();
  };

  return {
    init,
    setFilters,
    showPopup,
    fitToCurrent,
    filteredPlaces,
    categoryMeta
  };
})();

if (typeof window !== 'undefined') {
  window.GuideMap = GuideMap;
}