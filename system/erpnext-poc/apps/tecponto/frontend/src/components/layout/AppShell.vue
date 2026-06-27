<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-[var(--tp-page)] text-[var(--tp-text)]">
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="flex min-h-screen flex-col lg:pl-[264px]">
      <Topbar @toggle-sidebar="sidebarOpen = true" />
      <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
