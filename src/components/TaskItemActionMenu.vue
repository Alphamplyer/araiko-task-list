<script setup lang="ts">
import { Task } from '@/models/Task'
import { defineProps, ref } from 'vue'

const { task } = defineProps<{ task: Task }>()

const showMenuOpen = ref(false)
function handleClick(key: string) {
  showMenuOpen.value = false
  switch (key) {
    case 'add-before':
      task.addBefore(Task.create('New Task'))
      break
    case 'add-children':
      task.addChild(Task.create('New Task'))
      break
    case 'add-after':
      task.addAfter(Task.create('New Task'))
      break
    case 'finish':
      task.markAsFinished()
      break
    case 'unfinished':
      task.markAsUnfinished()
      break
    case 'delete':
      task.delete()
      break
  }
}
</script>

<template>
  <n-popover class="actions-menu" trigger="manual" :show="showMenuOpen">
    <template #trigger>
      <n-button @click="showMenuOpen = !showMenuOpen">Actions</n-button>
    </template>
    <n-space vertical>
      <div class="menu-action" @click="handleClick('add-before')">Add before</div>
      <div class="menu-action" @click="handleClick('add-children')">Add children</div>
      <div class="menu-action" @click="handleClick('add-after')">Add after</div>
      <div
        :class="`menu-action ${task.finished ? 'menu-action-disabled' : ''}`"
        v-if="!task.finished"
        type="primary"
        @click="handleClick('finish')"
      >
        Finish
      </div>
      <div class="menu-action" v-if="task.finished" @click="handleClick('unfinished')">
        Unfinished
      </div>
      <div class="menu-action" type="error" @click="handleClick('delete')">Delete</div>
    </n-space>
  </n-popover>
</template>

<style scoped>
.menu-action {
  padding: 0.3rem 1rem;
  user-select: none;
  text-align: center;
}

.menu-action-disabled {
  color: #cccccc45 !important;
}

.menu-action-disabled:hover {
  cursor: initial !important;
  color: #cccccc45 !important;
  background-color: initial !important;
}

.menu-action:hover {
  cursor: pointer;
  background-color: rgb(127, 231, 196, 0.5);
}
</style>

<style>
.actions-menu {
  padding: 0 !important;
}
</style>
