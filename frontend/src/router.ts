import { createRouter, createWebHistory } from 'vue-router';

import ItineraryMapPage from '@/pages/ItineraryMapPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'itinerary-map',
      component: ItineraryMapPage
    }
  ]
});

export default router;