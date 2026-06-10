import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import { LineString, Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';

import { guideDataset, type GuideDataset, type GuidePlace } from '@/data/guideData';

export type GuideFilters = {
  day: number | 'all';
  category: string;
};

export type MapMountState = {
  mounted: boolean;
  targetId: string;
};

export type GuideMapFacadeOptions = {
  dataset?: GuideDataset;
  onSelect?: (place: GuidePlace | null) => void;
};

const routeOrderLabel = (dataset: GuideDataset, place: GuidePlace): string => {
  const day = dataset.days.find(item => item.id === place.day);
  if (!day) return '';
  const index = day.route.indexOf(place.id);
  return index >= 0 ? `${place.day}-${index + 1}` : '';
};

export const createGuideMapFacade = (options: GuideMapFacadeOptions = {}) => {
  let dataset: GuideDataset = options.dataset ?? guideDataset;
  let state: MapMountState = {
    mounted: false,
    targetId: ''
  };

  let map: Map | null = null;
  let placeSource: VectorSource | null = null;
  let routeSource: VectorSource | null = null;
  let selectedSpotId: string | null = null;
  let filters: GuideFilters = {
    day: 'all',
    category: 'all'
  };

  const visiblePlaces = () => dataset.places.filter(place => {
    const dayOk = filters.day === 'all' || place.day === filters.day;
    const categoryOk = filters.category === 'all' || place.category === filters.category;
    return dayOk && categoryOk;
  });

  const placeStyle = (feature: Feature) => {
    const place = feature.get('place') as GuidePlace;
    const selected = place.id === selectedSpotId;
    const order = routeOrderLabel(dataset, place);

    return new Style({
      image: new CircleStyle({
        radius: selected ? 10 : 8,
        fill: new Fill({ color: selected ? '#1f4fd1' : '#ffffff' }),
        stroke: new Stroke({ color: selected ? '#16389d' : '#1f4fd1', width: selected ? 3 : 2 })
      }),
      text: new Text({
        text: order || place.name,
        offsetY: -18,
        font: selected ? '700 12px sans-serif' : '600 11px sans-serif',
        fill: new Fill({ color: '#172033' }),
        stroke: new Stroke({ color: '#ffffff', width: 4 })
      })
    });
  };

  const routeStyle = (feature: Feature) => new Style({
    stroke: new Stroke({
      color: feature.get('color') as string,
      width: 4
    })
  });

  const rebuildPlaces = () => {
    if (!placeSource) return;
    placeSource.clear();
    const features = visiblePlaces().map(place => new Feature({
      geometry: new Point(fromLonLat([place.lng, place.lat])),
      place
    }));
    placeSource.addFeatures(features);
  };

  const rebuildRoutes = () => {
    if (!routeSource) return;
    routeSource.clear();

    dataset.days.forEach(day => {
      if (filters.day !== 'all' && day.id !== filters.day) return;
      const places = day.route
        .map(id => dataset.places.find(place => place.id === id))
        .filter((place): place is GuidePlace => Boolean(place));

      if (places.length < 2) return;

      routeSource.addFeature(new Feature({
        geometry: new LineString(places.map(place => fromLonLat([place.lng, place.lat]))),
        color: day.color
      }));
    });
  };

  const fit = () => {
    if (!map || !placeSource) return;
    const extent = placeSource.getExtent();
    if (!extent || extent.some(value => !Number.isFinite(value))) return;
    map.getView().fit(extent, {
      padding: [56, 56, 56, 56],
      maxZoom: 13,
      duration: 250
    });
  };

  const refresh = () => {
    rebuildRoutes();
    rebuildPlaces();
    fit();
  };

  const mount = (targetId: string) => {
    if (map) return;

    placeSource = new VectorSource();
    routeSource = new VectorSource();

    const baseLayer = new TileLayer({
      source: new OSM()
    });

    const routeLayer = new VectorLayer({
      source: routeSource,
      style: routeStyle,
      zIndex: 5
    });

    const placeLayer = new VectorLayer({
      source: placeSource,
      style: feature => placeStyle(feature as Feature),
      zIndex: 10
    });

    map = new Map({
      target: targetId,
      layers: [baseLayer, routeLayer, placeLayer],
      view: new View({
        center: fromLonLat(dataset.meta.center),
        zoom: dataset.meta.zoom
      })
    });

    map.on('singleclick', event => {
      const feature = map?.forEachFeatureAtPixel(event.pixel, item => item as Feature);
      const place = feature?.get('place') as GuidePlace | undefined;
      selectedSpotId = place?.id ?? null;
      placeSource?.changed();
      options.onSelect?.(place ?? null);
    });

    map.on('pointermove', event => {
      const target = map?.getTargetElement();
      if (!target || !map) return;
      target.style.cursor = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : '';
    });

    state = {
      mounted: true,
      targetId
    };

    refresh();
  };

  const setFilters = (nextFilters: GuideFilters) => {
    filters = nextFilters;
    refresh();
  };

  const setDataset = (nextDataset: GuideDataset) => {
    dataset = nextDataset;
    if (map) {
      map.getView().setCenter(fromLonLat(dataset.meta.center));
      map.getView().setZoom(dataset.meta.zoom);
    }
    refresh();
  };

  const selectSpot = (spotId: string | null) => {
    selectedSpotId = spotId;
    placeSource?.changed();
  };

  const unmount = () => {
    map?.setTarget(undefined);
    map = null;
    placeSource = null;
    routeSource = null;
    selectedSpotId = null;
    state = {
      mounted: false,
      targetId: ''
    };
  };

  const snapshot = () => state;

  return {
    mount,
    unmount,
    snapshot,
    setFilters,
    setDataset,
    selectSpot,
    fit,
    visiblePlaces
  };
};