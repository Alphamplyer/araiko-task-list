<script setup lang="ts">
import { defineProps } from 'vue'
const { maxValue, value } = defineProps<{
  maxValue: number
  value: number
}>()

// 4
// 5 100
</script>

<template>
  <div class="flex gap-2 h-4 items-center">
    <div class="h-2 w-full bg-zinc-300 shadow-md rounded-full overflow-hidden">
      <div
        class="h-2 bg-green-600 rounded-full"
        :style="{
          width: maxValue === 0 ? '0' : (100 * value) / maxValue + '%'
        }"
      ></div>
    </div>
    <span class="relative top-[-2px] whitespace-nowrap">{{ value }}/{{ maxValue }} Finished</span>
  </div>
</template>
