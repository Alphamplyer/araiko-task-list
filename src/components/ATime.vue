<script setup lang="ts">
import moment from 'moment'
import { defineProps } from 'vue'
const { time } = defineProps<{ time: Date }>()

function formatDate(date: Date) {
  return moment(date).format('LLL')
}
</script>

<template>
  <span>{{ formatDate(time) }}</span>
</template>
