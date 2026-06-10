import type { GuideDataset, GuideDay, GuidePlace } from '@/data/guideData';
import { guideDataset } from '@/data/guideData';
import { httpRequest, type AppError } from '@/services/httpClient';

type SpotDto = {
  id: number;
  itinerary_id: number;
  day_index: number;
  name: string;
  category: string | null;
  lng: number | null;
  lat: number | null;
  order_index: number;
  short_description: string | null;
  description: string | null;
};

type SpotListResponse = {
  itinerary_id: number;
  day_index: number | null;
  items: SpotDto[];
};

type RouteSegmentDto = {
  sequence_index: number;
  from_ref: number | null;
  to_ref: number | null;
};

type RouteDayDto = {
  day_index: number;
  segments: RouteSegmentDto[];
};

type RouteListResponse = {
  itinerary_id: number;
  day_index: number | null;
  items: RouteDayDto[];
};

export type GuideLoadResult = {
  dataset: GuideDataset;
  source: 'remote' | 'fallback';
  message: string;
  fallbackReason?: AppError['code'];
};

const palette = ['#c43d2b', '#206fba', '#1f9a6d', '#8b5cf6', '#f59e0b'];

const fallbackTitle = (dayIndex: number) => `Day ${dayIndex}`;
const fallbackColor = (dayIndex: number) => palette[(dayIndex - 1) % palette.length];

const buildRouteFromSegments = (segments: RouteSegmentDto[]): string[] => {
  const ordered: string[] = [];
  segments
    .slice()
    .sort((left, right) => left.sequence_index - right.sequence_index)
    .forEach(segment => {
      const fromId = segment.from_ref ? String(segment.from_ref) : null;
      const toId = segment.to_ref ? String(segment.to_ref) : null;
      if (fromId && ordered.at(-1) !== fromId && !ordered.includes(fromId)) {
        ordered.push(fromId);
      }
      if (toId && ordered.at(-1) !== toId && !ordered.includes(toId)) {
        ordered.push(toId);
      }
    });
  return ordered;
};

export const loadGuideDataset = async (itineraryId = 1): Promise<GuideLoadResult> => {
  try {
    const [spotsResponse, routesResponse] = await Promise.all([
      httpRequest<SpotListResponse>(`/spots?itineraryId=${itineraryId}`),
      httpRequest<RouteListResponse>(`/routes?itineraryId=${itineraryId}`)
    ]);

    if (!spotsResponse.items.length) {
      return {
        dataset: guideDataset,
        source: 'fallback',
        message: '后端当前无点位数据，已回退到本地基线。'
      };
    }

    const remotePlaces: GuidePlace[] = spotsResponse.items.map(item => ({
      id: String(item.id),
      day: item.day_index,
      category: (item.category ?? 'backup') as GuidePlace['category'],
      name: item.name,
      lng: item.lng ?? guideDataset.meta.center[0],
      lat: item.lat ?? guideDataset.meta.center[1],
      short: item.short_description ?? '已接入数据库点位',
      description: item.description ?? '当前点位来自后端数据库。'
    }));

    const staticDayMap = new Map(guideDataset.days.map(day => [day.id, day]));
    const routeDayMap = new Map(routesResponse.items.map(day => [day.day_index, day]));
    const presentDayIndexes = Array.from(new Set(remotePlaces.map(place => place.day))).sort((a, b) => a - b);

    const days: GuideDay[] = presentDayIndexes.map(dayIndex => {
      const staticDay = staticDayMap.get(dayIndex);
      const routeDay = routeDayMap.get(dayIndex);
      const sortedPlaces = remotePlaces
        .filter(place => place.day === dayIndex)
        .sort((left, right) => Number(left.id) - Number(right.id));

      const route = routeDay?.segments?.length
        ? buildRouteFromSegments(routeDay.segments)
        : sortedPlaces.map(place => place.id);

      return {
        id: dayIndex,
        title: staticDay?.title ?? fallbackTitle(dayIndex),
        color: staticDay?.color ?? fallbackColor(dayIndex),
        route
      };
    });

    return {
      dataset: {
        meta: guideDataset.meta,
        days,
        places: remotePlaces
      },
      source: 'remote',
      message: `已加载后端数据库点位 ${remotePlaces.length} 个。`
    };
  } catch (error) {
    const appError = error as AppError;
    return {
      dataset: guideDataset,
      source: 'fallback',
      message: appError.message,
      fallbackReason: appError.code
    };
  }
};