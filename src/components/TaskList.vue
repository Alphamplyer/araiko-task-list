<script setup lang="ts">
import { computed, defineProps } from 'vue'
import TaskItem from './TaskItem.vue'
import { taskListRootGroupName } from '@/config/constants'
const { tasks, parentId } = defineProps<{ tasks: RootTaskNode[]; parentId?: string }>()
import draggable from 'vuedraggable'
import type { RootTaskNode } from '@/models/Task'

const groupName = computed(() => parentId || taskListRootGroupName)
</script>

<template>
  <draggable :list="tasks" tag="div" item-key="id" :group="{ name: groupName }">
    <template #item="{ element }">
      <task-item :key="element.id" :task="element" class="draggable">
        <task-list :parent-id="element.id" :tasks="element.children" />
      </task-item>
    </template>
  </draggable>
</template>

<style scoped></style>
