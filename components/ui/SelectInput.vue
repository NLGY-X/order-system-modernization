<template>
  <div class="mb-4">
    <label :for="inputId" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <select
      :id="inputId"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
    >
      <option value="">{{ placeholder || `Select ${label.toLowerCase()}` }}</option>
      <option
        v-for="option in options"
        :key="option.value || option.id"
        :value="option.value || option.id"
      >
        {{ option.label || option.name || option.country_name }}
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

const inputId = computed(() => `select-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
</script> 