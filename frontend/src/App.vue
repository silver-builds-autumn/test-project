<template>
  <div class="app-shell">
    <header class="app-header">
      <div>
        <p class="eyebrow">Fullstack Migration</p>
        <h1>假期旅行 App</h1>
        <p class="subtitle">当前阶段先固化前端骨架、状态层和页面结构，地图能力下一步接入。</p>
      </div>
      <nav class="nav-tabs">
        <RouterLink to="/">行程地图</RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>