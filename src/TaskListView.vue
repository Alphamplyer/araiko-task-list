<script setup lang="ts">
import { ref } from 'vue'
import TaskList from './components/TaskList.vue'
import { useTaskListStore } from './stores/TaskListStore'
import { Task } from './models/Task'

const taskListStore = useTaskListStore()
const taskName = ref('')

function addTask() {
  if (!taskName.value) return
  taskListStore.taskList.addChild(Task.create(taskName.value))
  taskName.value = ''
}
</script>

<template>
  <n-card title="Add a new task">
    <n-space vertical>
      What do you want to do?
      <n-input v-model:value="taskName" type="text" placeholder="Basic Input" />
      <n-space justify="end">
        <n-button type="primary" @click="addTask" :disabled="taskName.length <= 0">Submit</n-button>
      </n-space>
    </n-space>
  </n-card>

  <n-divider />

  <task-list :tasks="taskListStore.taskList.children" />
</template>

<style scoped></style>
