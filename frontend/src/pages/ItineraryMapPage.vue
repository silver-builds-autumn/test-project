<template>
  <section class="page-grid">
    <div class="map-column">
      <div class="toolbar-card">
        <div>
          <p class="eyebrow">OpenLayers Migration</p>
          <h2>行程地图页</h2>
        </div>
        <div class="filters-row">
          <label>
            <span>日期</span>
            <select :value="String(ui.activeDay)" @change="onDayChange">
              <option value="all">全部</option>
              <option v-for="day in runtimeDataset.days" :key="day.id" :value="String(day.id)">Day {{ day.id }}</option>
            </select>
          </label>
          <label>
            <span>类型</span>
            <select :value="ui.activeCategory" @change="onCategoryChange">
              <option value="all">全部</option>
              <option value="dragon">龙舟</option>
              <option value="sight">景点</option>
              <option value="food">餐饮</option>
              <option value="station">交通</option>
            </select>
          </label>
          <label>
            <span>面板态</span>
            <select :value="ui.panelMode" @change="onPanelModeChange">
              <option value="summary">summary</option>
              <option value="half">half</option>
              <option value="full">full</option>
            </select>
          </label>
        </div>
        <div class="map-toolbar-actions">
          <button type="button" @click="guideMap.fit()">重置视角</button>
          <span>当前可见点位 {{ visiblePlaces.length }} 个</span>
          <span>{{ dataSourceLabel }}</span>
        </div>
        <p class="eyebrow">{{ statusMessage }}</p>
      </div>

      <div id="map-root" class="map-placeholder"></div>
    </div>

    <aside :class="['panel-column', `panel-${ui.panelMode}`]">
      <div class="panel-handle" aria-label="详情面板状态切换">
        <span class="panel-grabber"></span>
        <div class="panel-mode-tabs">
          <button type="button" :class="{ active: ui.panelMode === 'summary' }" @click="setPanelMode('summary')">摘要</button>
          <button type="button" :class="{ active: ui.panelMode === 'half' }" @click="setPanelMode('half')">半屏</button>
          <button type="button" :class="{ active: ui.panelMode === 'full' }" @click="setPanelMode('full')">全屏</button>
        </div>
      </div>

      <div class="panel-scroll">
        <article class="panel-card detail-card">
          <p class="eyebrow">Selected Spot</p>
          <template v-if="selectedPlace">
            <h3>{{ selectedPlace.name }}</h3>
            <p>{{ selectedPlace.short }}</p>
            <small>{{ selectedPlace.description }}</small>
          </template>
          <p v-else class="empty-state">点击地图点位或右侧列表后，这里会同步显示当前选中节点。</p>
        </article>

        <article class="panel-card">
          <p class="eyebrow">Visible Places</p>
          <div class="spot-list">
            <button
              v-for="place in visiblePlaces"
              :key="place.id"
              type="button"
              class="spot-item"
              :class="{ active: place.id === ui.selectedSpotId }"
              @click="focusPlace(place.id)"
            >
              <strong>{{ place.name }}</strong>
              <p>Day {{ place.day }} · {{ place.short }}</p>
            </button>
          </div>
        </article>
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { guideDataset, type GuideDataset } from '@/data/guideData';
import { createGuideMapFacade } from '@/map/guideMapFacade';
import { loadGuideDataset } from '@/services/guideApi';
import { useUiStore, type PanelMode } from '@/stores/ui';

const ui = useUiStore();
const runtimeDataset = ref<GuideDataset>(guideDataset);
const dataSourceLabel = ref('当前数据源：本地基线');
const statusMessage = ref('正在使用静态基线数据。');

const guideMap = createGuideMapFacade({
  dataset: runtimeDataset.value,
  onSelect: place => {
    ui.setSelectedSpot(place?.id ?? null);
  }
});

const visiblePlaces = computed(() => runtimeDataset.value.places.filter(place => {
  const dayOk = ui.activeDay === 'all' || place.day === ui.activeDay;
  const categoryOk = ui.activeCategory === 'all' || place.category === ui.activeCategory;
  return dayOk && categoryOk;
}));

const selectedPlace = computed(() => runtimeDataset.value.places.find(place => place.id === ui.selectedSpotId) ?? null);

const loadRuntimeDataset = async () => {
  const result = await loadGuideDataset(1);
  runtimeDataset.value = result.dataset;
  guideMap.setDataset(result.dataset);
  dataSourceLabel.value = result.source === 'remote' ? '当前数据源：后端数据库' : '当前数据源：本地降级';
  statusMessage.value = result.message;

  const selectedStillExists = result.dataset.places.some(place => place.id === ui.selectedSpotId);
  if (!selectedStillExists) {
    ui.setSelectedSpot(result.dataset.places[0]?.id ?? null);
  }
};

const onDayChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  ui.setActiveDay(value === 'all' ? 'all' : Number(value));
};

const onCategoryChange = (event: Event) => {
  ui.setActiveCategory((event.target as HTMLSelectElement).value);
};

const onPanelModeChange = (event: Event) => {
  ui.setPanelMode((event.target as HTMLSelectElement).value as PanelMode);
};

const setPanelMode = (mode: PanelMode) => {
  ui.setPanelMode(mode);
};

const focusPlace = (spotId: string) => {
  ui.setSelectedSpot(spotId);
};

watch(
  () => ({ day: ui.activeDay, category: ui.activeCategory }),
  filters => {
    guideMap.setFilters(filters);
  },
  { deep: true }
);

watch(
  () => ui.selectedSpotId,
  spotId => {
    guideMap.selectSpot(spotId);
  }
);

onMounted(() => {
  guideMap.mount('map-root');
  guideMap.setFilters({ day: ui.activeDay, category: ui.activeCategory });
  ui.setMapReady(true);
  void loadRuntimeDataset();
});

onUnmounted(() => {
  guideMap.unmount();
  ui.setMapReady(false);
});
</script>