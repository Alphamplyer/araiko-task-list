<script setup lang="ts">
import { Task } from '@/models/Task'
import TaskItemActionMenu from './TaskItemActionMenu.vue'
import ACard from './ACard.vue'
import AButton from './AButton.vue'
import ATime from './ATime.vue'
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
  <div>
    <a-card :class="`mb-2 ${task.finished ? 'border-green-600 bg-green-100' : ''}`">
      <template #title>
        <div>
          <div v-if="isEditing" class="flex">
            <input
              class="form-text w-full h-10 placeholder:text-gray-400 bg-zinc-50 text-gray-700 text-sm border border-zinc-400 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:bg-white focus:border-zinc-600 hover:border-zinc-600 shadow-sm focus:shadow-md"
              type="text"
              v-model="editName"
            />
            <a-button class="ml-2" type="primary" @click="saveEdit">Save</a-button>
            <a-button @click="isEditing = false">Cancel</a-button>
          </div>
          <div v-else class="flex">
            <p class="flex-grow text-wrap break-words">{{ task.name }}</p>
            <a-button class="ml-2" @click="isEditing = true">Edit</a-button>
            <task-item-action-menu class="ml-2" :task="task" />
          </div>
        </div>
      </template>
      <template #content>
        <p>Created: <a-time :time="task.createdAt" /></p>
        <p v-if="task.finishedAt">Finished: <a-time :time="task.finishedAt" /></p>
      </template>
    </a-card>
    <div>
      <div v-if="task.children.length > 0" class="pl-4 border-l-2 border-zinc-300">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
