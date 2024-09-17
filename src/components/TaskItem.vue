<script setup lang="ts">
import { Task } from '@/models/Task'
import TaskItemActionMenu from './TaskItemActionMenu.vue'
import { defineProps, ref } from 'vue'

const { task } = defineProps<{ task: Task }>()

const editName = ref(task.name)
const isEditing = ref(false)

function saveEdit() {
  task.setName(editName.value)
  isEditing.value = false
}
</script>

<template>
  <n-card :class="`task-item ${task.finished ? 'task-item-success' : ''}`">
    <n-space vertical>
      <n-text v-if="isEditing">
        <n-input v-model:value="editName" />
        <n-space class="edit-buttons" justify="end">
          <n-button type="primary" @click="saveEdit">Save</n-button>
          <n-button @click="isEditing = false">Cancel</n-button>
        </n-space>
      </n-text>
      <n-text v-else>
        {{ task.name }}
        <n-button @click="isEditing = true">Edit</n-button>
      </n-text>
      <n-text>Created at: <n-time :time="task.createdAt" /></n-text>
      <n-text v-if="task.finishedAt">Finished at: <n-time :time="task.finishedAt" /></n-text>
      <n-space justify="end">
        <task-item-action-menu :task="task" />
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

.edit-buttons {
  margin-top: 0.5rem;
}

.task-item-success {
  border-color: #5c8049;
}
</style>
