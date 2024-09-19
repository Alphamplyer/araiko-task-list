<script setup lang="ts">
import { defineProps } from 'vue'
type ButtonType = 'outline' | 'primary' | 'text'
const { type = 'outline' } = defineProps<{
  type?: ButtonType
}>()
</script>

<template>
  <button
    v-if="type === 'outline'"
    class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs h-10 px-6 border border-gray-900 text-gray-900 hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] rounded-md"
    type="button"
  >
    <slot></slot>
  </button>
  <button
    v-else-if="type === 'primary'"
    class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-30 disabled:shadow-none disabled:pointer-events-none text-xs h-10 px-6 bg-zinc-900 text-white shadow-md shadow-zinc-900/10 hover:shadow-lg hover:shadow-zinc-900/20 focus:opacity-[0.75] hover:opacity-90 focus:shadow-none active:opacity-[0.85] active:shadow-none rounded-md"
    type="button"
  >
    <slot></slot>
  </button>
  <button
    v-else
    class="h-10 px-6 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-md select-none disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none hover:bg-gray-900/10 active:bg-gray-900/20"
    type="button"
  >
    <slot></slot>
  </button>
</template>
