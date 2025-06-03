<template>
  <div class="space-y-2">
    <label :for="id" class="block text-sm font-semibold text-gray-200">
      {{ label }}
    </label>
    <select
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:border-gray-500/70"
    >
      <option value="" disabled class="bg-gray-900 text-gray-400">{{ placeholder }}</option>
      <option 
        v-for="option in options" 
        :key="option.id || option.name" 
        :value="option.id || option.name"
        class="bg-gray-900 text-white"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const id = computed(() => `select-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
</script> 