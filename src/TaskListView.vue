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

function uploadJsonTaskList() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const text = await file.text()
    //taskListStore.importFromJson(text)
  }
  input.click()
}

function downloadJsonTaskList() {
  const downloadElement = document.createElement('a')
  const json = taskListStore.exportToJson()
  downloadElement.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(json))
  downloadElement.setAttribute('download', 'tasklist_backup.json')
  downloadElement.click()
  downloadElement.remove()
}
</script>

<template>
  <n-space>
    <n-button @click="uploadJsonTaskList" disabled>Import Task List</n-button>
    <n-button @click="downloadJsonTaskList">Export Task List</n-button>
  </n-space>
  <n-card class="add-task-card" title="Add a new task">
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

<style scoped>
.add-task-card {
  margin-top: 1rem;
}
</style>
