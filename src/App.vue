<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import TaskListView from './TaskListView.vue'
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <task-list-view />
  </n-config-provider>
</template>

<style scoped></style>
