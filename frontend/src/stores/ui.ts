import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export type PanelMode = 'summary' | 'half' | 'full';

export const useUiStore = defineStore('ui', () => {
  const activeDay = ref<number | 'all'>('all');
  const activeCategory = ref<string>('all');
  const selectedSpotId = ref<string | null>(null);
  const panelMode = ref<PanelMode>('half');
  const mapReady = ref(false);

  const filters = computed(() => ({
    day: activeDay.value,
    category: activeCategory.value
  }));

  const setActiveDay = (value: number | 'all') => {
    activeDay.value = value;
  };

  const setActiveCategory = (value: string) => {
    activeCategory.value = value;
  };

  const setSelectedSpot = (value: string | null) => {
    selectedSpotId.value = value;
  };

  const setPanelMode = (value: PanelMode) => {
    panelMode.value = value;
  };

  const setMapReady = (value: boolean) => {
    mapReady.value = value;
  };

  return {
    activeDay,
    activeCategory,
    selectedSpotId,
    panelMode,
    mapReady,
    filters,
    setActiveDay,
    setActiveCategory,
    setSelectedSpot,
    setPanelMode,
    setMapReady
  };
});