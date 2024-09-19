<script setup lang="ts">
import { ref } from 'vue'
import TaskList from './components/TaskList.vue'
import AButton from './components/AButton.vue'
import ACard from './components/ACard.vue'
import ADivider from './components/ADivider.vue'
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
    taskListStore.importFromJson(text)
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

function clearTaskList() {
  taskListStore.clear()
}
</script>

<template>
  <div>
    <a-button @click="uploadJsonTaskList">Import Task List</a-button>
    <a-button class="ml-2" @click="downloadJsonTaskList">Export Task List</a-button>
  </div>
  <a-card class="add-task-card">
    <template #title>Add a new Task</template>
    <template #content>
      <div>
        <p class="text-sm">What do you want to do?</p>
        <input
          class="form-text w-full mt-1 h-10 placeholder:text-gray-400 bg-zinc-50 text-gray-700 text-sm border border-zinc-400 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:bg-white focus:border-zinc-600 hover:border-zinc-600 shadow-sm focus:shadow-md"
          v-model="taskName"
          type="text"
          placeholder="Basic Input"
        />
        <div class="mt-2 float-end">
          <a-button type="primary" @click="addTask" :disabled="taskName.length <= 0"
            >Submit</a-button
          >
        </div>
      </div>
    </template>
  </a-card>

  <div class="mt-4 flex gap-2 items-center">
    <a-divider class="grow" />
    <a-button type="text" @click="clearTaskList">Clear</a-button>
    <a-divider class="w-8" />
  </div>

  <task-list :tasks="taskListStore.taskList.children" />
</template>

<style scoped>
.add-task-card {
  margin-top: 1rem;
}
</style>
