<template>
  <div class="space-y-2">
    <label :for="id" class="block text-sm font-semibold text-gray-200">
      {{ label }}
    </label>
    <input
      :id="id"
      type="number"
      :value="modelValue"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      @input="$emit('update:modelValue', parseInt($event.target.value) || 0)"
      class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:border-gray-500/70"
    />
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
    type: Number,
    default: 0
  },
  placeholder: {
    type: String,
    default: ''
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue'])

const id = computed(() => `number-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
</script> 