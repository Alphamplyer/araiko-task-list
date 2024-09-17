<script setup lang="ts">
import { Task } from '@/models/Task'
import { defineProps } from 'vue'

const { task } = defineProps<{ task: Task }>()
</script>

<template>
  <n-card class="task-item">
    <n-space vertical>
      <n-text>{{ task.name }} - {{ task.id }}</n-text>
      <n-text>Created at: <n-time :time="task.createdAt" /></n-text>
      <n-text v-if="task.finishedAt">Finished at: <n-time :time="task.finishedAt" /></n-text>
      <n-space justify="end">
        <n-button @click="task.addChild(Task.create('New Task'))">Add children</n-button>
        <n-button
          v-if="!task.finished"
          type="primary"
          @click="task.markAsFinished()"
          :disabled="!task.canBeFinished()"
          >Finish</n-button
        >
        <n-button v-if="task.finished" @click="task.markAsUnfinished()">Unfinished</n-button>
        <n-button type="error" @click="task.delete()">Delete</n-button>
      </n-space>
      <n-collapse v-if="task.children.length > 0">
        <n-collapse-item title="Sub tasks">
          <slot></slot>
        </n-collapse-item>
      </n-collapse>
    </n-space>
  </n-card>
</template>

<style scoped>
.task-item {
  position: relative;
  margin-bottom: 1rem;
}

.n-collapse .n-collapse-item .n-collapse-item {
  margin-left: 0 !important;
}

.sub-task-item {
  margin-left: 1rem;
}
</style>
