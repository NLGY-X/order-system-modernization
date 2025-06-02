<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage :key="route.fullPath" />
    </NuxtLayout>
    
    <!-- Debug overlay -->
    <div v-if="showDebug" class="fixed bottom-0 right-0 bg-black text-white p-4 text-xs max-w-md">
      <h3 class="font-bold mb-2">Navigation Debug</h3>
      <p>Current Path: {{ route.path }}</p>
      <p>Route Name: {{ route.name }}</p>
      <p>Full Path: {{ route.fullPath }}</p>
      <p>Layout: {{ route.meta.layout || 'default' }}</p>
      <p>Page Key: {{ route.fullPath }}</p>
      <button @click="showDebug = false" class="mt-2 bg-red-500 px-2 py-1 rounded">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const route = useRoute()
const showDebug = ref(true)

// Watch for route changes
watch(() => route.fullPath, (newPath, oldPath) => {
  console.log('🔍 Route changed:', { from: oldPath, to: newPath })
  console.log('Route object:', route)
})

// Log initial mount
onMounted(() => {
  console.log('🔍 App.vue mounted, initial route:', route.fullPath)
})
</script>
