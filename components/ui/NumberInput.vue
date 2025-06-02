<template>
  <div class="mb-4">
    <label :for="inputId" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <input
      :id="inputId"
      type="number"
      :value="modelValue"
      @input="$emit('update:modelValue', parseInt($event.target.value) || 0)"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

const inputId = computed(() => `number-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
</script> 