<script setup lang="ts">
import { Task } from '@/models/Task'
import TaskItemActionMenu from './TaskItemActionMenu.vue'
import ACard from './ACard.vue'
import AButton from './AButton.vue'
import ArrowDownIcon from './icons/ArrowDownIcon.vue'
import ATime from './ATime.vue'
import AProgressBar from './AProgressBar.vue'
import { computed, defineProps, ref } from 'vue'

const { task } = defineProps<{ task: Task }>()

const editName = ref(task.name)
const isEditing = ref(false)

function saveEdit() {
  task.setName(editName.value)
  isEditing.value = false
}

const collapseSubTask = ref(true)
const hasChildren = computed(() => task.children.length > 0)
</script>

<template>
  <div>
    <a-card :class="`mb-2 ${task.finished ? '!border-green-600 !bg-green-100' : ''}`">
      <template #title>
        <div>
          <div v-if="isEditing" class="flex">
            <input
              class="form-text w-full h-10 placeholder:text-gray-400 bg-zinc-50 text-gray-700 text-sm border border-zinc-400 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:bg-white focus:border-zinc-600 hover:border-zinc-600 shadow-sm focus:shadow-md"
              type="text"
              v-model="editName"
            />
            <a-button class="ml-2" type="primary" @click="saveEdit">Save</a-button>
            <a-button class="ml-2" @click="isEditing = false">Cancel</a-button>
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
        <div v-if="hasChildren" class="flex gap-2 h-4 items-center mt-2">
          <arrow-down-icon
            @click="collapseSubTask = !collapseSubTask"
            :class="`block w-10 h-10 ${collapseSubTask ? '-rotate-90' : ''}`"
          />
          <a-progress-bar
            class="grow"
            :maxValue="task.getSubTaskCount()"
            :value="task.getFinishedSubTaskCount()"
          />
        </div>
      </template>
    </a-card>
    <div v-if="!collapseSubTask">
      <div v-if="hasChildren" class="pl-4 border-l-2 border-zinc-300">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
